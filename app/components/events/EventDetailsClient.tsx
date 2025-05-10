'use client';

import RegisterButton from "@/components/events/RegisterButton";

interface Creator {
  id: string;
  walletAddress: string;
  name: string | null;
}

interface Registration {
  id: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  location: string | null;
  imageUrl: string | null;
  nftName: string;
  nftSymbol: string;
  nftImageUrl: string | null;
  creator: Creator;
  registrations: Registration[];
  maxAttendees?: number;
}

interface EventDetailsClientProps {
  event: Event;
  formattedDate: string;
  registrationsCount: number;
}

export default function EventDetailsClient({ event, formattedDate, registrationsCount }: EventDetailsClientProps) {
  const maxAttendees = event.maxAttendees ?? 100; // Use nullish coalescing
  const registrationPercentage = (registrationsCount / maxAttendees) * 100;

  return (
    <div className="min-h-screen bg-background overflow-hidden pb-20">
      {/* Hero section with event image */}
      <div className="relative w-full h-[40vh] overflow-hidden">
        {/* Background overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/80 via-background/50 to-background z-10"></div>
        
        {/* Event image */}
        {event.imageUrl ? (
          <img 
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-violet-900 to-purple-950">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          </div>
        )}
        
        {/* Animated blobs */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob z-0"></div>
        <div className="absolute bottom-1/2 right-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 z-0"></div>
        
        {/* Event title overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-violet-200 leading-tight font-calsans">
              {event.title}
            </h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            {/* Event details */}
            <div className="relative bg-background/40 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-900/30 p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
              
              <div className="relative">
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center text-indigo-300">
                    <div className="h-10 w-10 rounded-full bg-indigo-900/40 backdrop-blur-sm flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-indigo-200/70 font-montserrat">Date & Time</div>
                      <div className="font-medium font-montserrat">{formattedDate}</div>
                    </div>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center text-indigo-300">
                      <div className="h-10 w-10 rounded-full bg-indigo-900/40 backdrop-blur-sm flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-indigo-200/70 font-montserrat">Location</div>
                        <div className="font-medium font-montserrat">{event.location}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-indigo-300">
                    <div className="h-10 w-10 rounded-full bg-indigo-900/40 backdrop-blur-sm flex items-center justify-center mr-3">
                      <svg className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-indigo-200/70 font-montserrat">Hosted by</div>
                      <div className="font-medium font-montserrat">{event.creator.name || `User ${event.creator.walletAddress.slice(0, 6)}...`}</div>
                    </div>
                  </div>
                </div>
                
                {event.description && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-foreground font-calsans">About this event</h2>
                    <div className="prose prose-indigo prose-invert max-w-none">
                      <p className="text-muted-foreground whitespace-pre-line font-montserrat">{event.description}</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-foreground font-calsans">What you'll get</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-indigo-900/40 backdrop-blur-sm flex items-center justify-center mr-3 mt-0.5">
                        <svg className="h-4 w-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-muted-foreground font-montserrat">Access to the event and all its activities</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-indigo-900/40 backdrop-blur-sm flex items-center justify-center mr-3 mt-0.5">
                        <svg className="h-4 w-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-muted-foreground font-montserrat">Blockchain verification of your attendance</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-indigo-900/40 backdrop-blur-sm flex items-center justify-center mr-3 mt-0.5">
                        <svg className="h-4 w-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-muted-foreground font-montserrat">Exclusive collectible NFT as proof of attendance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Registration card */}
            <div className="relative bg-background/40 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-900/30 p-6 overflow-hidden sticky top-20">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
              
              <div className="relative">
                {/* Registration stats */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-indigo-200/70 font-montserrat">Spots remaining</div>
                    <div className="text-sm font-medium text-indigo-200 font-montserrat">{maxAttendees - registrationsCount} of {maxAttendees}</div>
                  </div>
                  
                  <div className="w-full h-2 bg-indigo-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                      style={{ width: `${registrationPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center mt-4 text-indigo-300 font-montserrat">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{registrationsCount} {registrationsCount === 1 ? 'person' : 'people'} registered</span>
                  </div>
                </div>
                
                {/* NFT Preview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-foreground font-calsans">NFT Reward</h3>
                  <div className="flex space-x-4 items-center">
                    {event.nftImageUrl ? (
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-indigo-500/20">
                        <img
                          src={event.nftImageUrl}
                          alt="NFT Preview"
                          className="h-full w-full object-cover"
                          crossOrigin="anonymous"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-lg bg-indigo-900/40 flex items-center justify-center">
                        <svg className="h-8 w-8 text-indigo-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-foreground font-montserrat">{event.nftName}</div>
                      <div className="text-sm text-muted-foreground font-montserrat">Symbol: {event.nftSymbol}</div>
                    </div>
                  </div>
                </div>
                
                {/* Register button */}
                <div className="mt-6">
                  <RegisterButton eventId={event.id} />
                </div>
                
                {/* Information note */}
                <div className="mt-6 text-xs text-indigo-300/70 bg-indigo-950/30 rounded-lg p-3 border border-indigo-500/10 font-montserrat">
                  <p>By registering, you'll be able to claim your NFT at the event using the same wallet.</p>
                </div>
              </div>
            </div>
            
            {/* Host information */}
            <div className="relative bg-background/40 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-900/30 p-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
              
              <div className="relative">
                <h3 className="text-lg font-semibold mb-4 text-foreground font-calsans">About the host</h3>
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-700/30 flex items-center justify-center mr-4">
                    <svg className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-foreground font-montserrat">{event.creator.name || `User ${event.creator.walletAddress.slice(0, 6)}...`}</div>
                    <div className="text-xs text-muted-foreground font-montserrat">{`${event.creator.walletAddress.slice(0, 6)}...${event.creator.walletAddress.slice(-4)}`}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-montserrat">Event organizer on EventSeal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 