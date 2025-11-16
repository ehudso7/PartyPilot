import prisma from '../../db/prismaClient';
import { logger } from '../../config/logger';

// GDPR: Export all user data
export async function exportUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      trips: {
        include: {
          events: {
            include: { venue: true },
          },
          reservations: true,
          notifications: true,
          shareLinks: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Remove password from export
  const { password, ...userData } = user;

  logger.info('User data exported', { userId });

  return userData;
}

// GDPR: Delete user account and anonymize data
export async function deleteUserAccount(userId: string) {
  // Soft delete: mark as deleted and anonymize PII
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
      email: `deleted_${userId}@deleted.partypilot.app`,
      name: 'Deleted User',
      phone: null,
      password: '', // Clear password hash
    },
  });

  // Note: Trips and related data are preserved for referential integrity
  // but the user's PII is anonymized. Trips can be fully deleted if needed.

  logger.info('User account deleted', { userId });

  return { message: 'Account deleted successfully' };
}

// Permanently delete user and all related data
export async function permanentlyDeleteUser(userId: string) {
  // This will cascade delete trips, events, reservations, notifications, and share links
  await prisma.user.delete({
    where: { id: userId },
  });

  logger.warn('User permanently deleted', { userId });

  return { message: 'Account and all data permanently deleted' };
}
