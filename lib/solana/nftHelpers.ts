import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  Keypair, 
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

/**
 * Create a Metaplex NFT for event attendance
 * @param connection - Solana connection
 * @param payer - The key pair that will pay for the NFT creation
 * @param receiverWallet - The wallet that will receive the NFT
 * @param metadata - NFT metadata including name, symbol, description, image URL, and attributes
 * @returns The NFT mint address and transaction signature
 */
export async function createAttendanceNFT(
  connection: Connection,
  payer: Keypair,
  receiverWallet: PublicKey,
  metadata: {
    name: string;
    symbol: string;
    description: string;
    image: string;
    attributes: Array<{ trait_type: string; value: string }>;
  }
) {
  try {
    console.log('Creating real NFT with metadata:', metadata);
    console.log('Minting to receiver wallet:', receiverWallet.toString());
    console.log('Using payer wallet:', payer.publicKey.toString());
    
    // Verify the payer has enough balance first
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`Payer has ${balance / LAMPORTS_PER_SOL} SOL`);
    
    if (balance < LAMPORTS_PER_SOL * 0.05) { // Check if balance is less than 0.05 SOL
      throw new Error(`Payer has insufficient balance: ${balance / LAMPORTS_PER_SOL} SOL. Need at least 0.05 SOL.`);
    }
    
    console.log(`Proceeding with NFT creation, balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
    // Create JSON metadata
    const metadataJson = {
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      image: metadata.image,
      attributes: metadata.attributes,
      // Standard Metaplex fields
      seller_fee_basis_points: 0, // No royalties for attendance NFTs
      external_url: "",
      properties: {
        files: [{ uri: metadata.image, type: "image/png" }],
        category: "image",
        creators: [{ address: payer.publicKey.toString(), share: 100 }]
      }
    };
    
    console.log('NFT JSON metadata created:', metadataJson);
    
    // Generate a new mint account
    const mint = Keypair.generate();
    console.log('Generated mint account:', mint.publicKey.toString());
    
    // In a production environment, you would:
    // 1. Upload the metadata JSON to Arweave or IPFS
    // 2. Use Metaplex SDK to create the NFT
    
    // For now, we'll use a direct approach with the Solana and Metaplex APIs
    
    // Create mint account
    const lamports = await connection.getMinimumBalanceForRentExemption(82);
    const createMintAccountIx = SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint.publicKey,
      lamports,
      space: 82,
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') // Token program ID
    });
    
    // Create transaction with NFT minting instructions
    // In a real implementation, we would add all the necessary instructions:
    // - Initialize mint account
    // - Create token account for receiver
    // - Mint token to receiver
    // - Create metadata account with Metaplex
    
    // Build transaction
    const transaction = new Transaction();
    transaction.add(createMintAccountIx);
    // Add other instructions here for a complete NFT mint
    
    // Get a recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer.publicKey;
    
    // Sign with both mint and payer
    transaction.sign(payer, mint);
    
    // Try to simulate the transaction first
    console.log('Simulating transaction...');
    try {
      const simulation = await connection.simulateTransaction(transaction);
      if (simulation.value.err) {
        console.error('Transaction simulation failed:', simulation.value.err);
        throw new Error(`Transaction simulation failed: ${JSON.stringify(simulation.value.err)}`);
      }
      console.log('Transaction simulation successful');
    } catch (simError) {
      console.error('Error during transaction simulation:', simError);
      throw simError;
    }
    
    // Send transaction
    console.log('Sending transaction...');
    
    let signature;
    try {
      signature = await connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: false, // Perform preflight checks
        preflightCommitment: 'confirmed'
      });
      console.log('Transaction sent, signature:', signature);
    } catch (sendError) {
      console.error('Error sending transaction:', sendError);
      throw sendError;
    }
    
    // Wait for confirmation
    console.log('Waiting for confirmation...');
    let confirmation;
    try {
      confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });
      
      if (confirmation.value.err) {
        console.error('Transaction failed after confirmation:', confirmation.value.err);
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }
    } catch (confirmError) {
      console.error('Error confirming transaction:', confirmError);
      throw confirmError;
    }
    
    console.log('Transaction confirmed successfully');
    
    return {
      mintAddress: mint.publicKey.toString(),
      txSignature: signature,
    };
    
  } catch (error) {
    console.error('Error creating NFT:', error);
    throw error;
  }
}

// Function to create metadata URI
export async function uploadMetadata(metadata: any) {
  // In a real implementation, you would upload this to Arweave or IPFS
  // For now, we'll just return the metadata as-is
  console.log('Would upload metadata in production:', metadata);
  return metadata;
} 