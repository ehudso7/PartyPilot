import { z } from 'zod';

const baseEventFields = {
  tripId: z.string().cuid(),
  venueId: z.string().cuid().optional(),
  orderIndex: z.number().int().nonnegative(),
  type: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  isPrimary: z.boolean().default(true)
};

export const createEventSchema = z.object({
  body: z.object(baseEventFields)
});

export const updateEventSchema = z.object({
  params: z.object({
    eventId: z.string().cuid()
  }),
  body: z.object({
    venueId: baseEventFields.venueId,
    orderIndex: baseEventFields.orderIndex.optional(),
    type: baseEventFields.type.optional(),
    title: baseEventFields.title.optional(),
    description: baseEventFields.description.optional(),
    startTime: baseEventFields.startTime.optional(),
    endTime: baseEventFields.endTime.optional(),
    isPrimary: baseEventFields.isPrimary.optional()
  }).partial()
});

export const eventIdParamSchema = z.object({
  params: z.object({
    eventId: z.string().cuid()
  })
});

export type CreateEventInput = z.infer<typeof createEventSchema>['body'];
export type UpdateEventInput = z.infer<typeof updateEventSchema>['body'];
