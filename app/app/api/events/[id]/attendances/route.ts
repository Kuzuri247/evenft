import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  PublicKey, 
  Connection, 
  clusterApiUrl, 
  Keypair 
} from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { createAttendanceNFT } from '@/lib/solana/nftHelpers';
import { getMinterKeypair } from '@/lib/solana/walletConfig';

// Fetch all attendances for an event
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // In Next.js 14+ we need to await params before using them
  const params = await context.params;
  const eventId = params.id;
  
  if (!eventId) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }
  
  try {
    const attendances = await prisma.attendance.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
          }
        }
      }
    });
    
    return NextResponse.json(attendances);
  } catch (error) {
    console.error('Error fetching attendances:', error);
    return NextResponse.json({ error: 'Failed to fetch attendances' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // In Next.js 14+ we need to await params before using them
  const params = await context.params;
  const eventId = params.id;

  if (!eventId) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { registrationId, confirmedBy } = body;

    if (!registrationId || !confirmedBy) {
      return NextResponse.json(
        { error: 'Registration ID and confirmer wallet address are required' },
        { status: 400 }
      );
    }

    // Get the registration
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: {
          select: {
            id: true,
            creatorId: true,
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

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Verify the event exists and belongs to the current event
    if (registration.eventId !== eventId) {
      return NextResponse.json({ error: 'Registration does not belong to this event' }, { status: 400 });
    }

    // Verify the confirmer is the event creator
    if (registration.event.creator.walletAddress !== confirmedBy) {
      return NextResponse.json(
        { error: 'Only the event creator can confirm attendance' },
        { status: 403 }
      );
    }

    // Check if attendance is already confirmed
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        userId_eventId: {
          userId: registration.userId,
          eventId,
        },
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance already confirmed' },
        { status: 400 }
      );
    }

    // Mint NFT for the attendee
    let nftMintAddress = null;
    let nftTransactionSignature = null;

    try {
      // Only try to mint if we have a user wallet address
      if (registration.user.walletAddress && registration.event.nftImageUrl) {
        console.log('Starting NFT minting process...');

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
        const receiverWallet = new PublicKey(registration.user.walletAddress);
        
        // Format date for display
        const eventDate = new Date(registration.event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        // Prepare NFT metadata
        const nftMetadata = {
          name: registration.event.nftName || `Attendance: ${registration.event.title}`,
          symbol: registration.event.nftSymbol || 'POAP',
          description: `Proof of attendance for ${registration.event.title} on ${formattedDate}`,
          image: registration.event.nftImageUrl,
          attributes: [
            { trait_type: 'Event', value: registration.event.title },
            { trait_type: 'Date', value: formattedDate },
            { trait_type: 'Attendee', value: registration.user.name || registration.user.walletAddress }
          ]
        };

        // Create the NFT
        console.log('Creating NFT with metadata:', nftMetadata);
        const nftResult = await createAttendanceNFT(
          connection,
          minterWallet,
          receiverWallet,
          nftMetadata
        );

        nftMintAddress = nftResult.mintAddress;
        nftTransactionSignature = nftResult.txSignature;
        
        console.log('NFT minted successfully!');
        console.log('Mint address:', nftMintAddress);
        console.log('Transaction signature:', nftTransactionSignature);
      } else {
        console.log('Skipping NFT mint - missing wallet address or NFT image URL');
      }
    } catch (nftError) {
      console.error('Failed to mint NFT:', nftError);
      // We'll continue to create the attendance record even if NFT minting fails
    }

    // Create the attendance record
    const attendance = await prisma.attendance.create({
      data: {
        userId: registration.userId,
        eventId,
        nftMintAddress,
        nftTransactionSignature,
      },
    });

    return NextResponse.json({
      ...attendance,
      nftMinted: !!nftMintAddress,
    });
  } catch (error) {
    console.error('Error confirming attendance:', error);
    return NextResponse.json({ error: 'Failed to confirm attendance' }, { status: 500 });
  }
} 