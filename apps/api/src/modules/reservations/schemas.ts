import { z } from 'zod';

export const PrepareReservationsSchema = z.object({
  tripId: z.string().cuid(),
  eventIds: z.array(z.string().cuid()).min(1).max(20),
});

export const BookReservationSchema = z.object({
  reservationId: z.string().cuid(),
});

export const ReservationIdSchema = z.object({
  reservationId: z.string().cuid(),
});
