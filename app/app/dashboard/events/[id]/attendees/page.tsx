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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Attendees</h1>
            <p className="text-gray-600 mb-6">Connect your wallet to manage attendees</p>
            <WalletConnectButton />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Error</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <Link 
              href="/dashboard"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Event Not Found</h1>
            <Link 
              href="/dashboard"
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            href="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
          <p className="text-gray-600">
            {format(new Date(event.date), 'PPP p')}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">Attendee Management</h2>
            <p className="text-gray-600">Confirm attendance for registered users</p>
            <p className="text-gray-600 mt-1">When you confirm attendance, an NFT will be minted to the attendee's wallet as proof of attendance.</p>
          </div>
          
          {registrations.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No registrations for this event yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.user.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {`${registration.user.walletAddress.slice(0, 4)}...${registration.user.walletAddress.slice(-4)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(registration.registeredAt), 'PPP p')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.attendance ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Registered
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {registration.attendance ? (
                          <div className="text-gray-500">
                            <div className="mb-1">
                              Confirmed on {format(new Date(registration.attendance.confirmedAt), 'PPP p')}
                            </div>
                            
                            {registration.attendance.nftMintAddress ? (
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <svg className="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-xs text-green-700 font-medium">NFT Minted</span>
                                </div>
                                
                                <div className="text-xs text-gray-500">
                                  NFT: <a 
                                    href={`https://explorer.solana.com/address/${registration.attendance.nftMintAddress}?cluster=devnet`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800"
                                  >
                                    {`${registration.attendance.nftMintAddress.slice(0, 6)}...${registration.attendance.nftMintAddress.slice(-6)}`}
                                  </a>
                                </div>
                                
                                {registration.attendance.nftTransactionSignature && (
                                  <div className="text-xs text-gray-500">
                                    Tx: <a 
                                      href={`https://explorer.solana.com/tx/${registration.attendance.nftTransactionSignature}?cluster=devnet`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-indigo-600 hover:text-indigo-800"
                                    >
                                      View Transaction
                                    </a>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center text-xs text-yellow-700">
                                  <svg className="h-4 w-4 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                  <span>NFT Minting Failed</span>
                                </div>

                                <button
                                  onClick={() => retryNFTMint(registration.attendance!.id, registration.userId)}
                                  disabled={retryingNFT === registration.attendance!.id}
                                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white ${
                                    retryingNFT === registration.attendance!.id ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                  }`}
                                >
                                  {retryingNFT === registration.attendance!.id ? (
                                    <>
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => confirmAttendance(registration.id)}
                            disabled={confirmingAttendance === registration.id}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white ${
                              confirmingAttendance === registration.id ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                          >
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
                                Confirm & Mint NFT
                              </>
                            )}
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