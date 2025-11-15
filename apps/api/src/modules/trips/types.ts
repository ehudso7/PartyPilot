import { Trip, Event, Venue } from '@prisma/client';

export type CreateTripDTO = {
  userId: string;
  title: string;
  city: string;
  dateStart: Date;
  dateEnd: Date;
  groupSizeMin: number;
  groupSizeMax: number;
  occasion: string;
  budgetLevel: string;
  status?: string;
};

export type UpdateTripDTO = Partial<Omit<CreateTripDTO, 'userId'>>;

export type TripWithRelations = Trip & {
  events?: Event[];
  user?: any;
};

export type PlanTripRequest = {
  prompt: string;
  userId: string;
};

export type PlanTripResponse = {
  trip: Trip;
  events: Event[];
  venues: Venue[];
};
