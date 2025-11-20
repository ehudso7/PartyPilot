import { Prisma, Reservation } from '@prisma/client';
import prisma from '../../db/prismaClient';
import { logger } from '../../config/logger';

interface PrepareReservationsResult {
  reservations: Array<Reservation & { bookingUrl?: string | null }>;
  skippedEventIds: string[];
}

function extractBookingUrl(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') {
    return undefined;
  }

  if ('bookingUrl' in payload && typeof (payload as any).bookingUrl === 'string') {
    return (payload as any).bookingUrl;
  }

  return undefined;
}

export async function prepareReservations(userId: string, tripId: string, eventIds: string[]): Promise<PrepareReservationsResult> {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      events: {
        include: { venue: true },
      },
      user: true,
    },
  });

  if (!trip || trip.userId !== userId) {
    throw new Error('Trip not found');
  }

  const requestedEventIds = new Set(eventIds);
  const relevantEvents = trip.events.filter((event) => requestedEventIds.has(event.id));

  const reservations: Array<Reservation & { bookingUrl?: string | null }> = [];
  const skipped = new Set<string>();
  const nameOnReservation = trip.user?.name || 'PartyPilot Guest';

  for (const event of relevantEvents) {
    if (!event.isPrimary) {
      skipped.add(event.id);
      continue;
    }

    if (!event.venueId || !event.venue) {
      skipped.add(event.id);
      continue;
    }

    const existingReservation = await prisma.reservation.findFirst({
      where: { eventId: event.id },
    });

    if (existingReservation) {
      reservations.push({
        ...existingReservation,
        bookingUrl: extractBookingUrl(existingReservation.rawPayload),
      });
      continue;
    }

    const venue = event.venue;
    const method = venue.bookingType || 'manual';
    let status: Reservation['status'] = 'pending';
    let bookingUrl = venue.bookingUrl || undefined;

    if (method === 'deeplink' && bookingUrl) {
      const partySize = trip.groupSizeMax;
      const dateTime = new Date(event.startTime).toISOString();
      const connector = bookingUrl.includes('?') ? '&' : '?';
      bookingUrl = `${bookingUrl}${connector}party_size=${partySize}&datetime=${encodeURIComponent(dateTime)}`;
      status = 'link_ready';
    } else if (method === 'webview_form') {
      status = 'link_ready';
    } else if (method === 'api') {
      status = 'pending';
    } else {
      status = 'pending';
    }

    const rawPayload: Prisma.JsonObject = {};
    if (bookingUrl) {
      rawPayload.bookingUrl = bookingUrl;
    }

    const reservation = await prisma.reservation.create({
      data: {
        tripId,
        eventId: event.id,
        venueId: venue.id,
        method,
        bookingProvider: venue.bookingProvider,
        nameOnReservation,
        partySize: trip.groupSizeMax,
        reservedTime: event.startTime,
        status,
        rawPayload: Object.keys(rawPayload).length ? rawPayload : undefined,
      },
    });

    reservations.push({
      ...reservation,
      bookingUrl: bookingUrl || null,
    });
  }

  for (const id of eventIds) {
    if (!relevantEvents.find((event) => event.id === id)) {
      skipped.add(id);
    }
  }

  return {
    reservations,
    skippedEventIds: Array.from(skipped),
  };
}

export async function bookReservation(userId: string, reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { venue: true, trip: true },
  });

  if (!reservation || reservation.trip.userId !== userId) {
    throw new Error('Reservation not found');
  }

  if (reservation.method !== 'api') {
    throw new Error('Only API method reservations can be booked this way');
  }

  logger.info('Booking reservation via provider', {
    reservationId,
    provider: reservation.bookingProvider,
  });

  return prisma.reservation.update({
    where: { id: reservationId },
    data: {
      status: 'confirmed',
      providerReservationId: `MOCK-${Date.now()}`,
    },
  });
}

export async function getReservationById(userId: string, reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      venue: true,
      event: true,
      trip: true,
    },
  });

  if (!reservation || reservation.trip.userId !== userId) {
    return null;
  }

  return reservation;
}
