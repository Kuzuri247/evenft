'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { Link } from "next-view-transitions";
import Image from 'next/image';
import WalletConnectButton from '@/components/WalletConnectButton';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  registrations: {
    id: string;
    userId: string;
  }[];
}

export default function Dashboard() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('created');

  useEffect(() => {
    // Only fetch if wallet is connected
    if (!publicKey) {
      setLoading(false);
      return;
    }

    const fetchUserEvents = async () => {
      try {
        const response = await fetch(`/api/events/created?walletAddress=${publicKey.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching user events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [publicKey]);

  if (!publicKey) {
    return (
      <div className="min-h-screen py-24 bg-background overflow-hidden">
        {/* Header with animated background */}
        <div className="relative py-20">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-950 opacity-90">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          </div>
          
          {/* Animated blobs */}
          <div className="absolute top-1/3 left-10 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-1/3 right-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-violet-200 inline-block  ">Dashboard</h1>
            <p className="mt-4 text-xl text-indigo-100  ">Connect your wallet to manage your events</p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto px-4 -mt-10 relative z-20">
          <div className="relative bg-background/40 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-900/30 p-10 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
            
            <div className="relative">
              <svg className="h-24 w-24 text-indigo-400/40 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xl text-foreground font-medium mb-6  ">Connect your wallet to access your dashboard</p>
              <div className="inline-block">
                <WalletConnectButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative">
              <div className="absolute -inset-1 bg-indigo-600 rounded-full opacity-30 blur-xl animate-pulse"></div>
              <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-400 border-l-indigo-400 border-r-transparent border-b-transparent"></div>
            </div>
            <p className="mt-8 text-lg text-muted-foreground  ">Loading your events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden pb-20">
      {/* Header with animated background */}
      <div className="relative py-12 mb-8 mt-24">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-950 opacity-90">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        
        {/* Animated blobs */}
        <div className="absolute top-1/3 right-20 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/3 left-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-violet-200 mb-4 sm:mb-0    ">Your Dashboard</h1>
            
            <div className="flex space-x-2">
              <Link
                href="/events/create"
                className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg overflow-hidden transition-all duration-300  "
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                <span className="absolute inset-0 border border-indigo-400 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative text-white flex items-center">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Event
                </span>
              </Link>
            </div>
          </div>
          
          {/* Dashboard Tabs */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex p-1 bg-background/40 backdrop-blur-sm rounded-lg border border-indigo-900/30">
              <button
                onClick={() => setActiveTab('created')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200   ${
                  activeTab === 'created'
                    ? 'bg-indigo-600/80 backdrop-blur-sm text-white shadow-lg shadow-indigo-600/20'
                    : 'text-indigo-200 hover:bg-indigo-600/20'
                }`}
              >
                My Events
              </button>
              <button
                onClick={() => setActiveTab('attending')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200   ${
                  activeTab === 'attending'
                    ? 'bg-indigo-600/80 backdrop-blur-sm text-white shadow-lg shadow-indigo-600/20'
                    : 'text-indigo-200 hover:bg-indigo-600/20'
                }`}
              >
                Attending
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {events.length === 0 ? (
          <div className="relative bg-background/40 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-900/30 p-10 text-center max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
            
            <svg className="h-24 w-24 text-indigo-400/40 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M15 7l3 3m0 0l3-3m-3 3V4" />
            </svg>
            <h2 className="text-xl text-foreground font-medium mb-3  ">No events created yet</h2>
            <p className="text-muted-foreground mb-8  ">Create your first event to start managing attendees and issuing NFTs</p>
            
            <Link 
              href="/events/create" 
              className="group relative inline-flex justify-center items-center px-8 py-4 text-base font-medium rounded-lg overflow-hidden transition-all duration-300  "
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute inset-0 border border-indigo-400 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative text-white flex items-center">
                Create First Event
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="group relative bg-background/40 backdrop-blur-sm rounded-xl shadow-xl border border-indigo-900/30 overflow-hidden transition-all duration-500 hover:shadow-indigo-900/20 hover:-translate-y-1"
              >
                {/* Card hover effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 z-10"></div>
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-indigo-800 flex items-center justify-center">
                      <svg className="h-16 w-16 text-indigo-300/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 text-xs rounded-full bg-indigo-600/80 backdrop-blur-sm text-white  ">
                      {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 relative z-10">
                  <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-indigo-300 transition-colors  ">{event.title}</h2>
                  <p className="text-muted-foreground mb-6 line-clamp-2  ">{event.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-muted-foreground group-hover:text-indigo-300/80 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-indigo-900/40 flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-indigo-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm  ">{format(new Date(event.date), 'PPP p')}</span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center text-muted-foreground group-hover:text-indigo-300/80 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-indigo-900/40 flex items-center justify-center mr-3">
                          <svg className="h-4 w-4 text-indigo-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-sm  ">{event.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-muted-foreground group-hover:text-indigo-300/80 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-indigo-900/40 flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-indigo-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <span className="text-sm  ">{event.registrations?.length || 0} registrations</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link 
                      href={`/events/${event.id}`}
                      className="group/btn relative inline-flex flex-1 justify-center items-center px-4 py-2.5 text-sm font-medium rounded-lg overflow-hidden transition-all duration-300  "
                    >
                      <span className="absolute inset-0 bg-background/60 opacity-90 group-hover/btn:opacity-100 transition-opacity"></span>
                      <span className="absolute inset-0 border border-indigo-400/30 rounded-lg"></span>
                      <span className="relative text-indigo-200 flex items-center justify-center">
                        View Event
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </span>
                    </Link>
                    
                    <Link 
                      href={`/dashboard/events/${event.id}/attendees`}
                      className="group/btn relative inline-flex flex-1 justify-center items-center px-4 py-2.5 text-sm font-medium rounded-lg overflow-hidden transition-all duration-300  "
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-90 group-hover/btn:opacity-100 transition-opacity"></span>
                      <span className="absolute inset-0 border border-indigo-400/30 rounded-lg"></span>
                      <span className="relative text-white flex items-center justify-center">
                        Manage
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 