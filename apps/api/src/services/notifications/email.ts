/**
 * Email Notification Service - SendGrid
 * 
 * Setup Instructions:
 * 1. Sign up: https://sendgrid.com/
 * 2. Create API Key
 * 3. Verify sender email
 * 4. Set environment variables:
 *    - SENDGRID_API_KEY
 *    - SENDGRID_FROM_EMAIL
 * 5. Install: npm install @sendgrid/mail
 */

import { logger } from '../../config/logger';
import { NotificationPayload } from './index';

// Lazy load SendGrid to avoid errors if not installed
let sgMail: any = null;

function getSendGridClient() {
  if (!sgMail) {
    try {
      sgMail = require('@sendgrid/mail');
      
      const apiKey = process.env.SENDGRID_API_KEY;
      
      if (apiKey) {
        sgMail.setApiKey(apiKey);
        logger.info('SendGrid client initialized');
      }
    } catch (error) {
      logger.warn('SendGrid not available:', error);
      sgMail = null;
    }
  }
  return sgMail;
}

export async function sendEmail(
  emailAddress: string,
  payload: NotificationPayload
): Promise<boolean> {
  const client = getSendGridClient();
  
  if (!client || !process.env.SENDGRID_FROM_EMAIL) {
    logger.warn('SendGrid not configured, skipping email');
    // For development: log the email that would be sent
    logger.info('MOCK EMAIL:', {
      to: emailAddress,
      subject: payload.title || 'PartyPilot Notification',
      text: payload.message,
    });
    return true; // Return true to not block the flow
  }

  try {
    const msg = {
      to: emailAddress,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: payload.title || 'PartyPilot Notification',
      text: payload.message,
      html: generateEmailHTML(payload),
    };

    await client.send(msg);
    
    logger.info('Email sent successfully', {
      to: emailAddress,
      type: payload.type,
    });
    return true;
  } catch (error) {
    logger.error('Failed to send email', { error, emailAddress, payload });
    return false;
  }
}

function generateEmailHTML(payload: NotificationPayload): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${payload.title || 'PartyPilot Notification'}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .message {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #6b7280;
          font-size: 14px;
        }
        a {
          color: #667eea;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 PartyPilot</h1>
        <p>${payload.title || 'You have a new notification'}</p>
      </div>
      <div class="content">
        <div class="message">
          <p>${payload.message}</p>
        </div>
        ${payload.data?.url ? `<p style="text-align: center;"><a href="${payload.data.url}" style="background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; display: inline-block;">View Details</a></p>` : ''}
      </div>
      <div class="footer">
        <p>PartyPilot - Your AI Event Planning Assistant</p>
        <p><a href="${process.env.APP_URL || 'https://partypilot.app'}">Visit Website</a> | <a href="${process.env.APP_URL || 'https://partypilot.app'}/settings">Manage Notifications</a></p>
      </div>
    </body>
    </html>
  `;
}
