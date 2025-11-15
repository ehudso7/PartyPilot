import { z } from 'zod';

const bookingTypeEnum = z.enum(['none', 'api', 'deeplink', 'webview_form', 'manual']);
const priceLevelEnum = z.enum(['$', '$$', '$$$', '$$$$']).optional();

const baseVenueFields = {
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
  bookingType: bookingTypeEnum.default('none'),
  bookingProvider: z.string().optional().nullable(),
  bookingUrl: z.string().url().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  priceLevel: priceLevelEnum,
  dressCodeSummary: z.string().optional().nullable(),
  groupFriendly: z.boolean().default(true)
};

export const createVenueSchema = z.object({
  body: z.object(baseVenueFields)
});

export const updateVenueSchema = z.object({
  params: z.object({ venueId: z.string().cuid() }),
  body: z.object(baseVenueFields).partial()
});

export const venueIdParamSchema = z.object({
  params: z.object({ venueId: z.string().cuid() })
});

export type CreateVenueInput = z.infer<typeof createVenueSchema>['body'];
export type UpdateVenueInput = z.infer<typeof updateVenueSchema>['body'];
