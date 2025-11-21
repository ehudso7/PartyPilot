import cron from 'node-cron';
import prisma from '../db/prismaClient';
import { logger } from '../config/logger';
import { config } from '../config/env';

interface NotificationPayload {
  message: string;
  tripId: string;
  eventId?: string;
  [key: string]: any;
}

/**
 * Send notification via configured channel
 * Integration points for production:
 * - Email: SendGrid, AWS SES, Resend, Mailgun
 * - Push: Expo Push, Firebase FCM, APNs
 * - SMS: Twilio, AWS SNS, MessageBird
 */
async function sendNotification(notification: {
  id: string;
  type: string;
  channel: string;
  payload: NotificationPayload;
  tripId: string;
  trip: any;
}) {
  const { type, channel, payload, trip } = notification;

  try {
    logger.info('Sending notification', {
      notificationId: notification.id,
      type,
      channel,
      tripId: notification.tripId,
    });

    switch (channel) {
      case 'email':
        await sendEmailNotification(trip.user?.email, type, payload, trip);
        break;

      case 'push':
        await sendPushNotification(trip.userId, type, payload, trip);
        break;

      case 'sms':
        if (trip.user?.phone) {
          await sendSmsNotification(trip.user.phone, type, payload, trip);
        } else {
          logger.warn('No phone number for SMS notification', { userId: trip.userId });
        }
        break;

      default:
        logger.warn('Unknown notification channel', { channel });
    }

    logger.info('Notification sent successfully', {
      notificationId: notification.id,
      type,
      channel,
    });
  } catch (error) {
    logger.error('Failed to send notification', {
      notificationId: notification.id,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

async function sendEmailNotification(email: string, type: string, payload: NotificationPayload, trip: any) {
  const subject = getEmailSubject(type, trip);
  const body = getEmailBody(type, payload, trip);

  logger.info('📧 Email notification', {
    to: email,
    subject,
    preview: body.substring(0, 100) + '...',
  });

  // TODO: Production email integration
  // Example SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await sgMail.send({
    to: email,
    from: 'notifications@partypilot.app',
    subject,
    text: body,
    html: `<div>${body.replace(/\n/g, '<br>')}</div>`,
  });
  */
}

async function sendPushNotification(userId: string, type: string, payload: NotificationPayload, trip: any) {
  const title = getPushTitle(type, trip);
  const body = getPushBody(type, payload, trip);

  logger.info('📱 Push notification', { userId, title, body });

  // TODO: Production push integration
  // Example Expo:
  /*
  const { Expo } = require('expo-server-sdk');
  const expo = new Expo();
  const pushToken = await getUserPushToken(userId);
  if (Expo.isExpoPushToken(pushToken)) {
    await expo.sendPushNotificationsAsync([{
      to: pushToken,
      title,
      body,
      data: { tripId: trip.id, type },
    }]);
  }
  */
}

async function sendSmsNotification(phone: string, type: string, payload: NotificationPayload, trip: any) {
  const message = getSmsBody(type, payload, trip);

  logger.info('💬 SMS notification', { to: phone, message });

  // TODO: Production SMS integration
  // Example Twilio:
  /*
  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
  */
}

// Content generation helpers

function getEmailSubject(type: string, trip: any): string {
  const subjects: Record<string, string> = {
    weather_check: `Weather update for ${trip.title}`,
    headcount: `Confirm headcount for ${trip.title}`,
    dress_code: `Dress code reminder for ${trip.title}`,
    leave_now: `Time to leave for ${trip.title}`,
  };
  return subjects[type] || `Update for ${trip.title}`;
}

function getEmailBody(type: string, payload: NotificationPayload, trip: any): string {
  const tripDate = new Date(trip.dateStart).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const userName = trip.user?.name || 'there';

  const bodies: Record<string, string> = {
    weather_check: `Hi ${userName}!

Your trip "${trip.title}" is coming up on ${tripDate}.

Check the weather forecast for ${trip.city} and pack accordingly:
- Comfortable walking shoes
- Layers if weather is unpredictable
- Rain gear if needed

View itinerary: ${config.appUrl}/trips/${trip.id}

PartyPilot`,

    headcount: `Hi ${userName}!

Your trip "${trip.title}" is in 2 days (${tripDate}).

Please confirm your final headcount to finalize reservations.
Current estimate: ${trip.groupSizeMin}-${trip.groupSizeMax} people

Update trip: ${config.appUrl}/trips/${trip.id}

PartyPilot`,

    dress_code: `Hi ${userName}!

Today's the day! "${trip.title}" starts soon.

Important reminders:
✓ Bring valid ID
✓ Check dress codes for venues
✓ Arrive on time for reservations

View itinerary: ${config.appUrl}/trips/${trip.id}

Have fun!
PartyPilot`,

    leave_now: `Time to head out!

Your next stop for "${trip.title}" is coming up.

${payload.message || 'Check your itinerary for details.'}

View itinerary: ${config.appUrl}/trips/${trip.id}

PartyPilot`,
  };

  return bodies[type] || payload.message || `Update for "${trip.title}"`;
}

function getPushTitle(type: string, trip: any): string {
  const titles: Record<string, string> = {
    weather_check: 'Check the weather',
    headcount: 'Confirm headcount',
    dress_code: 'Trip reminder',
    leave_now: 'Time to go!',
  };
  return titles[type] || 'Trip update';
}

function getPushBody(type: string, payload: NotificationPayload, trip: any): string {
  const bodies: Record<string, string> = {
    weather_check: `Your trip "${trip.title}" is in 2 days. Check weather for ${trip.city}!`,
    headcount: `Confirm final headcount for "${trip.title}"`,
    dress_code: `Don't forget your ID! Your trip starts soon.`,
    leave_now: payload.message || `Time for the next stop on "${trip.title}"`,
  };
  return bodies[type] || payload.message || `Update for "${trip.title}"`;
}

function getSmsBody(type: string, payload: NotificationPayload, trip: any): string {
  const tripDate = new Date(trip.dateStart).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const bodies: Record<string, string> = {
    weather_check: `PartyPilot: Check weather for "${trip.title}" on ${tripDate} in ${trip.city}`,
    headcount: `PartyPilot: Confirm headcount for "${trip.title}" on ${tripDate}`,
    dress_code: `PartyPilot: Today's the day! Bring ID. "${trip.title}" starts soon.`,
    leave_now: `PartyPilot: ${payload.message || 'Time to leave for next stop!'}`,
  };
  return bodies[type] || `PartyPilot: ${payload.message || 'Trip update'}`;
}

/**
 * Process all pending notifications
 */
async function sendPendingNotifications() {
  try {
    const pending = await prisma.notification.findMany({
      where: {
        status: 'scheduled',
        scheduledFor: { lte: new Date() },
      },
      include: {
        trip: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
      take: 50, // Process in batches
    });

    if (pending.length === 0) {
      logger.debug('No pending notifications');
      return;
    }

    logger.info(`Processing ${pending.length} pending notifications`);

    for (const notification of pending) {
      try {
        await sendNotification(notification as any);

        await prisma.notification.update({
          where: { id: notification.id },
          data: { status: 'sent', updatedAt: new Date() },
        });
      } catch (error) {
        logger.error('Failed to send notification', {
          notificationId: notification.id,
          error: error instanceof Error ? error.message : String(error),
        });

        // Mark as failed but continue processing others
        await prisma.notification.update({
          where: { id: notification.id },
          data: { status: 'failed', updatedAt: new Date() },
        });
      }
    }

    logger.info(`Notification batch complete`);
  } catch (error) {
    logger.error('Error in sendPendingNotifications', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Start notification scheduler (runs every 5 minutes)
 */
export function startNotificationScheduler() {
  logger.info('🔔 Starting notification scheduler (every 5 minutes)');

  cron.schedule('*/5 * * * *', async () => {
    logger.debug('Running notification scheduler');
    await sendPendingNotifications();
  });

  // Process immediately on startup
  sendPendingNotifications().catch((error) => {
    logger.error('Error in initial notification processing', { error });
  });
}
