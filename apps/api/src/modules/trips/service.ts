import prisma from '../../db/prismaClient';
import * as plannerService from '../planner/service';
import * as repository from './repository';
import { logger } from '../../config/logger';
import { generateTripPDF } from './pdf';
import { nanoid } from 'nanoid';
import * as venuesService from '../venues/service';
import * as venuesRepository from '../venues/repository';

export async function planTrip(prompt: string, userId: string) {
  logger.info('Planning trip for user', { userId });
  
  const planData = await plannerService.parsePlannerPrompt(prompt);
  
  const trip = await repository.createTrip({
    userId,
    title: planData.title,
    city: planData.city,
    dateStart: new Date(planData.dateStart),
    dateEnd: new Date(planData.dateEnd),
    groupSizeMin: planData.groupSizeMin,
    groupSizeMax: planData.groupSizeMax,
    occasion: planData.occasion,
    budgetLevel: planData.budgetLevel,
    status: 'draft',
  });
  
  const sortedEvents = [...planData.events].sort((a, b) => a.orderIndex - b.orderIndex);
  const matchedVenueIds = new Set<string>();
  
  for (const eventData of sortedEvents) {
    const baseEventData = {
      tripId: trip.id,
      orderIndex: eventData.orderIndex,
      type: eventData.type,
      title: eventData.label,
      description: eventData.notes || null,
      startTime: new Date(eventData.timeWindow.start),
      endTime: new Date(eventData.timeWindow.end),
    };
    
    const venueMatch = await venuesService.findBestMatches(
      planData.city,
      eventData.primaryVenueRequirements,
      eventData.backupVenueRequirements,
    );
    
    await prisma.event.create({
      data: {
        ...baseEventData,
        isPrimary: true,
        venueId: venueMatch.primary?.id ?? null,
      },
    });
    
    if (venueMatch.primary?.id) {
      matchedVenueIds.add(venueMatch.primary.id);
    }
    
    for (const backupVenue of venueMatch.backups) {
      await prisma.event.create({
        data: {
          ...baseEventData,
          title: `${eventData.label} (Plan B)`,
          isPrimary: false,
          venueId: backupVenue.id,
        },
      });
      matchedVenueIds.add(backupVenue.id);
    }
  }
  
  const events = await prisma.event.findMany({
    where: { tripId: trip.id },
    include: { venue: true },
    orderBy: [
      { orderIndex: 'asc' },
      { isPrimary: 'desc' },
    ],
  });
  
  const venues = await venuesRepository.findVenuesByIds(Array.from(matchedVenueIds));
  
  return { trip, events, venues };
}

export async function getTripById(tripId: string) {
  return await repository.getTripWithDetails(tripId);
}

export async function updateTrip(tripId: string, updates: any) {
  return await repository.updateTrip(tripId, updates);
}

export async function getTripEvents(tripId: string) {
  return await prisma.event.findMany({
    where: { tripId },
    orderBy: { orderIndex: 'asc' },
    include: { venue: true },
  });
}

export async function generateIcs(tripId: string): Promise<string> {
  const trip = await getTripById(tripId);
  if (!trip) throw new Error('Trip not found');
  
  const events = (trip.events || []).filter((event) => event.isPrimary);
  
  let icsContent = 'BEGIN:VCALENDAR\r\n';
  icsContent += 'VERSION:2.0\r\n';
  icsContent += 'PRODID:-//PartyPilot//EN\r\n';
  icsContent += 'CALSCALE:GREGORIAN\r\n';
  
  for (const event of events) {
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    icsContent += 'BEGIN:VEVENT\r\n';
    icsContent += `UID:${event.id}@partypilot.app\r\n`;
    icsContent += `DTSTART:${formatDate(new Date(event.startTime))}\r\n`;
    icsContent += `DTEND:${formatDate(new Date(event.endTime))}\r\n`;
    const summary = event.venue ? `${event.title} @ ${event.venue.name}` : event.title;
    icsContent += `SUMMARY:${summary}\r\n`;
    
    if (event.venue) {
      icsContent += `LOCATION:${event.venue.address}\r\n`;
    }
    
    if (event.description) {
      icsContent += `DESCRIPTION:${event.description}\r\n`;
    }
    
    icsContent += 'END:VEVENT\r\n';
  }
  
  icsContent += 'END:VCALENDAR\r\n';
  
  return icsContent;
}

export async function generatePdf(tripId: string): Promise<Buffer> {
  const trip = await getTripById(tripId);
  if (!trip) throw new Error('Trip not found');

  return await generateTripPDF(trip);
}

export async function getOrCreateShareLink(tripId: string): Promise<string> {
  let shareLink = await prisma.shareLink.findFirst({
    where: { tripId },
  });

  if (!shareLink) {
    const slug = nanoid(12);  // Cryptographically secure random slug
    shareLink = await prisma.shareLink.create({
      data: {
        tripId,
        slug,
      },
    });
  }

  return `${process.env.APP_URL || 'http://localhost:3000'}/t/${shareLink.slug}`;
}

export async function bootstrapNotifications(tripId: string) {
  const trip = await getTripById(tripId);
  if (!trip) throw new Error('Trip not found');
  
  const notifications = [];
  const tripStart = new Date(trip.dateStart);
  const now = new Date();
  
  // Weather check - 48 hours before
  const weatherTime = new Date(tripStart.getTime() - 48 * 60 * 60 * 1000);
  notifications.push(
    await prisma.notification.create({
      data: {
        tripId,
        type: 'weather_check',
        scheduledFor: weatherTime,
        status: 'scheduled',
        channel: 'push',
        payload: { message: 'Check weather for your trip' },
      },
    })
  );
  
  // Headcount check - 48 hours before
  notifications.push(
    await prisma.notification.create({
      data: {
        tripId,
        type: 'headcount',
        scheduledFor: weatherTime,
        status: 'scheduled',
        channel: 'push',
        payload: { message: 'Confirm final headcount' },
      },
    })
  );
  
  // Dress code reminder - morning of
  const morningOf = new Date(tripStart);
  morningOf.setHours(9, 0, 0, 0);
  notifications.push(
    await prisma.notification.create({
      data: {
        tripId,
        type: 'dress_code',
        scheduledFor: morningOf,
        status: 'scheduled',
        channel: 'push',
        payload: { message: 'Remember dress code and ID' },
      },
    })
  );
  
  const primaryEvents = (trip.events || [])
    .filter((event) => event.isPrimary)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  const leaveNowLeadMinutes = 20;
  
  for (const event of primaryEvents) {
    const leaveAt = new Date(new Date(event.startTime).getTime() - leaveNowLeadMinutes * 60 * 1000);
    if (leaveAt <= now) {
      continue;
    }
    
    notifications.push(
      await prisma.notification.create({
        data: {
          tripId,
          type: 'leave_now',
          scheduledFor: leaveAt,
          status: 'scheduled',
          channel: 'push',
          payload: {
            message: `Leave now for ${event.title}`,
            eventId: event.id,
          },
        },
      })
    );
  }
  
  return notifications;
}
