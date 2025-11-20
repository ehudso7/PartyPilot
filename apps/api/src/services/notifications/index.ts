/**
 * Notification Service - Multi-channel notification dispatcher
 * Supports: Push notifications (FCM), SMS (Twilio), Email (SendGrid)
 */

import { logger } from '../../config/logger';
import { sendPushNotification } from './push';
import { sendSMS } from './sms';
import { sendEmail } from './email';

export interface NotificationPayload {
  type: string;
  tripId: string;
  message: string;
  title?: string;
  data?: Record<string, any>;
}

export async function sendNotification(
  channel: string,
  recipient: string,
  payload: NotificationPayload
): Promise<boolean> {
  try {
    switch (channel) {
      case 'push':
        return await sendPushNotification(recipient, payload);
      
      case 'sms':
        return await sendSMS(recipient, payload);
      
      case 'email':
        return await sendEmail(recipient, payload);
      
      default:
        logger.warn(`Unknown notification channel: ${channel}`);
        return false;
    }
  } catch (error) {
    logger.error('Notification sending failed', {
      channel,
      recipient,
      type: payload.type,
      error,
    });
    return false;
  }
}

export { sendPushNotification, sendSMS, sendEmail };
