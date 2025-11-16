import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../apps/api/src/db/prismaClient';
import { logger } from '../../apps/api/src/config/logger';

// This function is called by Vercel Cron Jobs
// Configure in vercel.json under "crons"

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
        await sendNotification(notification);

        // Mark as sent
        await prisma.notification.update({
          where: { id: notification.id },
          data: { status: 'sent' },
        });

        logger.info('Notification sent', {
          notificationId: notification.id,
          type: notification.type,
        });
      } catch (error) {
        logger.error('Failed to send notification', {
          notificationId: notification.id,
          error,
        });
      }
    }

    return { processed: pending.length };
  } catch (error) {
    logger.error('Error processing notifications:', error);
    throw error;
  }
}

async function sendNotification(notification: any) {
  // Stub implementation - in production, integrate with:
  // - Firebase Cloud Messaging for push notifications
  // - Twilio for SMS
  // - SendGrid for email

  const payload = notification.payload as any;

  logger.info('Sending notification', {
    type: notification.type,
    channel: notification.channel,
    tripId: notification.tripId,
    message: payload.message,
  });

  return Promise.resolve();
}

export default async (req: VercelRequest, res: VercelResponse) => {
  // Verify this is a cron request (optional security check)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await sendPendingNotifications();
    return res.status(200).json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
