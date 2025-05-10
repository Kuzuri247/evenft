import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');
    const userWalletAddress = searchParams.get('userWalletAddress');

    // Basic validation
    if (!eventId || !userWalletAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters: eventId, userWalletAddress' },
        { status: 400 }
      );
    }

    // Find user by wallet address
    const user = await prisma.user.findUnique({
      where: { walletAddress: userWalletAddress },
    });

    // If user doesn't exist, they can't be registered
    if (!user) {
      return NextResponse.json({ registered: false });
    }

    // Check if registration exists
    const registration = await prisma.registration.findFirst({
      where: {
        eventId,
        userId: user.id,
      },
    });

    return NextResponse.json({ registered: !!registration });
  } catch (error) {
    console.error('Error checking registration:', error);
    return NextResponse.json({ error: 'Failed to check registration status' }, { status: 500 });
  }
} 