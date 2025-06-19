import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// This is a wallet configuration file for NFT minting
// The private key is stored in environment variables for security

/**
 * Get the keypair for NFT minting
 * This function ensures we only create the keypair once
 */
let _minterKeypair: Keypair | null = null;

export function getMinterKeypair(): Keypair {
  if (!_minterKeypair) {
    try {
      // Get the private key from environment variables
      const privateKey = process.env.MINTER_PRIVATE_KEY;
      
      if (!privateKey) {
        console.warn('⚠️ No MINTER_PRIVATE_KEY found in environment variables. Using temporary keypair.');
        // Generate a temporary keypair for development
        _minterKeypair = Keypair.generate();
      } else {
        // Use the configured private key
        const secretKey = bs58.decode(privateKey);
        _minterKeypair = Keypair.fromSecretKey(secretKey);
        console.log('Using configured minter wallet:', _minterKeypair.publicKey.toString());
      }
    } catch (error) {
      console.error('Error creating minter keypair:', error);
      // Fallback to a generated keypair
      _minterKeypair = Keypair.generate();
      console.error('Using fallback generated keypair:', _minterKeypair.publicKey.toString());
    }
  }
  
  return _minterKeypair;
} 