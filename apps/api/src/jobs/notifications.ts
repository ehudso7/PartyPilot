import cron from 'node-cron';
import prisma from '../db/prismaClient';
import { logger } from '../config/logger';

// Send pending notifications
async function sendPendingNotifications() {
  try {
    const pending = await prisma.notification.findMany({
      where: {
        status: 'scheduled',
        scheduledFor: { lte: new Date() },
      },
      include: {
        trip: true,
      },
      take: 50, // Process in batches
    });

    for (const notification of pending) {
      try {
        // In production, integrate with real notification service
        // (Push notifications, SMS, email, etc.)
        await sendNotification(notification);

        // Mark as sent
        await prisma.notification.update({
          where: { id: notification.id },
          data: { status: 'sent' },
        });

        logger.info('Notification sent', { notificationId: notification.id, type: notification.type });
      } catch (error) {
        logger.error('Failed to send notification', { notificationId: notification.id, error });
      }
    }
  } catch (error) {
    logger.error('Error processing notifications:', error);
  }
}

async function sendNotification(notification: any) {
  const payload = notification.payload as any;
  
  // Import notification service
  const { sendNotification: sendNotif } = await import('../services/notifications');
  
  // Get recipient info (user's device token, phone, or email)
  // In production, fetch from user preferences/device registrations
  const recipient = notification.trip?.user?.email || 'user@example.com';
  
  const notificationPayload = {
    type: notification.type,
    tripId: notification.tripId,
    message: payload.message || 'You have a trip update',
    title: getTitleForNotificationType(notification.type),
    data: {
      tripId: notification.tripId,
      notificationId: notification.id,
    },
  };

  const success = await sendNotif(
    notification.channel,
    recipient,
    notificationPayload
  );

  logger.info('Notification sent', {
    success,
    type: notification.type,
    channel: notification.channel,
    tripId: notification.tripId,
  });

  return success;
}

function getTitleForNotificationType(type: string): string {
  const titles: Record<string, string> = {
    weather_check: '🌤️ Weather Update',
    headcount: '👥 Headcount Confirmation',
    dress_code: '👔 Dress Code Reminder',
    leave_now: '🚗 Time to Leave!',
  };
  return titles[type] || 'PartyPilot Update';
}

export function startNotificationScheduler() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    logger.debug('Running notification scheduler');
    await sendPendingNotifications();
  });

  logger.info('Notification scheduler started');
}
