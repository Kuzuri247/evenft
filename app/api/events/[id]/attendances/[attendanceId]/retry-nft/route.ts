import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  PublicKey,
  Connection,
  clusterApiUrl,
} from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { createAttendanceNFT } from '@/lib/solana/nftHelpers';
import { getMinterKeypair } from '@/lib/solana/walletConfig';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; attendanceId: string } }
) {
  const eventId = params.id;
  const attendanceId = params.attendanceId;

  if (!eventId || !attendanceId) {
    return NextResponse.json({ error: 'Event ID and Attendance ID are required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { confirmedBy, userId } = body;

    if (!confirmedBy || !userId) {
      return NextResponse.json(
        { error: 'Confirmer wallet address and user ID are required' },
        { status: 400 }
      );
    }

    // Get the attendance record
    const attendance = await prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            nftName: true,
            nftSymbol: true,
            nftImageUrl: true,
            creator: {
              select: {
                walletAddress: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            walletAddress: true,
            name: true,
          },
        },
      },
    });

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 });
    }

    // Verify the event matches
    if (attendance.eventId !== eventId) {
      return NextResponse.json({ error: 'Attendance does not belong to this event' }, { status: 400 });
    }

    // Verify the confirmer is the event creator
    if (attendance.event.creator.walletAddress !== confirmedBy) {
      return NextResponse.json(
        { error: 'Only the event creator can retry NFT minting' },
        { status: 403 }
      );
    }

    // Check if NFT was already minted
    if (attendance.nftMintAddress) {
      return NextResponse.json(
        { error: 'NFT was already minted for this attendance record' },
        { status: 400 }
      );
    }

    // Mint NFT for the attendee
    let nftMintAddress = null;
    let nftTransactionSignature = null;

    try {
      // Only try to mint if we have a user wallet address
      if (attendance.user.walletAddress && attendance.event.nftImageUrl) {
        console.log('Starting NFT minting process (retry)...');

        // Check if MINTER_PRIVATE_KEY is configured
        if (!process.env.MINTER_PRIVATE_KEY) {
          console.error('⚠️ MINTER_PRIVATE_KEY not found in environment variables. Please add it to your .env file.');
          throw new Error('NFT minting wallet not properly configured');
        }

        // Set up Solana connection
        const NETWORK = process.env.SOLANA_NETWORK || 'devnet';
        const endpoint = clusterApiUrl(NETWORK as anchor.web3.Cluster);
        const connection = new Connection(endpoint);

        // Use the configured minter wallet
        const minterWallet = getMinterKeypair();
        console.log('Using minter wallet:', minterWallet.publicKey.toString());

        // The attendee's wallet where the NFT will be minted to
        const receiverWallet = new PublicKey(attendance.user.walletAddress);

        // Format date for display
        const eventDate = new Date(attendance.event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        // Prepare NFT metadata
        const nftMetadata = {
          name: attendance.event.nftName || `Attendance: ${attendance.event.title}`,
          symbol: attendance.event.nftSymbol || 'POAP',
          description: `Proof of attendance for ${attendance.event.title} on ${formattedDate}`,
          image: attendance.event.nftImageUrl,
          attributes: [
            { trait_type: 'Event', value: attendance.event.title },
            { trait_type: 'Date', value: formattedDate },
            { trait_type: 'Attendee', value: attendance.user.name || attendance.user.walletAddress }
          ]
        };

        // Create the NFT
        console.log('Creating NFT with metadata (retry):', nftMetadata);
        const nftResult = await createAttendanceNFT(
          connection,
          minterWallet,
          receiverWallet,
          nftMetadata
        );

        nftMintAddress = nftResult.mintAddress;
        nftTransactionSignature = nftResult.txSignature;

        console.log('NFT minted successfully (retry)!');
        console.log('Mint address:', nftMintAddress);
        console.log('Transaction signature:', nftTransactionSignature);
      } else {
        console.log('Skipping NFT mint - missing wallet address or NFT image URL');
      }
    } catch (nftError) {
      console.error('Failed to mint NFT (retry):', nftError);
      return NextResponse.json({ error: 'Failed to mint NFT' }, { status: 500 });
    }

    // Update the attendance record with NFT information
    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        nftMintAddress,
        nftTransactionSignature,
      },
    });

    return NextResponse.json({
      ...updatedAttendance,
      nftMinted: !!nftMintAddress,
    });
  } catch (error) {
    console.error('Error retrying NFT mint:', error);
    return NextResponse.json({ error: 'Failed to retry NFT minting' }, { status: 500 });
  }
} 