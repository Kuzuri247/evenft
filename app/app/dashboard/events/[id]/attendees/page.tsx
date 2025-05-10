'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { format } from 'date-fns';
import WalletConnectButton from '@/components/WalletConnectButton';

interface Event {
  id: string;
  title: string;
  date: string;
}

interface Registration {
  id: string;
  userId: string;
  eventId: string;
  registeredAt: string;
  user: {
    walletAddress: string;
    name: string | null;
  };
  attendance: {
    id: string;
    confirmedAt: string;
    nftMintAddress: string | null;
    nftTransactionSignature: string | null;
  } | null;
}

export default function AttendeeManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { publicKey } = useWallet();
  
  const [eventId, setEventId] = useState('');
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingAttendance, setConfirmingAttendance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryingNFT, setRetryingNFT] = useState<string | null>(null);

  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split('/');
      const idIndex = pathParts.findIndex(part => part === 'events') + 1;
      
      if (idIndex > 0 && idIndex < pathParts.length) {
        setEventId(pathParts[idIndex]);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!publicKey || !eventId) {
      setLoading(false);
      return;
    }

    const fetchEventDetails = async () => {
      try {
        const eventResponse = await fetch(`/api/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const eventData = await eventResponse.json();
        setEvent(eventData);

        if (eventData.creator.walletAddress !== publicKey.toString()) {
          router.push('/dashboard');
          return;
        }

        const registrationsResponse = await fetch(`/api/events/${eventId}/registrations`);
        if (!registrationsResponse.ok) {
          throw new Error('Failed to fetch registrations');
        }
        
        const registrationsData = await registrationsResponse.json();
        setRegistrations(registrationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Could not load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, publicKey, router]);

  const confirmAttendance = async (registrationId: string) => {
    if (!publicKey || !eventId) return;
    
    setConfirmingAttendance(registrationId);
    setError(null);

    try {
      const response = await fetch(`/api/events/${eventId}/attendances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          confirmedBy: publicKey.toString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm attendance');
      }

      const data = await response.json();
      
      setRegistrations(prev => prev.map(reg => {
        if (reg.id === registrationId) {
          return {
            ...reg,
            attendance: data
          };
        }
        return reg;
      }));

      if (data.nftMinted) {
        console.log('NFT minted successfully!');
      }

    } catch (error) {
      console.error('Error confirming attendance:', error);
      setError(error instanceof Error ? error.message : 'Failed to confirm attendance');
    } finally {
      setConfirmingAttendance(null);
    }
  };

  const retryNFTMint = async (attendanceId: string, userId: string) => {
    if (!publicKey || !eventId) return;
    
    setRetryingNFT(attendanceId);
    setError(null);

    try {
      const response = await fetch(`/api/events/${eventId}/attendances/${attendanceId}/retry-nft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmedBy: publicKey.toString(),
          userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mint NFT');
      }

      const data = await response.json();
      
      setRegistrations(prev => prev.map(reg => {
        if (reg.userId === userId) {
          return {
            ...reg,
            attendance: {
              ...reg.attendance,
              ...data
            }
          };
        }
        return reg;
      }));

      if (data.nftMinted) {
        console.log('NFT minted successfully!');
      }

    } catch (error) {
      console.error('Error minting NFT:', error);
      setError(error instanceof Error ? error.message : 'Failed to mint NFT');
    } finally {
      setRetryingNFT(null);
    }
  };

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-background overflow-hidden">
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
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-violet-200 inline-block">Manage Attendees</h1>
            <p className="mt-4 text-xl text-indigo-100">Connect your wallet to manage attendees</p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto px-4 -mt-10 relative z-20">
          <div className="relative bg-background/40 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-900/30 p-10 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
            
            <div className="relative">
              <svg className="h-24 w-24 text-indigo-400/40 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xl text-foreground font-medium mb-6">Connect your wallet to manage attendees</p>
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
            <p className="mt-8 text-lg text-muted-foreground">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background overflow-hidden">
        <div className="relative py-20">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-950 opacity-90">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100/10 mb-6">
              <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-6">Error</h1>
            <p className="text-red-300 mb-6">{error}</p>
            <Link 
              href="/dashboard"
              className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute inset-0 border border-indigo-400 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative text-white flex items-center">
                Back to Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background overflow-hidden">
        <div className="relative py-20">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-950 opacity-90">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-100/10 mb-6">
              <svg className="h-12 w-12 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-6">Event Not Found</h1>
            <Link 
              href="/dashboard"
              className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute inset-0 border border-indigo-400 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative text-white flex items-center">
                Back to Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden pb-20">
      {/* Header with animated background */}
      <div className="relative py-16 mb-8">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-950 opacity-90">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        </div>
        
        {/* Animated blobs */}
        <div className="absolute top-1/3 right-20 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/3 left-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex flex-col">
            <Link 
              href="/dashboard"
              className="inline-flex items-center text-indigo-300 hover:text-indigo-100 mb-6 transition-colors"
            >
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-violet-200 mb-2">{event.title}</h1>
            <p className="text-xl text-indigo-200">
              {format(new Date(event.date), 'PPP p')}
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative bg-background/40 backdrop-blur-sm rounded-xl shadow-xl border border-indigo-900/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl"></div>
          
          <div className="relative p-6 border-b border-indigo-900/30">
            <h2 className="text-2xl font-semibold text-foreground">Attendee Management</h2>
            <p className="text-muted-foreground">Confirm attendance for registered users</p>
            <p className="text-muted-foreground mt-1">When you confirm attendance, an NFT will be minted to the attendee's wallet as proof of attendance.</p>
          </div>
          
          {registrations.length === 0 ? (
            <div className="relative p-16 text-center">
              <svg className="h-20 w-20 text-indigo-400/30 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-xl text-muted-foreground">No registrations for this event yet.</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full divide-y divide-indigo-900/20">
                <thead className="bg-indigo-900/20">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                      Registered On
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-900/20">
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-indigo-900/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">
                          {registration.user.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {`${registration.user.walletAddress.slice(0, 4)}...${registration.user.walletAddress.slice(-4)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {format(new Date(registration.registeredAt), 'PPP p')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.attendance ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1"></span>
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1"></span>
                            Registered
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {registration.attendance ? (
                          <div className="text-muted-foreground">
                            <div className="mb-2 text-indigo-300">
                              Confirmed on {format(new Date(registration.attendance.confirmedAt), 'PPP p')}
                            </div>
                            
                            {registration.attendance.nftMintAddress ? (
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                                    <svg className="h-3 w-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  <span className="text-xs text-green-400 font-medium">NFT Minted</span>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <div className="text-xs px-3 py-1 rounded-lg bg-background/80 border border-indigo-900/30">
                                    NFT: <a 
                                      href={`https://explorer.solana.com/address/${registration.attendance.nftMintAddress}?cluster=devnet`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-indigo-400 hover:text-indigo-300"
                                    >
                                      {`${registration.attendance.nftMintAddress.slice(0, 6)}...${registration.attendance.nftMintAddress.slice(-6)}`}
                                    </a>
                                  </div>
                                  
                                  {registration.attendance.nftTransactionSignature && (
                                    <div className="text-xs px-3 py-1 rounded-lg bg-background/80 border border-indigo-900/30">
                                      Tx: <a 
                                        href={`https://explorer.solana.com/tx/${registration.attendance.nftTransactionSignature}?cluster=devnet`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-indigo-400 hover:text-indigo-300"
                                      >
                                        View Transaction
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center text-xs text-yellow-400">
                                  <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center mr-2">
                                    <svg className="h-3 w-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                  </div>
                                  <span>NFT Minting Failed</span>
                                </div>

                                <button
                                  onClick={() => retryNFTMint(registration.attendance!.id, registration.userId)}
                                  disabled={retryingNFT === registration.attendance!.id}
                                  className={`group relative inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg overflow-hidden transition-all duration-300 ${
                                    retryingNFT === registration.attendance!.id ? 'opacity-80' : 'hover:-translate-y-0.5'
                                  }`}
                                >
                                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                                  <span className="absolute inset-0 border border-indigo-400/30 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
                                  <span className="relative text-white flex items-center">
                                    {retryingNFT === registration.attendance!.id ? (
                                      <>
                                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Retrying...
                                      </>
                                    ) : (
                                      <>
                                        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Retry NFT Mint
                                      </>
                                    )}
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => confirmAttendance(registration.id)}
                            disabled={confirmingAttendance === registration.id}
                            className={`group relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg overflow-hidden transition-all duration-300 ${
                              confirmingAttendance === registration.id ? 'opacity-80' : 'hover:-translate-y-0.5'
                            }`}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-700 opacity-90 group-hover:opacity-100 transition-opacity"></span>
                            <span className="absolute inset-0 border border-indigo-400/30 rounded-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
                            <span className="relative text-white flex items-center">
                              {confirmingAttendance === registration.id ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Confirm & Mint NFT
                                </>
                              )}
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 