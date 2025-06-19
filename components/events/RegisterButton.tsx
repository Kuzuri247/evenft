'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import * as memo from '@solana/spl-memo';
import { useRouter } from 'next/navigation';
import WalletConnectButton from '@/components/WalletConnectButton';
import RegistrationModal from './RegistrationModal';

export default function RegisterButton({ eventId }: { eventId: string }) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Check if the user is already registered
  useEffect(() => {
    if (!publicKey) {
      setIsLoading(false);
      return;
    }
    
    const checkRegistration = async () => {
      try {
        const response = await fetch(`/api/registration/check?eventId=${eventId}&userWalletAddress=${publicKey.toString()}`);
        const data = await response.json();
        
        if (response.ok && data.registered) {
          setIsRegistered(true);
        }
      } catch (error) {
        console.error('Error checking registration:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkRegistration();
  }, [publicKey, eventId]);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleFormSubmit = async (userData: { fullName: string; socialLink: string }) => {
    if (!publicKey || !connection) return;
    
    setIsRegistering(true);
    
    try {
      // Create a memo transaction for on-chain proof of registration
      const registrationData = JSON.stringify({
        type: 'event_registration',
        eventId,
        registrant: publicKey.toString(),
        timestamp: new Date().toISOString(),
        fullName: userData.fullName,
        socialLink: userData.socialLink
      });
      
      // Create and send the transaction
      const transaction = new Transaction().add(
        memo.createMemoInstruction(registrationData)
      );
      
      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction sent with signature', signature);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed: ' + JSON.stringify(confirmation.value.err));
      }
      
      console.log('Transaction confirmed');
      
      // Now send to our API with the transaction signature and user data
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          userWalletAddress: publicKey.toString(),
          transactionSignature: signature,
          network: 'devnet', // Change to mainnet-beta for production
          fullName: userData.fullName,
          socialLink: userData.socialLink
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Check if the error is that the user is already registered
        if (response.status === 409) {
          setIsRegistered(true);
          setIsModalOpen(false);
          return;
        }
        throw new Error(data.error || 'Failed to register');
      }
      
      setIsRegistered(true);
      setIsModalOpen(false);
      router.refresh(); // Refresh the page to update registration count
      
    } catch (error) {
      console.error('Registration error:', error);
      alert(`Error registering: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRegistering(false);
    }
  };
  
  if (isLoading) {
    return (
      <button
        disabled
        className="w-full py-3 px-4 bg-gray-400 text-white rounded-md"
      >
        Loading...
      </button>
    );
  }
  
  if (!publicKey) {
    return (
      <div className="text-center">
        <p className="mb-2">Connect your wallet to register</p>
        <WalletConnectButton />
      </div>
    );
  }
  
  if (isRegistered) {
    return (
      <button
        disabled
        className="w-full py-3 px-4 bg-green-500 text-white rounded-md"
      >
        ✓ Registered
      </button>
    );
  }
  
  return (
    <>
      <button
        onClick={handleOpenModal}
        disabled={isRegistering}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isRegistering ? 'Registering...' : 'Register for Event'}
      </button>
      
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        isLoading={isRegistering}
      />
    </>
  );
}
