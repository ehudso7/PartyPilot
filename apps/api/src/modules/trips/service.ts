import prisma from '../../db/prismaClient';
import * as plannerService from '../planner/service';
import * as repository from './repository';
import { logger } from '../../config/logger';

export async function planTrip(prompt: string, userId: string) {
  logger.info('Planning trip for user:', userId);
  
  // Use planner service to parse prompt
  const planData = await plannerService.parsePlannerPrompt(prompt);
  
  // Create trip in database
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
  
  // Create events
  const events = [];
  for (let i = 0; i < planData.events.length; i++) {
    const eventData = planData.events[i];
    const event = await prisma.event.create({
      data: {
        tripId: trip.id,
        orderIndex: i,
        type: eventData.type,
        title: eventData.title,
        description: eventData.description || null,
        startTime: new Date(eventData.startTime),
        endTime: new Date(eventData.endTime),
        isPrimary: true,
      },
    });
    events.push(event);
  }
  
  return { trip, events, venues: [] };
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
  
  const events = trip.events || [];
  
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
    icsContent += `SUMMARY:${event.title}\r\n`;
    
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

export async function getOrCreateShareLink(tripId: string): Promise<string> {
  let shareLink = await prisma.shareLink.findFirst({
    where: { tripId },
  });
  
  if (!shareLink) {
    const slug = `${tripId.substring(0, 8)}-${Date.now()}`;
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
  
  return notifications;
}
