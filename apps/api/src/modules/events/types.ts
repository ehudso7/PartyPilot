import { Event, Venue } from '@prisma/client';

export type CreateEventDTO = {
  tripId: string;
  venueId?: string;
  orderIndex: number;
  type: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isPrimary?: boolean;
};

export type UpdateEventDTO = Partial<Omit<CreateEventDTO, 'tripId'>>;

export type EventWithVenue = Event & {
  venue?: Venue | null;
};
