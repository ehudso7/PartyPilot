import { z } from 'zod';

export const eventTypeEnum = z.enum(['meetup', 'meal', 'bar', 'club', 'transit', 'other']);

export const eventIdParamSchema = z.object({
  eventId: z.string().cuid()
});

const baseEventShape = {
  tripId: z.string().cuid(),
  venueId: z.string().cuid().nullable().optional(),
  orderIndex: z.coerce.number().int().min(0),
  type: eventTypeEnum,
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  isPrimary: z.boolean().optional().default(true)
};

type EventWindowFields = { startTime?: Date; endTime?: Date };

const validateEventWindow = (data: EventWindowFields, ctx: z.RefinementCtx) => {
  if (data.startTime && data.endTime && data.endTime <= data.startTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'endTime must be after startTime',
      path: ['endTime']
    });
  }
};

export const createEventSchema = z
  .object(baseEventShape)
  .superRefine((data, ctx) => validateEventWindow(data, ctx));

export const updateEventSchema = z
  .object({
    tripId: baseEventShape.tripId.optional(),
    venueId: baseEventShape.venueId,
    orderIndex: baseEventShape.orderIndex.optional(),
    type: baseEventShape.type.optional(),
    title: baseEventShape.title.optional(),
    description: baseEventShape.description,
    startTime: baseEventShape.startTime.optional(),
    endTime: baseEventShape.endTime.optional(),
    isPrimary: baseEventShape.isPrimary.optional()
  })
  .superRefine((data, ctx) => validateEventWindow(data as EventWindowFields, ctx));

export const listEventsQuerySchema = z.object({
  tripId: z.string().cuid().optional()
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventQuery = z.infer<typeof listEventsQuerySchema>;
