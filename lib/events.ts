import { prisma } from "@/lib/prisma";

export async function getEventsByCreator(creatorId: string) {
  try {
    const events = await prisma.event.findMany({
      where: {
        creatorId,
      },
      include: {
        _count: {
          select: {
            registrations: true,
            attendees: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    return events;
  } catch (error) {
    console.error("Error fetching events by creator:", error);
    return [];
  }
}

export async function getEventRegistrations(eventId: string) {
  try {
    const registrations = await prisma.registration.findMany({
      where: {
        eventId,
      },
      include: {
        user: true,
      },
      orderBy: {
        registeredAt: 'desc',
      },
    });
    
    return registrations;
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return [];
  }
} 