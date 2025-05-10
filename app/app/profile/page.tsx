'use client';

import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { fetchUserNFTs, NFTData, getNFTPreview } from '@/lib/solana/nftUtils';
import WalletConnectButton from '@/components/WalletConnectButton';
import { Connection, clusterApiUrl } from '@solana/web3.js';

interface UserProfile {
  id: string;
  name: string | null;
  walletAddress: string;
  email: string | null;
  eventCount: number;
  nftCount: number;
}

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const loadUserProfile = async () => {
    if (!publicKey) return;
    
    try {
      setLoadingProfile(true);
      // Try to fetch user profile from our database
      const response = await fetch(`/api/users/profile?walletAddress=${publicKey.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        // If user doesn't exist in our DB yet, create a minimal profile
        setUserProfile({
          id: '',
          name: null,
          walletAddress: publicKey.toString(),
          email: null,
          eventCount: 0,
          nftCount: 0
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const loadNFTs = async () => {
    if (!publicKey) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get connection to Solana network
      const solanaConnection = connection || new Connection(clusterApiUrl('devnet'));
      
      console.log('Fetching NFTs for wallet:', publicKey.toString());
      // Fetch NFTs with our improved function that includes DB lookup
      const userNfts = await fetchUserNFTs(publicKey.toString(), solanaConnection);
      console.log('Fetched NFTs:', userNfts);
      
      setNfts(userNfts);
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to fetch your NFTs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load user data and NFTs when the wallet connects
  useEffect(() => {
    if (publicKey) {
      loadUserProfile();
      loadNFTs();
    }
  }, [publicKey, connection]);

  // If wallet is not connected
  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
            <p className="text-gray-600 mb-6">Connect your wallet to view your profile</p>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {loadingProfile ? 'Loading...' : userProfile?.name || 'Anonymous User'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Wallet: {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
              </p>
              {userProfile?.email && (
                <p className="text-sm text-gray-500 mt-1">
                  Email: {userProfile.email}
                </p>
              )}
            </div>
            <div className="flex space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {loadingProfile ? '-' : userProfile?.eventCount || 0}
                </p>
                <p className="text-xs text-gray-500">Events</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {nfts.length}
                </p>
                <p className="text-xs text-gray-500">NFTs</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <Link 
              href="/dashboard"
              className="px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link 
              href="/events"
              className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Events
            </Link>
          </div>
        </div>

        {/* NFT Collection Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your NFT Collection</h1>
          
          <button 
            onClick={loadNFTs}
            disabled={loading}
            className={`mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin mr-2">⟳</span>
                Loading...
              </>
            ) : (
              <>Refresh NFTs</>
            )}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your NFTs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={loadNFTs}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No NFTs found</h2>
            <p className="text-gray-600 mb-6">You don't have any NFTs in your wallet yet.</p>
            <Link 
              href="/events"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Events to Earn NFTs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {nfts.map((nft) => {
              const preview = getNFTPreview(nft);
              
              return (
                <div key={nft.mint} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-48 w-full bg-gray-100">
                    {preview.image ? (
                      <img
                        src={preview.image}
                        alt={preview.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails to load, set a placeholder
                          (e.target as HTMLImageElement).src = '/placeholder-nft.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{preview.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{preview.description}</p>
                    
                    <div className="flex items-start space-x-2 text-xs text-gray-500">
                      <svg className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="leading-tight break-all">
                        {`${nft.mint.slice(0, 10)}...${nft.mint.slice(-4)}`}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <a 
                        href={`https://explorer.solana.com/address/${nft.mint}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        View on Solana Explorer →
                      </a>
                    </div>

                    {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <h4 className="text-xs font-medium text-gray-500 mb-2">Attributes</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {nft.metadata.attributes.map((attr, index) => (
                            <div key={index} className="bg-gray-50 px-2 py-1 rounded text-xs">
                              <span className="font-medium text-gray-600">{attr.trait_type}:</span>{' '}
                              <span className="text-gray-500">{attr.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 