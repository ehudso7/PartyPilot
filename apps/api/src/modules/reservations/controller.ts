import { Request, Response } from 'express';
import * as reservationsService from './service';
import { logger } from '../../config/logger';

export async function prepareReservations(req: Request, res: Response) {
  try {
    const { tripId, eventIds } = req.body;
    
    if (!tripId || !eventIds || !Array.isArray(eventIds)) {
      return res.status(400).json({ error: 'tripId and eventIds array are required' });
    }

    const reservations = await reservationsService.prepareReservations(tripId, eventIds);
    return res.json({ reservations });
  } catch (error) {
    logger.error('Error preparing reservations:', error);
    return res.status(500).json({ error: 'Failed to prepare reservations' });
  }
}

export async function bookReservation(req: Request, res: Response) {
  try {
    const { reservationId } = req.body;
    
    if (!reservationId) {
      return res.status(400).json({ error: 'reservationId is required' });
    }

    const reservation = await reservationsService.bookReservation(reservationId);
    return res.json({ reservation });
  } catch (error) {
    logger.error('Error booking reservation:', error);
    return res.status(500).json({ error: 'Failed to book reservation' });
  }
}

export async function getReservation(req: Request, res: Response) {
  try {
    const { reservationId } = req.params;
    
    const reservation = await reservationsService.getReservationById(reservationId);
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    return res.json(reservation);
  } catch (error) {
    logger.error('Error fetching reservation:', error);
    return res.status(500).json({ error: 'Failed to fetch reservation' });
  }
}
