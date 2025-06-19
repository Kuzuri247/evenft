import { Connection, PublicKey } from '@solana/web3.js';

// The SPL Token Program ID on Solana
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
  externalUrl?: string;
}

export interface NFTData {
  mint: string;
  tokenAccount: string;
  metadata: NFTMetadata | null;
  imageUrl: string | null;
}

/**
 * Fetch all NFTs owned by a specific wallet address
 * @param walletAddress The Solana wallet address to fetch NFTs for
 * @param connection The Solana connection
 * @returns Array of NFT data
 */
export async function fetchUserNFTs(walletAddress: string, connection: Connection): Promise<NFTData[]> {
  try {
    console.log('Fetching NFTs for wallet:', walletAddress);
    
    // First, let's directly fetch the NFTs we know about from our API
    // This ensures our event NFTs always show up even if the Solana query has issues
    let dbNfts: NFTData[] = [];
    try {
      console.log('Fetching EventSeal NFTs from API');
      const response = await fetch(`/api/nfts/user/${walletAddress}`);
      
      if (response.ok) {
        dbNfts = await response.json();
        console.log(`Found ${dbNfts.length} NFTs in the database`);
      } else {
        console.error('Error fetching NFTs from API:', response.statusText);
      }
    } catch (apiError) {
      console.error('Error fetching NFTs from API:', apiError);
    }
    
    // Now also fetch from Solana blockchain for any other NFTs not from our platform
    const walletPublicKey = new PublicKey(walletAddress);
    
    // Fetch all token accounts owned by this wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPublicKey,
      { programId: TOKEN_PROGRAM_ID }
    );
    
    console.log(`Found ${tokenAccounts.value.length} token accounts on Solana`);
    
    // Filter for NFTs (tokens with amount 1 and decimals 0)
    const nftAccounts = tokenAccounts.value.filter(account => {
      const amount = account.account.data.parsed.info.tokenAmount;
      return amount.decimals === 0 && amount.uiAmount === 1;
    });
    
    console.log(`Found ${nftAccounts.length} NFTs on Solana`);
    
    // Extract NFT data
    const blockchainNfts = await Promise.all(
      nftAccounts.map(async account => {
        const mintAddress = account.account.data.parsed.info.mint;
        const tokenAccountAddress = account.pubkey.toString();
        
        // Skip NFTs we already have from our database
        if (dbNfts.some(nft => nft.mint === mintAddress)) {
          return null;
        }
        
        // Attempt to fetch metadata
        let metadata: NFTMetadata | null = null;
        let imageUrl: string | null = null;
        
        try {
          // In a full implementation, you would fetch the metadata from arweave/IPFS
          // using Metaplex SDK - this is a simplified implementation
          const metaplexData = await fetchNFTMetadata(mintAddress, connection);
          if (metaplexData) {
            metadata = metaplexData;
            imageUrl = metadata.image;
          }
        } catch (error) {
          console.error(`Error fetching metadata for NFT ${mintAddress}:`, error);
        }
        
        return {
          mint: mintAddress,
          tokenAccount: tokenAccountAddress,
          metadata,
          imageUrl
        } as NFTData;
      })
    );
    
    // Filter out null entries and combine the two sources
    const filteredBlockchainNfts = blockchainNfts.filter((nft): nft is NFTData => nft !== null);
    return [...dbNfts, ...filteredBlockchainNfts];
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}

/**
 * Fetch metadata for a specific NFT
 * This is a simplification - in production you would use Metaplex's full SDK
 * @param mintAddress The NFT's mint address
 * @param connection The Solana connection
 * @returns NFT metadata or null if not found
 */
async function fetchNFTMetadata(mintAddress: string, connection: Connection): Promise<NFTMetadata | null> {
  try {
    // In production, you would:
    // 1. Use Metaplex SDK to find the metadata PDA for this mint
    // 2. Fetch the metadata account data
    // 3. Get the URI from the metadata
    // 4. Fetch the JSON from the URI (Arweave, IPFS, etc)
    
    // For EventSeal NFTs, we'll try to fetch from our own API
    console.log(`Fetching metadata for NFT: ${mintAddress}`);
    const response = await fetch(`/api/nfts/${mintAddress}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Successfully fetched metadata for NFT: ${mintAddress}`, data);
      return data;
    } else {
      console.log(`No metadata found in our API for: ${mintAddress}, using fallback`);
    }
    
    // If not found in our API, we'll return a dummy metadata for now
    return {
      name: "NFT " + mintAddress.slice(0, 6),
      symbol: "NFT",
      description: "NFT on Solana blockchain",
      image: "",
      attributes: []
    };
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return null;
  }
}

/**
 * Get a preview of an NFT for display
 * @param nft The NFT data
 */
export function getNFTPreview(nft: NFTData) {
  const name = nft.metadata?.name || `NFT ${nft.mint.slice(0, 6)}...`;
  const description = nft.metadata?.description || 'No description available';
  const image = nft.imageUrl || '/placeholder-nft.png'; // Default placeholder image
  
  return {
    name,
    description,
    image,
    mint: nft.mint,
    // Add any other display properties here
  };
} 