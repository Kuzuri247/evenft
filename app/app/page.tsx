'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletConnectButton from "@/components/WalletConnectButton";

export default function Home() {
  const { publicKey } = useWallet();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="space-y-8 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Blockchain-Verified Event Ticketing
              </h1>
              <p className="text-xl">
                Create events, verify attendance, and distribute proof-of-attendance NFTs on the Solana blockchain.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                {publicKey ? (
                  <>
                    <Link 
                      href="/events" 
                      className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Browse Events
                    </Link>
                    <Link 
                      href="/events/create" 
                      className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Event
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <WalletConnectButton />
                    <p className="text-sm text-indigo-200">Connect your wallet to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why EventSeal?</h2>
            <p className="mt-4 text-xl text-gray-600">Taking event ticketing to the next level with blockchain technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Attendance</h3>
              <p className="text-gray-600">Confirm participation with blockchain-backed verification that's tamper-proof and transparent.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8M12 8v13m0-13V6a4 4 0 014-4h.2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">NFT Tickets</h3>
              <p className="text-gray-600">Attendees receive unique, collectible NFTs as proof of attendance that live forever on the blockchain.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-5">
                <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast & Affordable</h3>
              <p className="text-gray-600">Built on Solana for lightning-fast transactions and minimal fees, making it accessible for events of any size.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:py-16 md:px-12 text-center md:text-left flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Ready to get started?
                </h2>
                <p className="mt-3 text-lg text-indigo-100">
                  Create your first event or browse upcoming events on the platform.
                </p>
              </div>
              <div className="md:w-1/3 md:pl-10">
                {publicKey ? (
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/events"
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                    >
                      Browse Events
                    </Link>
                    <Link
                      href="/events/create" 
                      className="w-full flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                    >
                      Create Event
                    </Link>
                  </div>
                ) : (
                  <WalletConnectButton />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
