import { Response } from 'express';
import * as reservationsService from './service';
import * as tripsService from '../trips/service';
import { logger } from '../../config/logger';
import { AuthRequest } from '../../middleware/auth';

export async function prepareReservations(req: AuthRequest, res: Response) {
  try {
    const { tripId, eventIds } = req.body;
    
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify trip ownership
    const trip = await tripsService.getTripById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    if (trip.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const reservations = await reservationsService.prepareReservations(tripId, eventIds);
    return res.json({ reservations });
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

    // Verify reservation ownership via trip
    const reservation = await reservationsService.getReservationById(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const trip = await tripsService.getTripById(reservation.tripId);
    if (!trip || trip.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await reservationsService.bookReservation(reservationId);
    return res.json({ reservation: updated });
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
    
    const reservation = await reservationsService.getReservationById(reservationId);
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Verify ownership
    const trip = await tripsService.getTripById(reservation.tripId);
    if (!trip || trip.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    return res.json(reservation);
  } catch (error) {
    logger.error('Error fetching reservation:', error);
    return res.status(500).json({ error: 'Failed to fetch reservation' });
  }
}
