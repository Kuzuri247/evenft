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
        {/* Animated gradient background with improved pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-950 opacity-90">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        
        {/* Enhanced animated orbs/blobs with larger size and smoother animation */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-2/3 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Subtle floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="particles-container"></div>
        </div>
        
        <div 
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            opacity: 1 - (scrollY * 0.002)
          }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="space-y-8 max-w-4xl">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-xl rounded-lg"></div>
                <h1 className="relative text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-violet-200 leading-tight font-calsans tracking-wider">
                  Blockchain-Verified Event Ticketing
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-indigo-100 leading-relaxed mx-auto max-w-3xl font-montserrat">
                Create events, verify attendance, and distribute proof-of-attendance NFTs on the Solana blockchain.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center mt-10">
                {publicKey ? (
                  <>
                    <Link 
                      href="/events" 
                      className="group relative inline-flex justify-center items-center px-8 py-4 text-base font-medium rounded-xl overflow-hidden transition-all duration-300 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 hover:-translate-y-1 font-montserrat"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                      <span className="absolute inset-0 border border-indigo-400/30 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity"></span>
                      <span className="relative text-white flex items-center">
                        Browse Events
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </Link>
                    <Link 
                      href="/events/create" 
                      className="group relative inline-flex justify-center items-center px-8 py-4 text-base font-medium rounded-xl overflow-hidden transition-all duration-300 shadow-lg shadow-indigo-900/10 hover:shadow-indigo-900/30 hover:-translate-y-1 font-montserrat"
                    >
                      <span className="absolute inset-0 bg-background/40 backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity"></span>
                      <span className="absolute inset-0 border border-indigo-400/30 rounded-xl opacity-50 group-hover:opacity-100 transition-opacity"></span>
                      <span className="relative text-indigo-100 flex items-center">
                        Create Event
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    </Link>
                  </>
                ) : (
                  <div className="relative backdrop-blur-lg bg-indigo-500/10 border border-indigo-400/30 rounded-2xl p-8 max-w-sm mx-auto shadow-xl shadow-indigo-900/20">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-lg rounded-2xl"></div>
                    <div className="relative flex flex-col space-y-6 items-center">
                      <div className="text-indigo-100 text-xl font-medium font-montserrat">Connect to get started</div>
                      <div className="transform transition-transform hover:scale-105">
                        <WalletConnectButton />
                      </div>
                      <p className="text-sm text-indigo-200 mt-2 font-montserrat">Securely connect your Solana wallet to access all features</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="mt-16 flex flex-wrap justify-center gap-4">
              <div className="bg-background/30 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-500/20 text-indigo-200 text-sm flex items-center shadow-lg shadow-indigo-900/10 font-montserrat">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Built on Solana
              </div>
              <div className="bg-background/30 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-500/20 text-indigo-200 text-sm flex items-center shadow-lg shadow-indigo-900/10 font-montserrat">
                <span className="w-2 h-2 bg-[#007BFF] rounded-full mr-2"></span>
                NFT Proof of Attendance
              </div>
              <div className="bg-background/30 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-500/20 text-indigo-200 text-sm flex items-center shadow-lg shadow-indigo-900/10 font-montserrat">
                <span className="w-2 h-2 bg-[#E114E5] rounded-full mr-2"></span>
                Low Transaction Fees
              </div>
            </div>
          </div>
        </div>
        
        {/* Improved down arrow with pulsating effect */}
            <a 
            href="#features" 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors"
            style={{ opacity: 1 - (scrollY * 0.01), transition: 'opacity 0.8s ease, transform 0.8s ease' }}
            >
            <div className="p-2 rounded-full bg-indigo-600/20 backdrop-blur-sm border border-indigo-500/20 animate-pulse">
              <svg className="w-8 h-8 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
            </a>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-card/80 to-background relative overflow-hidden">
        {/* Subtle diagonal lines for visual texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-20"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-xl rounded-lg"></div>
              <h2 className="relative text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#007BFF] to-[#E114E5] inline-block font-calsans tracking-wider">Why EventSeal?</h2>
            </div>
            <div className="w-36 h-1 bg-gradient-to-r from-[#007BFF] to-[#E114E5] mx-auto mt-2 rounded-full"></div>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto font-montserrat">Taking event ticketing to the next level with blockchain technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 - enhanced */}
            <div className="group relative bg-background/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-900/30 transform transition-all duration-500 ease-initial hover:-translate-y-2 hover:shadow-indigo-900/10 overflow-hidden mask-b-from-50% hover:mask-none">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-indigo-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-600 rounded-xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative h-14 w-14 bg-indigo-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="h-8 w-8 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-indigo-300 transition-colors duration-300 font-calsans">Verified Attendance</h3>
              <p className="text-muted-foreground font-montserrat">Confirm participation with blockchain-backed verification that's tamper-proof and transparent.</p>
            </div>

            {/* Feature 2 - enhanced */}
            <div className="group relative bg-background/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-900/30 transform transition-all duration-500 ease-initial hover:-translate-y-2 hover:shadow-indigo-900/10 overflow-hidden mask-b-from-50% hover:mask-none">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600 rounded-xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative h-14 w-14 bg-indigo-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="h-8 w-8 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8M12 8v13m0-13V6a4 4 0 014-4h.2" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-purple-300 transition-colors duration-300 font-calsans">NFT Tickets</h3>
              <p className="text-muted-foreground font-montserrat">Attendees receive unique, collectible NFTs as proof of attendance that live forever on the blockchain.</p>
            </div>

            {/* Feature 3 - enhanced */}
            <div className="group relative bg-background/40 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-900/30 transform transition-all duration-500 ease-initial hover:-translate-y-2 hover:shadow-indigo-900/10 overflow-hidden mask-b-from-50% hover:mask-none">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-violet-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-violet-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-violet-600 rounded-xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative h-14 w-14 bg-indigo-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg className="h-8 w-8 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-violet-300 transition-colors duration-300 font-calsans">Fast & Affordable</h3>
              <p className="text-muted-foreground font-montserrat">Built on Solana for lightning-fast transactions and minimal fees, making it accessible for events of any size.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modernized CTA Section */}
      <section className="py-28 bg-background relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 opacity-90">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        
        {/* Animated blobs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        
        {/* Animated glow effect */}
        <div className="absolute top-0 left-[-10%] w-[120%] h-[100px] bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent skew-y-3 animate-glow"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-indigo-900/30">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-indigo-800/90 to-violet-900/90 backdrop-blur-sm"></div>
            <div className="absolute inset-0 border border-indigo-500/20 rounded-3xl"></div>
            
            <div className="relative px-8 py-16 md:py-20 md:px-16 text-center md:text-left flex flex-col md:flex-row items-center z-10">
              <div className="md:w-2/3 mb-10 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white sm:text-4xl leading-tight font-calsans tracking-wider">
                  Ready to revolutionize your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#007BFF] to-[#E114E5]">events</span>?
                </h2>
                <p className="mt-6 text-lg text-indigo-200 max-w-2xl font-montserrat">
                  Create your first event or browse upcoming events on the platform. Join the future of event ticketing today.
                </p>
                
                {/* Added feature checklist */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Tamper-proof tickets", 
                    "Instant verification", 
                    "Collectible NFTs", 
                    "No ticket fraud"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <div className="flex-shrink-0 h-5 w-5 bg-indigo-500/20 rounded-full flex items-center justify-center mr-2">
                        <svg className="h-3 w-3 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-indigo-200 text-sm font-montserrat">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/3 md:pl-10">
                {publicKey ? (
                  <div className="space-y-4">
                    <Link
                      href="/events"
                      className="group relative w-full flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-indigo-900/20 font-montserrat"
                    >
                      <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300"></span>
                      <span className="absolute inset-0 border border-indigo-300/30 rounded-xl group-hover:border-indigo-300/60 transition-all"></span>
                      <span className="relative text-white flex items-center">
                        Browse Events
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </Link>
                    <Link
                      href="/events/create" 
                      className="group relative w-full flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-indigo-900/20 font-montserrat"
                    >
                      <span className="absolute inset-0 bg-indigo-600/20 backdrop-blur-sm group-hover:bg-indigo-600/30 transition-all duration-300"></span>
                      <span className="absolute inset-0 border border-indigo-300/30 rounded-xl group-hover:border-indigo-300/60 transition-all"></span>
                      <span className="relative text-indigo-200 flex items-center">
                        Create Event
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div className="relative backdrop-blur-md bg-white/5 border border-white/20 rounded-xl p-8 shadow-2xl shadow-indigo-900/20">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-md rounded-xl"></div>
                    <div className="relative flex flex-col items-center space-y-4">
                      <div className="text-indigo-100 font-medium mb-2 font-montserrat">Connect Wallet</div>
                      <div className="transform transition-transform hover:scale-105">
                        <WalletConnectButton />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Added bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>
      
      {/* Added Styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .particles-container::before,
        .particles-container::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
          background-size: 100px 100px;
          opacity: 0.3;
        }
        
        .particles-container::before {
          animation: float 8s ease-in-out infinite;
        }
        
        .particles-container::after {
          animation: float 12s ease-in-out infinite reverse;
          background-size: 80px 80px;
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes glow {
          0% { transform: translateY(-200%) rotate(5deg); }
          100% { transform: translateY(200%) rotate(5deg); }
        }
        
        .animate-glow {
          animation: glow 6s linear infinite;
        }
        
        /* Font classes */
        .font-montserrat {
          font-family: var(--font-montserrat);
        }
        
        .font-calsans {
          font-family: var(--font-calsans);
        }
      `}</style>
    </div>
  );
}
