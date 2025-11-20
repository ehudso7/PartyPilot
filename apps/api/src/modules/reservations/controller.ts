import { Response } from 'express';
import * as reservationsService from './service';
import { logger } from '../../config/logger';
import { AuthRequest } from '../../middleware/auth';

export async function prepareReservations(req: AuthRequest, res: Response) {
  try {
    const { tripId, eventIds } = req.body;
    
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!tripId || !eventIds || !Array.isArray(eventIds)) {
      return res.status(400).json({ error: 'tripId and eventIds array are required' });
    }

    const { reservations, skippedEventIds } = await reservationsService.prepareReservations(req.userId, tripId, eventIds);
    return res.json({ reservations, skippedEventIds });
  } catch (error) {
    logger.error('Error preparing reservations:', error);
    return res.status(500).json({ error: 'Failed to prepare reservations' });
  }
}

export async function bookReservation(req: AuthRequest, res: Response) {
  try {
    const { reservationId } = req.body;
    
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!reservationId) {
      return res.status(400).json({ error: 'reservationId is required' });
    }

    const reservation = await reservationsService.bookReservation(req.userId, reservationId);
    return res.json({ reservation });
  } catch (error) {
    logger.error('Error booking reservation:', error);
    return res.status(500).json({ error: 'Failed to book reservation' });
  }
}

export async function getReservation(req: AuthRequest, res: Response) {
  try {
    const { reservationId } = req.params;
    
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const reservation = await reservationsService.getReservationById(req.userId, reservationId);
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    return res.json(reservation);
  } catch (error) {
    logger.error('Error fetching reservation:', error);
    return res.status(500).json({ error: 'Failed to fetch reservation' });
  }
}
