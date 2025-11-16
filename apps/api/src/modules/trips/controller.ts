import { Response } from 'express';
import * as tripsService from './service';
import { logger } from '../../config/logger';
import { AuthRequest } from '../../middleware/auth';

export async function planTrip(req: AuthRequest, res: Response) {
  try {
    const { prompt } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await tripsService.planTrip(prompt, req.userId);
    return res.status(201).json(result);
  } catch (error) {
    logger.error('Error planning trip:', error);
    return res.status(500).json({ error: 'Failed to plan trip' });
  }
}

export async function getTrip(req: AuthRequest, res: Response) {
  try {
    const { tripId } = req.params;

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const trip = await tripsService.getTripById(tripId);

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Authorization: only trip owner can access
    if (trip.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.json(trip);
  } catch (error) {
    logger.error('Error fetching trip:', error);
    return res.status(500).json({ error: 'Failed to fetch trip' });
  }
}

export async function updateTrip(req: AuthRequest, res: Response) {
  try {
    const { tripId } = req.params;
    const updates = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify ownership
    const existing = await tripsService.getTripById(tripId);
    if (!existing) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    if (existing.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const trip = await tripsService.updateTrip(tripId, updates);
    return res.json(trip);
  } catch (error) {
    logger.error('Error updating trip:', error);
    return res.status(500).json({ error: 'Failed to update trip' });
  }
}

export async function getTripEvents(req: AuthRequest, res: Response) {
  try {
    const { tripId } = req.params;

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify ownership
    const trip = await tripsService.getTripById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    if (trip.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const events = await tripsService.getTripEvents(tripId);
    return res.json({ events });
  } catch (error) {
    logger.error('Error fetching trip events:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}

export async function exportIcs(req: AuthRequest, res: Response) {
  try {
    const { tripId } = req.params;

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify ownership
    const trip = await tripsService.getTripById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    if (trip.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const icsContent = await tripsService.generateIcs(tripId);

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="trip-${tripId}.ics"`);
    return res.send(icsContent);
  } catch (error) {
    logger.error('Error generating ICS:', error);
    return res.status(500).json({ error: 'Failed to generate ICS' });
  }
}

export async function exportPdf(req: AuthRequest, res: Response) {
  try {
    const { tripId } = req.params;

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify ownership
    const trip = await tripsService.getTripById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    if (trip.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const pdfBuffer = await tripsService.generatePdf(tripId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="trip-${tripId}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    logger.error('Error generating PDF:', error);
    return res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

export async function getShareLink(req: AuthRequest, res: Response) {
  try {
    const { tripId } = req.params;

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify ownership
    const trip = await tripsService.getTripById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    if (trip.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const shareLink = await tripsService.getOrCreateShareLink(tripId);
    return res.json({ url: shareLink });
  } catch (error) {
    logger.error('Error creating share link:', error);
    return res.status(500).json({ error: 'Failed to create share link' });
  }
}

export async function bootstrapNotifications(req: AuthRequest, res: Response) {
  try {
    const { tripId } = req.params;

    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify ownership
    const trip = await tripsService.getTripById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    if (trip.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const notifications = await tripsService.bootstrapNotifications(tripId);
    return res.json({ notifications });
  } catch (error) {
    logger.error('Error bootstrapping notifications:', error);
    return res.status(500).json({ error: 'Failed to create notifications' });
  }
}
