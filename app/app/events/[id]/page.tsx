import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventDetailsClient from "@/components/events/EventDetailsClient";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id;
  
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
  const id = params.id;
  
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
  
  // Pass the event data to the client component
  return <EventDetailsClient 
    event={event} 
    formattedDate={formattedDate} 
    registrationsCount={registrationsCount} 
  />;
}
