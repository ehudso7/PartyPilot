import { Request, Response } from 'express';
import * as tripsService from './service';
import { logger } from '../../config/logger';

export async function planTrip(req: Request, res: Response) {
  try {
    const { prompt, userId } = req.body;
    
    if (!prompt || !userId) {
      return res.status(400).json({ error: 'prompt and userId are required' });
    }

    const result = await tripsService.planTrip(prompt, userId);
    return res.status(201).json(result);
  } catch (error) {
    logger.error('Error planning trip:', error);
    return res.status(500).json({ error: 'Failed to plan trip' });
  }
}

export async function getTrip(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const trip = await tripsService.getTripById(tripId);
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    return res.json(trip);
  } catch (error) {
    logger.error('Error fetching trip:', error);
    return res.status(500).json({ error: 'Failed to fetch trip' });
  }
}

export async function updateTrip(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const updates = req.body;
    
    const trip = await tripsService.updateTrip(tripId, updates);
    return res.json(trip);
  } catch (error) {
    logger.error('Error updating trip:', error);
    return res.status(500).json({ error: 'Failed to update trip' });
  }
}

export async function getTripEvents(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const events = await tripsService.getTripEvents(tripId);
    return res.json({ events });
  } catch (error) {
    logger.error('Error fetching trip events:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}

export async function exportIcs(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const icsContent = await tripsService.generateIcs(tripId);
    
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename="trip-${tripId}.ics"`);
    return res.send(icsContent);
  } catch (error) {
    logger.error('Error generating ICS:', error);
    return res.status(500).json({ error: 'Failed to generate ICS' });
  }
}

export async function exportPdf(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    // PDF generation to be implemented
    return res.status(501).json({ error: 'PDF export not yet implemented' });
  } catch (error) {
    logger.error('Error generating PDF:', error);
    return res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

export async function getShareLink(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const shareLink = await tripsService.getOrCreateShareLink(tripId);
    return res.json({ url: shareLink });
  } catch (error) {
    logger.error('Error creating share link:', error);
    return res.status(500).json({ error: 'Failed to create share link' });
  }
}

export async function bootstrapNotifications(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const notifications = await tripsService.bootstrapNotifications(tripId);
    return res.json({ notifications });
  } catch (error) {
    logger.error('Error bootstrapping notifications:', error);
    return res.status(500).json({ error: 'Failed to create notifications' });
  }
}
