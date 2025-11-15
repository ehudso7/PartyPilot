import { z } from 'zod';

export const bookingTypeEnum = z.enum(['none', 'api', 'deeplink', 'webview_form', 'manual']);

const priceLevels = ['$', '$$', '$$$', '$$$$'] as const;

export const venueIdParamSchema = z.object({
  venueId: z.string().cuid()
});

const baseVenueShape = {
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  bookingType: bookingTypeEnum.default('none'),
  bookingProvider: z.string().min(1).optional(),
  bookingUrl: z.string().url().optional(),
  phone: z.string().min(7).max(20).optional(),
  website: z.string().url().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  priceLevel: z.enum(priceLevels).optional(),
  dressCodeSummary: z.string().min(1).optional(),
  groupFriendly: z.boolean().optional().default(true)
};

export const createVenueSchema = z.object(baseVenueShape);

export const updateVenueSchema = z.object({
  name: baseVenueShape.name.optional(),
  address: baseVenueShape.address.optional(),
  city: baseVenueShape.city.optional(),
  lat: baseVenueShape.lat,
  lng: baseVenueShape.lng,
  bookingType: baseVenueShape.bookingType.optional(),
  bookingProvider: baseVenueShape.bookingProvider,
  bookingUrl: baseVenueShape.bookingUrl,
  phone: baseVenueShape.phone,
  website: baseVenueShape.website,
  rating: baseVenueShape.rating,
  priceLevel: baseVenueShape.priceLevel,
  dressCodeSummary: baseVenueShape.dressCodeSummary,
  groupFriendly: baseVenueShape.groupFriendly
});

export const listVenuesQuerySchema = z.object({
  city: z.string().min(1).optional()
});

export type CreateVenueInput = z.infer<typeof createVenueSchema>;
export type UpdateVenueInput = z.infer<typeof updateVenueSchema>;
export type VenueQuery = z.infer<typeof listVenuesQuerySchema>;
