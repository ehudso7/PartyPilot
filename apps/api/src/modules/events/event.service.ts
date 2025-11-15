import type { Prisma } from '@prisma/client';
import { HttpError } from '../../utils/httpError';
import * as eventRepository from './event.repository';
import type { CreateEventInput, EventQuery, UpdateEventInput } from './event.schema';

const toCreatePayload = (data: CreateEventInput): Prisma.EventUncheckedCreateInput => ({
  tripId: data.tripId,
  venueId: data.venueId ?? undefined,
  orderIndex: data.orderIndex,
  type: data.type,
  title: data.title,
  description: data.description,
  startTime: data.startTime,
  endTime: data.endTime,
  isPrimary: data.isPrimary ?? true
});

const toUpdatePayload = (data: UpdateEventInput): Prisma.EventUncheckedUpdateInput => ({
  tripId: data.tripId,
  venueId: data.venueId,
  orderIndex: data.orderIndex,
  type: data.type,
  title: data.title,
  description: data.description,
  startTime: data.startTime,
  endTime: data.endTime,
  isPrimary: data.isPrimary
});

export const listEvents = (query: EventQuery) => eventRepository.findAll(query);

export const createEvent = (data: CreateEventInput) => eventRepository.create(toCreatePayload(data));

export const getEventById = async (eventId: string) => {
  const event = await eventRepository.findById(eventId);
  if (!event) {
    throw new HttpError(404, 'Event not found');
  }
  return event;
};

export const updateEvent = async (eventId: string, data: UpdateEventInput) => {
  await getEventById(eventId);
  return eventRepository.update(eventId, toUpdatePayload(data));
};

export const deleteEvent = async (eventId: string) => {
  await getEventById(eventId);
  await eventRepository.remove(eventId);
};
