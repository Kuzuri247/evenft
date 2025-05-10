import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RegisterButton from "@/components/events/RegisterButton";
import Image from "next/image";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = (await params).id;
  
  const event = await prisma.event.findUnique({
    where: { id },
  });
  
  if (!event) return { title: "Event Not Found" };
  
  return {
    title: event.title,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const id = (await params).id;
  
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          walletAddress: true,
          name: true,
        },
      },
      registrations: {
        select: { id: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const formattedDate = new Date(event.date).toLocaleString();
  const registrationsCount = event.registrations.length;

  console.log('Event image URL:', event.imageUrl);
  console.log('NFT image URL:', event.nftImageUrl);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {event.imageUrl && (
          <div className="h-64 w-full">
            <img 
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          
          <div className="flex items-center text-gray-600 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center text-gray-600 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Hosted by: {event.creator.name || `User ${event.creator.walletAddress.slice(0, 6)}...`}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{registrationsCount} {registrationsCount === 1 ? 'person' : 'people'} registered</span>
          </div>
          
          {event.description && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">About this event</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>
          )}
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">NFT Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Name: {event.nftName}</p>
                <p className="text-gray-600">Symbol: {event.nftSymbol}</p>
              </div>
              {event.nftImageUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">NFT Image Preview:</p>
                  <img
                    src={event.nftImageUrl}
                    alt="NFT Preview"
                    className="h-24 w-24 object-cover rounded"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8">
            <RegisterButton eventId={event.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
