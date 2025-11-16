import prisma from '../../db/prismaClient';
import { logger } from '../../config/logger';

export async function prepareReservations(tripId: string, eventIds: string[]) {
  const reservations = [];
  
  for (const eventId of eventIds) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { venue: true, trip: true },
    });
    
    if (!event || !event.venue) {
      logger.warn(`Event ${eventId} not found or has no venue`);
      continue;
    }
    
    const venue = event.venue;
    let method = venue.bookingType;
    let status = 'pending';
    let bookingUrl = venue.bookingUrl;
    
    if (method === 'deeplink') {
      // Build booking URL with parameters
      if (bookingUrl) {
        const partySize = event.trip.groupSizeMax;
        const dateTime = new Date(event.startTime).toISOString();
        bookingUrl = `${bookingUrl}?party_size=${partySize}&datetime=${dateTime}`;
        status = 'link_ready';
      }
    } else if (method === 'api') {
      // For API method, we'll prepare but not book yet
      status = 'pending';
    } else if (method === 'webview_form') {
      status = 'link_ready';
    } else if (method === 'manual') {
      status = 'pending';
    }
    
    const reservation = await prisma.reservation.create({
      data: {
        tripId,
        eventId,
        venueId: venue.id,
        method,
        bookingProvider: venue.bookingProvider,
        nameOnReservation: 'Guest',
        partySize: event.trip.groupSizeMax,
        reservedTime: event.startTime,
        status,
        rawPayload: { bookingUrl } as any,
      },
    });
    
    reservations.push({
      ...reservation,
      bookingUrl,
    });
  }
  
  return reservations;
}

export async function bookReservation(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { venue: true },
  });
  
  if (!reservation) {
    throw new Error('Reservation not found');
  }
  
  if (reservation.method !== 'api') {
    throw new Error('Only API method reservations can be booked this way');
  }
  
  // Simulate API booking (in production, call actual provider API)
  logger.info(`Booking reservation ${reservationId} via ${reservation.bookingProvider}`);
  
  const updated = await prisma.reservation.update({
    where: { id: reservationId },
    data: {
      status: 'confirmed',
      providerReservationId: `MOCK-${Date.now()}`,
    },
  });
  
  return updated;
}

export async function getReservationById(reservationId: string) {
  return await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      venue: true,
      event: true,
      trip: true,
    },
  });
}
