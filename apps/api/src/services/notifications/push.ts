/**
 * Push Notification Service - Firebase Cloud Messaging (FCM)
 * 
 * Setup Instructions:
 * 1. Create Firebase project: https://console.firebase.google.com/
 * 2. Download service account key (JSON)
 * 3. Set FIREBASE_SERVICE_ACCOUNT_KEY env var (JSON string)
 * 4. Install: npm install firebase-admin
 */

import { logger } from '../../config/logger';
import { NotificationPayload } from './index';

// Lazy load firebase-admin to avoid errors if not installed
let admin: any = null;

function getFirebaseAdmin() {
  if (!admin) {
    try {
      admin = require('firebase-admin');
      
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      
      if (serviceAccountKey && !admin.apps.length) {
        const serviceAccount = JSON.parse(serviceAccountKey);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        logger.info('Firebase Admin initialized');
      }
    } catch (error) {
      logger.warn('Firebase Admin not available:', error);
      admin = null;
    }
  }
  return admin;
}

export async function sendPushNotification(
  deviceToken: string,
  payload: NotificationPayload
): Promise<boolean> {
  const firebase = getFirebaseAdmin();
  
  if (!firebase || !process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    logger.warn('Firebase not configured, skipping push notification');
    // For development: log the notification that would be sent
    logger.info('MOCK PUSH NOTIFICATION:', {
      token: deviceToken,
      notification: {
        title: payload.title || 'PartyPilot',
        body: payload.message,
      },
      data: payload.data,
    });
    return true; // Return true to not block the flow
  }

  try {
    const message = {
      token: deviceToken,
      notification: {
        title: payload.title || 'PartyPilot',
        body: payload.message,
      },
      data: {
        type: payload.type,
        tripId: payload.tripId,
        ...payload.data,
      },
      android: {
        priority: 'high' as const,
      },
      apns: {
        headers: {
          'apns-priority': '10',
        },
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await firebase.messaging().send(message);
    logger.info('Push notification sent successfully', {
      messageId: response,
      type: payload.type,
    });
    return true;
  } catch (error) {
    logger.error('Failed to send push notification', { error, payload });
    return false;
  }
}
