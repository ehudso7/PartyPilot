import { asyncHandler } from '../../utils/asyncHandler';
import { createEventSchema, eventIdParamSchema, listEventsQuerySchema, updateEventSchema } from './event.schema';
import * as eventService from './event.service';

export const listEvents = asyncHandler(async (req, res) => {
  const query = listEventsQuerySchema.parse(req.query);
  const events = await eventService.listEvents(query);
  res.json({ events });
});

export const createEvent = asyncHandler(async (req, res) => {
  const payload = createEventSchema.parse(req.body);
  const event = await eventService.createEvent(payload);
  res.status(201).json({ event });
});

export const getEventById = asyncHandler(async (req, res) => {
  const { eventId } = eventIdParamSchema.parse(req.params);
  const event = await eventService.getEventById(eventId);
  res.json({ event });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = eventIdParamSchema.parse(req.params);
  const payload = updateEventSchema.parse(req.body);
  const event = await eventService.updateEvent(eventId, payload);
  res.json({ event });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = eventIdParamSchema.parse(req.params);
  await eventService.deleteEvent(eventId);
  res.status(204).send();
});
