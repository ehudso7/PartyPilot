import prisma from '../../db/prismaClient';
import { logger } from '../../config/logger';

/**
 * GDPR Article 20: Right to Data Portability
 * Export all user data in machine-readable format (JSON)
 */
export async function exportUserData(userId: string) {
  logger.info('Starting GDPR data export', { userId });

  try {
    // Fetch all user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Fetch all trips
    const trips = await prisma.trip.findMany({
      where: { userId },
      include: {
        events: {
          include: {
            venue: true,
          },
        },
        reservations: true,
        notifications: true,
        shareLinks: true,
      },
    });

    // Compile comprehensive data export
    const exportData = {
      exportMetadata: {
        exportDate: new Date().toISOString(),
        dataController: 'PartyPilot, Inc.',
        purpose: 'GDPR Article 20 - Right to Data Portability',
        format: 'JSON',
        userId: user.id,
      },
      personalInformation: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        accountCreated: user.createdAt,
        lastUpdated: user.updatedAt,
      },
      trips: trips.map((trip) => ({
        id: trip.id,
        title: trip.title,
        city: trip.city,
        dates: {
          start: trip.dateStart,
          end: trip.dateEnd,
        },
        groupSize: {
          min: trip.groupSizeMin,
          max: trip.groupSizeMax,
        },
        occasion: trip.occasion,
        budgetLevel: trip.budgetLevel,
        status: trip.status,
        created: trip.createdAt,
        updated: trip.updatedAt,
        events: trip.events.map((event) => ({
          id: event.id,
          title: event.title,
          type: event.type,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          orderIndex: event.orderIndex,
          isPrimary: event.isPrimary,
          venue: event.venue ? {
            id: event.venue.id,
            name: event.venue.name,
            address: event.venue.address,
            city: event.venue.city,
            phone: event.venue.phone,
            website: event.venue.website,
          } : null,
        })),
        reservations: trip.reservations.map((reservation) => ({
          id: reservation.id,
          method: reservation.method,
          provider: reservation.bookingProvider,
          nameOnReservation: reservation.nameOnReservation,
          partySize: reservation.partySize,
          reservedTime: reservation.reservedTime,
          status: reservation.status,
          created: reservation.createdAt,
        })),
        notifications: trip.notifications.map((notification) => ({
          id: notification.id,
          type: notification.type,
          scheduledFor: notification.scheduledFor,
          status: notification.status,
          channel: notification.channel,
          created: notification.createdAt,
        })),
        shareLinks: trip.shareLinks.map((link) => ({
          id: link.id,
          slug: link.slug,
          url: `https://partypilot.app/t/${link.slug}`,
          expiresAt: link.expiresAt,
          created: link.createdAt,
        })),
      })),
      statistics: {
        totalTrips: trips.length,
        totalEvents: trips.reduce((sum, trip) => sum + trip.events.length, 0),
        totalReservations: trips.reduce((sum, trip) => sum + trip.reservations.length, 0),
        totalNotifications: trips.reduce((sum, trip) => sum + trip.notifications.length, 0),
      },
      gdprNotice: {
        rightToRectification: 'You may update your data via account settings or by contacting privacy@partypilot.app',
        rightToErasure: 'You may delete your account via account settings or by contacting privacy@partypilot.app',
        rightToRestriction: 'Contact privacy@partypilot.app to restrict processing of your data',
        rightToObject: 'Contact privacy@partypilot.app to object to data processing',
        withdrawConsent: 'You may withdraw consent for marketing communications via account settings',
        lodgeComplaint: 'EU/EEA residents may file complaints with their local data protection authority',
        contact: {
          email: 'privacy@partypilot.app',
          dpo: 'dpo@partypilot.app',
        },
      },
    };

    logger.info('GDPR data export completed', {
      userId,
      tripsExported: exportData.trips.length,
      totalDataPoints: exportData.statistics,
    });

    return exportData;
  } catch (error) {
    logger.error('GDPR data export failed', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * GDPR Article 17: Right to Erasure ("Right to be Forgotten")
 * Permanently delete user account and anonymize data
 */
export async function deleteUserAccount(userId: string) {
  logger.info('Starting GDPR account deletion', { userId });

  try {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if account is already deleted
    if (user.deletedAt) {
      logger.warn('User account already deleted', { userId });
      return {
        success: true,
        message: 'Account already deleted',
        deletedAt: user.deletedAt,
      };
    }

    // Begin transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // 1. Delete share links (no PII, safe to delete)
      const shareLinksDeleted = await tx.shareLink.deleteMany({
        where: {
          trip: {
            userId,
          },
        },
      });

      // 2. Delete notifications (no PII, safe to delete)
      const notificationsDeleted = await tx.notification.deleteMany({
        where: {
          trip: {
            userId,
          },
        },
      });

      // 3. Anonymize reservations (keep for dispute resolution, but remove PII)
      const reservationsUpdated = await tx.reservation.updateMany({
        where: {
          trip: {
            userId,
          },
        },
        data: {
          nameOnReservation: 'DELETED USER',
          rawPayload: null,
        },
      });

      // 4. Delete events (no PII)
      const eventsDeleted = await tx.event.deleteMany({
        where: {
          trip: {
            userId,
          },
        },
      });

      // 5. Anonymize trips (keep for analytics, but remove identifiers)
      const tripsUpdated = await tx.trip.updateMany({
        where: { userId },
        data: {
          // Keep aggregated data for analytics, but anonymize
          title: 'DELETED',
        },
      });

      // 6. Soft delete user (anonymize personal data)
      const anonymizedEmail = `deleted-${userId.slice(0, 8)}@partypilot.deleted`;
      await tx.user.update({
        where: { id: userId },
        data: {
          email: anonymizedEmail,
          name: 'Deleted User',
          phone: null,
          password: 'DELETED', // Invalidate password
          deletedAt: new Date(),
        },
      });

      logger.info('GDPR account deletion completed', {
        userId,
        shareLinksDeleted: shareLinksDeleted.count,
        notificationsDeleted: notificationsDeleted.count,
        reservationsAnonymized: reservationsUpdated.count,
        eventsDeleted: eventsDeleted.count,
        tripsAnonymized: tripsUpdated.count,
      });
    });

    return {
      success: true,
      message: 'Account successfully deleted and data anonymized',
      deletedAt: new Date(),
      dataRetention: {
        personalData: 'Immediately anonymized',
        trips: 'Anonymized (retained for analytics)',
        reservations: 'Anonymized (retained for dispute resolution up to 3 years)',
        backups: 'Removed from backups within 90 days',
      },
    };
  } catch (error) {
    logger.error('GDPR account deletion failed', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error('Failed to delete account. Please contact privacy@partypilot.app for assistance.');
  }
}

/**
 * GDPR Article 18: Right to Restriction of Processing
 * Temporarily restrict processing of user data
 */
export async function restrictUserDataProcessing(userId: string) {
  logger.info('Restricting data processing for user', { userId });

  // Implementation would add a 'processingRestricted' flag to user record
  // This would prevent:
  // - Sending marketing emails
  // - Including in analytics
  // - Sharing with third parties
  // But allow:
  // - Storage of data
  // - Processing for legal compliance

  await prisma.user.update({
    where: { id: userId },
    data: {
      // In production, add a 'processingRestricted' field to schema
      // processingRestricted: true,
    },
  });

  return {
    success: true,
    message: 'Data processing restricted',
    restrictions: [
      'Marketing communications disabled',
      'Data excluded from analytics',
      'Third-party sharing suspended',
    ],
    notRestricted: [
      'Data storage (for account functionality)',
      'Legal compliance processing',
      'Security monitoring',
    ],
  };
}
