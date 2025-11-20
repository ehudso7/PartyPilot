/**
 * SMS Notification Service - Twilio
 * 
 * Setup Instructions:
 * 1. Sign up: https://www.twilio.com/
 * 2. Get Account SID, Auth Token, and Phone Number
 * 3. Set environment variables:
 *    - TWILIO_ACCOUNT_SID
 *    - TWILIO_AUTH_TOKEN
 *    - TWILIO_PHONE_NUMBER
 * 4. Install: npm install twilio
 */

import { logger } from '../../config/logger';
import { NotificationPayload } from './index';

// Lazy load twilio to avoid errors if not installed
let twilioClient: any = null;

function getTwilioClient() {
  if (!twilioClient) {
    try {
      const twilio = require('twilio');
      
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      
      if (accountSid && authToken) {
        twilioClient = twilio(accountSid, authToken);
        logger.info('Twilio client initialized');
      }
    } catch (error) {
      logger.warn('Twilio not available:', error);
      twilioClient = null;
    }
  }
  return twilioClient;
}

export async function sendSMS(
  phoneNumber: string,
  payload: NotificationPayload
): Promise<boolean> {
  const client = getTwilioClient();
  
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    logger.warn('Twilio not configured, skipping SMS');
    // For development: log the SMS that would be sent
    logger.info('MOCK SMS:', {
      to: phoneNumber,
      body: payload.message,
    });
    return true; // Return true to not block the flow
  }

  try {
    const message = await client.messages.create({
      body: payload.message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    logger.info('SMS sent successfully', {
      messageSid: message.sid,
      to: phoneNumber,
      type: payload.type,
    });
    return true;
  } catch (error) {
    logger.error('Failed to send SMS', { error, phoneNumber, payload });
    return false;
  }
}
