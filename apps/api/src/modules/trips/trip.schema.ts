import { z } from 'zod';

export const tripStatusEnum = z.enum(['draft', 'planned', 'confirmed', 'completed']);
export const budgetLevelEnum = z.enum(['low', 'medium', 'high']);

export const tripIdParamSchema = z.object({
  tripId: z.string().cuid()
});

const baseTripShape = {
  userId: z.string().cuid(),
  title: z.string().min(1),
  city: z.string().min(1),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date(),
  groupSizeMin: z.coerce.number().int().min(1),
  groupSizeMax: z.coerce.number().int().min(1),
  occasion: z.string().min(1),
  budgetLevel: budgetLevelEnum,
  status: tripStatusEnum.default('draft')
};

type TripRangeFields = {
  groupSizeMin?: number;
  groupSizeMax?: number;
  dateStart?: Date;
  dateEnd?: Date;
};

const validateRanges = (data: TripRangeFields, ctx: z.RefinementCtx) => {
  if (
    data.groupSizeMin !== undefined &&
    data.groupSizeMax !== undefined &&
    data.groupSizeMin > data.groupSizeMax
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'groupSizeMin must be less than or equal to groupSizeMax',
      path: ['groupSizeMin']
    });
  }

  if (data.dateStart && data.dateEnd && data.dateEnd < data.dateStart) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'dateEnd must be after dateStart',
      path: ['dateEnd']
    });
  }
};

export const createTripSchema = z
  .object(baseTripShape)
  .superRefine((data, ctx) => validateRanges(data, ctx));

export const updateTripSchema = z
  .object({
    userId: baseTripShape.userId.optional(),
    title: baseTripShape.title.optional(),
    city: baseTripShape.city.optional(),
    dateStart: baseTripShape.dateStart.optional(),
    dateEnd: baseTripShape.dateEnd.optional(),
    groupSizeMin: baseTripShape.groupSizeMin.optional(),
    groupSizeMax: baseTripShape.groupSizeMax.optional(),
    occasion: baseTripShape.occasion.optional(),
    budgetLevel: baseTripShape.budgetLevel.optional(),
    status: baseTripShape.status.optional()
  })
  .superRefine((data, ctx) => validateRanges(data as TripRangeFields, ctx));

export const listTripsQuerySchema = z.object({
  userId: z.string().cuid().optional()
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type TripQuery = z.infer<typeof listTripsQuerySchema>;
