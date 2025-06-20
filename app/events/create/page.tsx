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
  const [activeSection, setActiveSection] = useState(1);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);
  const [nftImagePreview, setNftImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: '',
    nftName: '',
    nftSymbol: '',
    nftImageUrl: '',
    maxAttendees: 100,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEventImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setEventImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNftImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNftImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setNftImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
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
    <div className="min-h-screen bg-background overflow-hidden pb-20 py-24">
      {/* Header with animated background */}
      <div className="relative py-16 mb-8">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-950 opacity-90">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        
        {/* Animated blobs */}
        <div className="absolute top-1/3 right-20 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/3 left-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-violet-200 inline-block    ">Create Your Event</h1>
          <p className="mt-4 text-lg text-indigo-100 max-w-3xl mx-auto  ">
            Build your blockchain-verified event and mint exclusive NFTs for your attendees
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
      {!publicKey ? (
          <div className="relative bg-background/40 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-900/30 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
            <svg className="h-24 w-24 text-indigo-400/40 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-semibold text-foreground mb-4  ">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto  ">
              To create and manage blockchain events, connect your Solana wallet first
            </p>
            <div className="inline-block">
              <WalletConnectButton />
            </div>
        </div>
      ) : (
          <div className="relative">
            {/* Step indicators */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center">
                <button 
                  onClick={() => setActiveSection(1)} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300   ${
                    activeSection >= 1 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-indigo-900/30 text-indigo-300'
                  }`}
                >
                  1
                </button>
                <div className={`w-20 h-1 transition-all duration-300 ${
                  activeSection >= 2 
                    ? 'bg-indigo-600' 
                    : 'bg-indigo-900/30'
                }`}></div>
                <button 
                  onClick={() => formData.title && formData.date ? setActiveSection(2) : null} 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300   ${
                    activeSection >= 2 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-indigo-900/30 text-indigo-300'
                  }`}
                >
                  2
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Event Details */}
              <div className={`transition-all duration-500 ${activeSection === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'}`}>
                <div className="relative bg-background/40 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-900/30 p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
                  
                  <div className="relative">
                    <div className="flex items-center mb-6">
                      <div className="h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-semibold text-foreground  ">Event Details</h2>
                    </div>
            
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium mb-2 text-foreground  ">
                            Event Title*
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-indigo-900/20 rounded-lg bg-background/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all  "
                            placeholder="Give your event a catchy title"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium mb-2 text-foreground  ">
                            Description*
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-indigo-900/20 rounded-lg bg-background/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all  "
                            placeholder="Describe what your event is about"
                          ></textarea>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium mb-2 text-foreground  ">
                              Date and Time*
                            </label>
                            <div className="relative">
                              <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 pl-11 border border-indigo-900/20 rounded-lg bg-background/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all   appearance-none"
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <div className="h-6 w-6 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                  <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <p className="mt-1.5 text-xs text-indigo-300/70  ">
                              Select the exact date and time of your event
                            </p>
                          </div>
                          
                          <div>
                            <label htmlFor="maxAttendees" className="block text-sm font-medium mb-2 text-foreground  ">
                              Max Attendees*
                            </label>
                            <input
                              type="number"
                              id="maxAttendees"
                              name="maxAttendees"
                              value={formData.maxAttendees}
                              onChange={handleChange}
                              required
                              min="1"
                              className="w-full px-4 py-3 border border-indigo-900/20 rounded-lg bg-background/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all   appearance-none"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium mb-2 text-foreground  ">
                            Location*
                          </label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-indigo-900/20 rounded-lg bg-background/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all  "
                            placeholder="Physical location or 'Virtual'"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="event-image" className="block text-sm font-medium mb-2 text-foreground  ">
                            Event Image*
                          </label>
                          <div className="relative border-2 border-dashed border-indigo-900/20 rounded-lg p-6 bg-background/40 transition-all hover:border-indigo-500/40 flex flex-col items-center justify-center h-64">
                            {eventImagePreview ? (
                              <div className="relative w-full h-full">
                                <div 
                                  className="absolute inset-0 bg-cover bg-center rounded-lg" 
                                  style={{ backgroundImage: `url(${eventImagePreview})` }}
                                ></div>
                                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setEventImage(null);
                                      setEventImagePreview(null);
                                    }}
                                    className="bg-red-500/80 text-white p-2 rounded-full"
                                  >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <svg className="h-12 w-12 text-indigo-400/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-indigo-300 mb-2  ">Drag and drop or click to upload</p>
                                <p className="text-xs text-indigo-300/70  ">PNG, JPG or GIF (max 5MB)</p>
                              </>
                            )}
                            <input
                              type="file"
                              id="event-image"
                              accept="image/*"
                              onChange={handleEventImageChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              required
                            />
                          </div>
                          <p className="mt-2 text-xs text-indigo-300/70  ">
                            Image will be uploaded to IPFS via Lighthouse
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-8">
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.title && formData.date && formData.location && eventImage) {
                            setActiveSection(2);
                          } else {
                            alert('Please fill in all required fields and upload an event image.');
                          }
                        }}
                        className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg overflow-hidden transition-all duration-300  "
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                        <span className="absolute inset-0 border border-indigo-400 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
                        <span className="relative text-white flex items-center">
                          Continue to NFT Details
                          <svg className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Section 2: NFT Details */}
              <div className={`transition-all duration-500 ${activeSection === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'}`}>
                <div className="relative bg-background/40 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-900/30 p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
                  
                  <div className="relative">
                    <div className="flex items-center mb-6">
                      <div className="h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-semibold text-foreground  ">NFT Details</h2>
                    </div>
                    
                    <p className="text-sm text-indigo-300/80 mb-6 ml-13  ">
                      Design the NFT that will be issued to verified attendees as proof of attendance
                    </p>
            
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="nftName" className="block text-sm font-medium mb-2 text-foreground  ">
                            NFT Name*
                          </label>
                          <input
                            type="text"
                            id="nftName"
                            name="nftName"
                            value={formData.nftName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-indigo-900/20 rounded-lg bg-background/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all  "
                            placeholder="Name for the NFT"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="nftSymbol" className="block text-sm font-medium mb-2 text-foreground  ">
                            NFT Symbol*
                          </label>
                          <input
                            type="text"
                            id="nftSymbol"
                            name="nftSymbol"
                            value={formData.nftSymbol}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-indigo-900/20 rounded-lg bg-background/60 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all  "
                            placeholder="Symbol for the NFT (e.g. EVENT)"
                          />
                          <p className="mt-2 text-xs text-indigo-300/70  ">
                            Short identifier for your token (typically 3-5 characters)
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="nft-image" className="block text-sm font-medium mb-2 text-foreground  ">
                            NFT Image*
                          </label>
                          <div className="relative border-2 border-dashed border-indigo-900/20 rounded-lg p-6 bg-background/40 transition-all hover:border-indigo-500/40 flex flex-col items-center justify-center h-64">
                            {nftImagePreview ? (
                              <div className="relative w-full h-full">
                                <div 
                                  className="absolute inset-0 bg-cover bg-center rounded-lg" 
                                  style={{ backgroundImage: `url(${nftImagePreview})` }}
                                ></div>
                                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setNftImage(null);
                                      setNftImagePreview(null);
                                    }}
                                    className="bg-red-500/80 text-white p-2 rounded-full"
                                  >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <svg className="h-12 w-12 text-indigo-400/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-sm text-indigo-300 mb-2  ">Upload NFT artwork</p>
                                <p className="text-xs text-indigo-300/70  ">PNG, JPG, GIF or SVG (max 5MB)</p>
                              </>
                            )}
                            <input
                              type="file"
                              id="nft-image"
                              accept="image/*"
                              onChange={handleNftImageChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              required
                            />
                          </div>
                          <p className="mt-2 text-xs text-indigo-300/70  ">
                            This image will be used for the NFT that attendees receive
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={() => setActiveSection(1)}
                        className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg overflow-hidden transition-all duration-300  "
                      >
                        <span className="absolute inset-0 bg-background/40 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                        <span className="absolute inset-0 border border-indigo-400/30 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
                        <span className="relative text-indigo-200 flex items-center">
                          <svg className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back
                        </span>
                      </button>
                      
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg overflow-hidden transition-all duration-300  "
                      >
                        <span className={`absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 ${isLoading ? 'opacity-70' : 'opacity-90 group-hover:opacity-100'} transition-opacity`}></span>
                        <span className="absolute inset-0 border border-indigo-400 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
                        <span className="relative text-white flex items-center">
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating Event...
                            </>
                          ) : (
                            <>
                              Create Event
                              <svg className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
      )}
      </div>
    </div>
  );
}
