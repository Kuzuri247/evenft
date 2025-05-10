import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Connection } from '@solana/web3.js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, userWalletAddress, transactionSignature, network = 'devnet', fullName, socialLink } = body;

    // Basic validation
    if (!eventId || !userWalletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, userWalletAddress' },
        { status: 400 }
      );
    }

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Find or create the user based on wallet address
    let user = await prisma.user.findUnique({
      where: { walletAddress: userWalletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: userWalletAddress,
          name: fullName || undefined,
        },
      });
    } else if (fullName && (!user.name || user.name !== fullName)) {
      // Update user's name if provided and different from current
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: fullName },
      });
    }

    // Check if user is already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId,
        userId: user.id,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'User is already registered for this event', registration: existingRegistration },
        { status: 409 }
      );
    }
    
    // If a transaction signature is provided, verify it on-chain
    let verifiedOnChain = false;
    
    if (transactionSignature) {
      try {
        // Connect to the appropriate Solana network
        const connection = new Connection(
          network === 'mainnet-beta' 
            ? 'https://api.mainnet-beta.solana.com' 
            : 'https://api.devnet.solana.com'
        );
        
        // Get transaction info
        const txInfo = await connection.getTransaction(transactionSignature);
        
        // If transaction exists and is successful
        if (txInfo && txInfo.meta && !txInfo.meta.err) {
          verifiedOnChain = true;
        }
      } catch (error) {
        console.error('Error verifying transaction:', error);
        // Continue with registration even if verification fails
      }
    }

    // Create the registration
    // Until we run the migration, we won't store onChainTxSignature, verifiedOnChain, and metadata
    const registration = await prisma.registration.create({
      data: {
        eventId,
        userId: user.id,
        // We'll add these back after migration
        // onChainTxSignature: transactionSignature,
        // verifiedOnChain,
        // metadata: socialLink ? JSON.stringify({ socialLink }) : undefined,
      },
    });

    // Store the socialLink and other info in the response even if we can't store it in DB yet
    return NextResponse.json(
      { 
        message: 'Successfully registered for event', 
        registration,
        onChain: verifiedOnChain,
        transactionSignature,
        userInfo: {
          fullName,
          socialLink
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering for event:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to register for event' }, { status: 500 });
  }
} 