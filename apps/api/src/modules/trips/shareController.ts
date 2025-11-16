import { Request, Response } from 'express';
import prisma from '../../db/prismaClient';
import { logger } from '../../config/logger';

export async function getPublicItinerary(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    
    const shareLink = await prisma.shareLink.findUnique({
      where: { slug },
      include: {
        trip: {
          include: {
            events: {
              include: { venue: true },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });
    
    if (!shareLink) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    
    // Check expiration
    if (shareLink.expiresAt && new Date(shareLink.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'This link has expired' });
    }
    
    // Return safe subset of trip data
    const { trip } = shareLink;
    return res.json({
      trip: {
        id: trip.id,
        title: trip.title,
        city: trip.city,
        dateStart: trip.dateStart,
        dateEnd: trip.dateEnd,
        occasion: trip.occasion,
      },
      events: trip.events,
    });
  } catch (error) {
    logger.error('Error fetching public itinerary:', error);
    return res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
}
