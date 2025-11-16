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
  // Stub implementation - in production, integrate with:
  // - Firebase Cloud Messaging for push notifications
  // - Twilio for SMS
  // - SendGrid for email
  // - etc.

  const payload = notification.payload as any;

  logger.info('Sending notification', {
    type: notification.type,
    channel: notification.channel,
    tripId: notification.tripId,
    message: payload.message,
  });

  // Simulate notification sending
  return Promise.resolve();
}

export function startNotificationScheduler() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    logger.debug('Running notification scheduler');
    await sendPendingNotifications();
  });

  logger.info('Notification scheduler started');
}
