import { z } from 'zod';

const baseTripFields = {
  title: z.string().min(1),
  city: z.string().min(1),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date(),
  groupSizeMin: z.number().int().positive(),
  groupSizeMax: z.number().int().positive(),
  occasion: z.string().min(1),
  budgetLevel: z.string().min(1),
  status: z.enum(['draft', 'planned', 'confirmed', 'completed']).default('draft')
};

export const createTripSchema = z.object({
  body: z.object({
    userId: z.string().cuid(),
    ...baseTripFields
  })
});

export const updateTripSchema = z.object({
  body: z.object({
    title: baseTripFields.title.optional(),
    city: baseTripFields.city.optional(),
    dateStart: baseTripFields.dateStart.optional(),
    dateEnd: baseTripFields.dateEnd.optional(),
    groupSizeMin: baseTripFields.groupSizeMin.optional(),
    groupSizeMax: baseTripFields.groupSizeMax.optional(),
    occasion: baseTripFields.occasion.optional(),
    budgetLevel: baseTripFields.budgetLevel.optional(),
    status: baseTripFields.status.optional()
  }),
  params: z.object({
    tripId: z.string().cuid()
  })
});

export const tripIdParamSchema = z.object({
  params: z.object({
    tripId: z.string().cuid()
  })
});

export type CreateTripInput = z.infer<typeof createTripSchema>['body'];
export type UpdateTripInput = z.infer<typeof updateTripSchema>['body'];
