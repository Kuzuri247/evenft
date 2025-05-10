'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletConnectButton from "@/components/WalletConnectButton";

export default function Home() {
  const { publicKey } = useWallet();
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32 lg:pb-40">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-950 opacity-90">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        
        {/* Animated orbs/blobs */}
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-2/3 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-72 h-72 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div 
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            opacity: 1 - (scrollY * 0.002)
          }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="space-y-8 max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-violet-200 leading-tight">
                Blockchain-Verified Event Ticketing
              </h1>
              <p className="text-xl md:text-2xl text-indigo-100 leading-relaxed">
                Create events, verify attendance, and distribute proof-of-attendance NFTs on the Solana blockchain.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center mt-8">
                {publicKey ? (
                  <>
                    <Link 
                      href="/events" 
                      className="group relative inline-flex justify-center items-center px-8 py-4 text-base font-medium rounded-lg overflow-hidden transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                      <span className="absolute inset-0 border border-indigo-400 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
                      <span className="relative text-white flex items-center">
                        Browse Events
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </Link>
                    <Link 
                      href="/events/create" 
                      className="group relative inline-flex justify-center items-center px-8 py-4 text-base font-medium rounded-lg overflow-hidden transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-indigo-600/10 backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-opacity"></span>
                      <span className="absolute inset-0 border border-indigo-400 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
                      <span className="relative text-indigo-100 flex items-center">
                        Create Event
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    </Link>
                  </>
                ) : (
                  <div className="backdrop-blur-lg bg-indigo-500/10 border border-indigo-400/30 rounded-lg p-6 max-w-sm mx-auto">
                    <div className="flex flex-col space-y-4 items-center">
                      <div className="text-indigo-100 text-lg font-medium mb-2">Connect to get started</div>
                      <WalletConnectButton />
                      <p className="text-sm text-indigo-200 mt-2">Securely connect your Solana wallet to access all features</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Down arrow for smooth scroll */}
        <a 
          href="#features" 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors"
          style={{ opacity: 1 - (scrollY * 0.01) }}
        >
          <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-card/80 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 inline-block">Why EventSeal?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">Taking event ticketing to the next level with blockchain technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-background/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-900/30 transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-indigo-900/10">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-600 rounded-xl opacity-10 blur-xl"></div>
                <div className="relative h-14 w-14 bg-indigo-900 rounded-xl flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Verified Attendance</h3>
              <p className="text-muted-foreground">Confirm participation with blockchain-backed verification that's tamper-proof and transparent.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-900/30 transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-indigo-900/10">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600 rounded-xl opacity-10 blur-xl"></div>
                <div className="relative h-14 w-14 bg-indigo-900 rounded-xl flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8M12 8v13m0-13V6a4 4 0 014-4h.2" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">NFT Tickets</h3>
              <p className="text-muted-foreground">Attendees receive unique, collectible NFTs as proof of attendance that live forever on the blockchain.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-900/30 transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-indigo-900/10">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-600 rounded-xl opacity-10 blur-xl"></div>
                <div className="relative h-14 w-14 bg-indigo-900 rounded-xl flex items-center justify-center mb-6">
                  <svg className="h-8 w-8 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Fast & Affordable</h3>
              <p className="text-muted-foreground">Built on Solana for lightning-fast transactions and minimal fees, making it accessible for events of any size.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 opacity-90"></div>
            
            {/* Animated glow effect */}
            <div className="absolute top-0 left-[-10%] w-[120%] h-[100px] bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent skew-y-3 animate-glow"></div>
            
            <div className="relative px-6 py-14 md:py-20 md:px-12 text-center md:text-left flex flex-col md:flex-row items-center z-10">
              <div className="md:w-2/3 mb-10 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white sm:text-4xl leading-tight">
                  Ready to revolutionize your <span className="text-indigo-200">events</span>?
                </h2>
                <p className="mt-4 text-lg text-indigo-200 max-w-2xl">
                  Create your first event or browse upcoming events on the platform. Join the future of event ticketing today.
                </p>
              </div>
              <div className="md:w-1/3 md:pl-10">
                {publicKey ? (
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/events"
                      className="group relative w-full flex items-center justify-center px-6 py-4 text-base font-medium rounded-lg overflow-hidden transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300"></span>
                      <span className="absolute inset-0 border border-indigo-300/30 rounded-lg"></span>
                      <span className="relative text-white flex items-center">
                        Browse Events
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </Link>
                    <Link
                      href="/events/create" 
                      className="group relative w-full flex items-center justify-center px-6 py-4 text-base font-medium rounded-lg overflow-hidden transition-all duration-300"
                    >
                      <span className="absolute inset-0 bg-indigo-600/10 backdrop-blur-sm group-hover:bg-indigo-600/20 transition-all duration-300"></span>
                      <span className="absolute inset-0 border border-indigo-300/30 rounded-lg"></span>
                      <span className="relative text-indigo-200 flex items-center">
                        Create Event
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-6">
      <WalletConnectButton />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
