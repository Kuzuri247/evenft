import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const eventId = await params.id;

  if (!eventId) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    // Get all registrations for this event
    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            walletAddress: true,
            name: true,
          },
        },
      },
      orderBy: { registeredAt: 'desc' },
    });

    // Get all attendances for this event
    const attendances = await prisma.attendance.findMany({
      where: { eventId },
    });

    // Map attendances to registrations by userId
    const attendanceByUserId = attendances.reduce((acc, attendance) => {
      acc[attendance.userId] = attendance;
      return acc;
    }, {} as Record<string, any>);

    // Combine the data
    const registrationsWithAttendance = registrations.map(registration => {
      return {
        ...registration,
        attendance: attendanceByUserId[registration.userId] || null,
      };
    });

    return NextResponse.json(registrationsWithAttendance);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
} 