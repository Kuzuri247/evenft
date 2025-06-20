"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Link } from "next-view-transitions";
import { fetchUserNFTs, NFTData, getNFTPreview } from "@/lib/solana/nftUtils";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { ProfileSkeleton, NFTSkeleton } from "@/components/Skeletons";
import WalletConnectButton from "@/components/WalletConnectButton";
import Image from "next/image";

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
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadUserProfile = async () => {
    if (!publicKey) return;

    try {
      // Try to fetch user profile from our database
      const response = await fetch(
        `/api/users/profile?walletAddress=${publicKey.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      } else {
        // If user doesn't exist in our DB yet, create a minimal profile
        setUserProfile({
          id: "",
          name: null,
          walletAddress: publicKey.toString(),
          email: null,
          eventCount: 0,
          nftCount: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const loadNFTs = async () => {
    if (!publicKey) {
      setIsInitialized(true);
      return;
    }

    try {
      setError(null);

      // Get connection to Solana network
      const solanaConnection =
        connection || new Connection(clusterApiUrl("devnet"));

      console.log("Fetching NFTs for wallet:", publicKey.toString());
      // Fetch NFTs with our improved function that includes DB lookup
      const userNfts = await fetchUserNFTs(
        publicKey.toString(),
        solanaConnection
      );
      console.log("Fetched NFTs:", userNfts);

      setNfts(userNfts);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Failed to fetch your NFTs. Please try again later.");
    } finally {
      setIsInitialized(true);
    }
  };

  // Load user data and NFTs when the wallet connects
  useEffect(() => {
    if (publicKey) {
      loadUserProfile();
      loadNFTs();
    }
  });

  // If wallet is not connected
  if (!publicKey) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-6  ">
              Your Profile
            </h1>
            <p className="text-muted-foreground mb-6  ">
              Connect your wallet to view your profile
            </p>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Section */}
        {!userProfile ? (
          <ProfileSkeleton />
        ) : (
          <div className="bg-card rounded-lg shadow-sm p-6 mb-8 border border-border mt-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground  ">
                  {userProfile?.name || "Anonymous User"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1  ">
                  Wallet: {publicKey.toString().slice(0, 4)}...
                  {publicKey.toString().slice(-4)}
                </p>
                {userProfile?.email && (
                  <p className="text-sm text-muted-foreground mt-1  ">
                    Email: {userProfile.email}
                  </p>
                )}
              </div>
              <div className="flex space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-400  ">
                    {userProfile?.eventCount || 0}
                  </p>
                  <p className="text-xs text-muted-foreground  ">Events</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-400  ">
                    {nfts.length}
                  </p>
                  <p className="text-xs text-muted-foreground  ">NFTs</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-3">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-card  "
              >
                Dashboard
              </Link>
              <Link
                href="/events"
                className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-600  "
              >
                Browse Events
              </Link>
            </div>
          </div>
        )}

        {/* NFT Collection Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground  ">
            Your NFT Collection
          </h1>

          <button
            onClick={loadNFTs}
            className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-600  "
          >
            Refresh NFTs
          </button>
        </div>

        {!isInitialized ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <NFTSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-semibold text-red-400 mb-2  ">Error</h2>
            <p className="text-muted-foreground mb-6  ">{error}</p>
            <button
              onClick={loadNFTs}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-600  "
            >
              Try Again
            </button>
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg shadow-sm border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-2  ">
              No NFTs found
            </h2>
            <p className="text-muted-foreground mb-6  ">
              Attend events to collect NFT proof of attendance
            </p>
            <Link
              href="/events"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-600  "
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map((nft) => {
              const preview = getNFTPreview(nft);
              return (
                <div
                  key={nft.mint}
                  className="bg-card rounded-lg shadow-sm overflow-hidden border border-border hover:border-indigo-600/50 transition-colors group"
                >
                  <div className="relative h-48 w-full bg-background/50">
                    {preview.image ? (
                      <Image
                        src={preview.image}
                        alt={preview.name}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-muted-foreground  ">
                          No image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-lg font-semibold text-foreground mb-1 truncate  "
                      title={preview.name}
                    >
                      {preview.name}
                    </h3>
                    <p
                      className="text-sm text-muted-foreground line-clamp-2 h-10  "
                      title={preview.description}
                    >
                      {preview.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground truncate  ">
                        Mint: {nft.mint.slice(0, 6)}...{nft.mint.slice(-4)}
                      </p>
                      <a
                        href={`https://explorer.solana.com/address/${nft.mint}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group-hover:text-indigo-400 text-indigo-600/80 text-xs flex items-center transition-colors  "
                      >
                        <span>View on Explorer</span>
                        <svg
                          className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
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
