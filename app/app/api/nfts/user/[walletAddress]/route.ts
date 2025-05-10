import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API endpoint to fetch all NFTs minted to a specific wallet address
 * This is used by the profile page to display the user's NFT collection
 */
// Define the proper context parameter type
type WalletContext = {
  params: {
    walletAddress: string;
  }
};

export async function GET(
  request: NextRequest,
  context: WalletContext
) {
  // In Next.js 14+ we need to await params before using them
  const params = await context.params;
  const walletAddress = params.walletAddress;

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  try {
    // Look up all attendance records with NFTs for this wallet
    const attendances = await prisma.attendance.findMany({
      where: {
        user: {
          walletAddress: walletAddress
        },
        nftMintAddress: {
          not: null
        }
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
        }
      }
    });

    // Format the NFT data for the client
    const nfts = attendances.map(attendance => {
      // Format date for display
      const eventDate = new Date(attendance.event.date);
      const formattedDate = eventDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      return {
        mint: attendance.nftMintAddress!,
        tokenAccount: '',
        metadata: {
          name: attendance.event.nftName || `Attendance: ${attendance.event.title}`,
          symbol: attendance.event.nftSymbol || 'POAP',
          description: `Proof of attendance for ${attendance.event.title} on ${formattedDate}`,
          image: attendance.event.nftImageUrl || '',
          attributes: [
            { trait_type: 'Event', value: attendance.event.title },
            { trait_type: 'Date', value: formattedDate },
            { trait_type: 'Event ID', value: attendance.event.id }
          ]
        },
        imageUrl: attendance.event.nftImageUrl
      };
    });

    return NextResponse.json(nfts);
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    return NextResponse.json({ error: 'Failed to fetch user NFTs' }, { status: 500 });
  }
} 