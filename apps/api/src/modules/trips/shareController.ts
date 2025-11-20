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
    
      const { trip } = shareLink;
      const safeEvents = (trip.events || [])
        .filter((event) => event.isPrimary)
        .map((event) => ({
          id: event.id,
          orderIndex: event.orderIndex,
          type: event.type,
          title: event.title,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          venue: event.venue
            ? {
                name: event.venue.name,
                address: event.venue.address,
                website: event.venue.website,
                phone: event.venue.phone,
                priceLevel: event.venue.priceLevel,
                dressCodeSummary: event.venue.dressCodeSummary,
              }
            : null,
        }));
      
      return res.json({
        trip: {
          id: trip.id,
          title: trip.title,
          city: trip.city,
          dateStart: trip.dateStart,
          dateEnd: trip.dateEnd,
          occasion: trip.occasion,
          groupSizeMin: trip.groupSizeMin,
          groupSizeMax: trip.groupSizeMax,
        },
        events: safeEvents,
      });
  } catch (error) {
    logger.error('Error fetching public itinerary:', error);
    return res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
}
