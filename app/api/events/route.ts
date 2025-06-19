import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as memo from '@solana/spl-memo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      date,
      location,
      imageUrl,
      nftName,
      nftSymbol,
      nftImageUrl,
      creatorWalletAddress,
      transactionSignature,
      network,
    } = body;

    // Basic validation
    if (!title || !date || !nftName || !nftSymbol || !creatorWalletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: title, date, nftName, nftSymbol, creatorWalletAddress' },
        { status: 400 }
      );
    }

    // Find or create the user based on wallet address
    let user = await prisma.user.findUnique({
      where: { walletAddress: creatorWalletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: creatorWalletAddress,
        },
      });
    }

    // Create the event
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        imageUrl,
        nftName,
        nftSymbol,
        nftImageUrl,
        creatorId: user.id,
      },
    });

    // Create on-chain record using memo program
    try {
      // Create connection to Solana network
      const connection = new Connection(
        network === 'mainnet-beta' 
          ? 'https://api.mainnet-beta.solana.com' 
          : 'https://api.devnet.solana.com'
      );
      
      // The frontend would handle creating and signing this transaction
      // We just need the signature to verify it happened
      if (transactionSignature) {
        // Verify the transaction
        const txInfo = await connection.getTransaction(transactionSignature);
        
        if (txInfo && txInfo.meta && !txInfo.meta.err) {
          // Update the event with the transaction signature
          await prisma.event.update({
            where: { id: newEvent.id },
            data: { 
              onChainTxSignature: transactionSignature 
            }
          });
        }
      }
      
      return NextResponse.json({
        ...newEvent,
        onChainTxSignature: transactionSignature || null
      }, { status: 201 });
      
    } catch (blockchainError: unknown) {
      console.error("Failed to verify on-chain record:", blockchainError);
      // Still return success since the database record was created
      return NextResponse.json({
        ...newEvent,
        blockchainStatus: "failed",
        blockchainError: blockchainError instanceof Error ? blockchainError.message : String(blockchainError)
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating event:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// Get all events
export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: {
            id: true,
            walletAddress: true,
            name: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
