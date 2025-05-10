import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API endpoint to fetch NFT metadata by mint address
 * This is used by the profile page to display NFT details
 */
export async function GET(
  request: NextRequest,
  context: { params: { mintAddress: string } }
) {
  // In Next.js 14+ we need to await params before using them
  const params = await context.params;
  const mintAddress = params.mintAddress;

  if (!mintAddress) {
    return NextResponse.json({ error: 'NFT mint address is required' }, { status: 400 });
  }

  try {
    // Look up attendance record by NFT mint address
    const attendance = await prisma.attendance.findFirst({
      where: { 
        nftMintAddress: mintAddress 
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            nftName: true,
            nftSymbol: true,
            nftImageUrl: true,
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
          }
        }
      }
    });

    if (!attendance) {
      return NextResponse.json({ error: 'NFT not found' }, { status: 404 });
    }

    // Format date for display
    const eventDate = new Date(attendance.event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Build NFT metadata in standard format
    const nftMetadata = {
      name: attendance.event.nftName || `Attendance: ${attendance.event.title}`,
      symbol: attendance.event.nftSymbol || 'POAP',
      description: `Proof of attendance for ${attendance.event.title} on ${formattedDate}`,
      image: attendance.event.nftImageUrl || '',
      attributes: [
        { trait_type: 'Event', value: attendance.event.title },
        { trait_type: 'Date', value: formattedDate },
        { trait_type: 'Attendee', value: attendance.user.name || attendance.user.walletAddress },
        { trait_type: 'Event ID', value: attendance.event.id }
      ],
      externalUrl: `/events/${attendance.event.id}`
    };

    return NextResponse.json(nftMetadata);
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch NFT metadata' }, { status: 500 });
  }
} 