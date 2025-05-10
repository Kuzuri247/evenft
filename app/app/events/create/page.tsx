'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import * as memo from '@solana/spl-memo';
import lighthouse from '@lighthouse-web3/sdk';
import WalletConnectButton from '@/components/WalletConnectButton';

export default function CreateEventPage() {
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [nftImage, setNftImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: '',
    nftName: '',
    nftSymbol: '',
    nftImageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEventImage(e.target.files[0]);
    }
  };

  const handleNftImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNftImage(e.target.files[0]);
    }
  };

  const uploadToLighthouse = async (file: File) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
      if (!apiKey) {
        throw new Error('Lighthouse API key not found');
      }

      // Create a proper FormData object for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Use the proper upload endpoint
      const response = await fetch('https://node.lighthouse.storage/api/v0/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Lighthouse upload response:', data);
      
      // Check for the correct property in the response
      // The Lighthouse API likely uses "Hash" or "Name" instead of "cid"
      if (!data.Hash && !data.hash) {
        console.error('No hash found in response:', data);
        throw new Error('Upload successful but no hash returned');
      }
      
      // Use the correct property
      const hash = data.Hash || data.hash;
      
      // The proper URL format
      const url = `https://gateway.lighthouse.storage/ipfs/${hash}`;
      console.log('Generated image URL:', url);
      
      return url;
    } catch (error) {
      console.error('Error uploading to Lighthouse:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);

    try {
      // Upload images if present
      let imageUrl = formData.imageUrl;
      let nftImageUrl = formData.nftImageUrl;

      if (eventImage) {
        imageUrl = await uploadToLighthouse(eventImage);
      }

      if (nftImage) {
        nftImageUrl = await uploadToLighthouse(nftImage);
      }

      // Create memo transaction
      const eventSummary = JSON.stringify({
        title: formData.title,
        date: formData.date,
        creator: publicKey.toString()
      });
      
      const transaction = new Transaction().add(
        memo.createMemoInstruction(eventSummary)
      );
      
      // Sign and send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed: ' + confirmation.value.err.toString());
      }
      
      // Submit to API
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          nftImageUrl,
          creatorWalletAddress: publicKey.toString(),
          transactionSignature: signature,
          network: 'devnet', // Change to mainnet-beta for production
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }
      
      const result = await response.json();
      
      alert('Event created successfully!');
      router.push(`/events/${result.id}`);
      
    } catch (error) {
      console.error('Error creating event:', error);
      alert(`Error creating event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
      
      {!publicKey ? (
        <div className="text-center py-8">
          <p className="mb-4">Connect your wallet to create an event</p>
          <WalletConnectButton />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Event Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Your event title"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Describe your event"
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Date and Time*
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Where is your event taking place?"
                />
              </div>
              
              <div>
                <label htmlFor="eventImage" className="block text-sm font-medium mb-1">
                  Event Image
                </label>
                <input
                  type="file"
                  id="eventImage"
                  accept="image/*"
                  onChange={handleEventImageChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {eventImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Selected: {eventImage.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">NFT (Proof of Attendance) Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="nftName" className="block text-sm font-medium mb-1">
                  NFT Name*
                </label>
                <input
                  type="text"
                  id="nftName"
                  name="nftName"
                  value={formData.nftName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. ETH Denver 2024 Attendee"
                />
              </div>
              
              <div>
                <label htmlFor="nftSymbol" className="block text-sm font-medium mb-1">
                  NFT Symbol*
                </label>
                <input
                  type="text"
                  id="nftSymbol"
                  name="nftSymbol"
                  value={formData.nftSymbol}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. ETHDEN24"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Short symbol for your NFT (max 10 characters)
                </p>
              </div>
              
              <div>
                <label htmlFor="nftImage" className="block text-sm font-medium mb-1">
                  NFT Image
                </label>
                <input
                  type="file"
                  id="nftImage"
                  accept="image/*"
                  onChange={handleNftImageChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {nftImage && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Selected: {nftImage.name}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  This image will be used for the NFT that attendees receive
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isLoading || !publicKey}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
