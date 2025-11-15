"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listVenuesQuerySchema = exports.updateVenueSchema = exports.createVenueSchema = exports.venueIdParamSchema = exports.bookingTypeEnum = void 0;
const zod_1 = require("zod");
exports.bookingTypeEnum = zod_1.z.enum(['none', 'api', 'deeplink', 'webview_form', 'manual']);
const priceLevels = ['$', '$$', '$$$', '$$$$'];
exports.venueIdParamSchema = zod_1.z.object({
    venueId: zod_1.z.string().cuid()
});
const baseVenueShape = {
    name: zod_1.z.string().min(1),
    address: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    lat: zod_1.z.coerce.number().optional(),
    lng: zod_1.z.coerce.number().optional(),
    bookingType: exports.bookingTypeEnum.default('none'),
    bookingProvider: zod_1.z.string().min(1).optional(),
    bookingUrl: zod_1.z.string().url().optional(),
    phone: zod_1.z.string().min(7).max(20).optional(),
    website: zod_1.z.string().url().optional(),
    rating: zod_1.z.coerce.number().min(0).max(5).optional(),
    priceLevel: zod_1.z.enum(priceLevels).optional(),
    dressCodeSummary: zod_1.z.string().min(1).optional(),
    groupFriendly: zod_1.z.boolean().optional().default(true)
};
exports.createVenueSchema = zod_1.z.object(baseVenueShape);
exports.updateVenueSchema = zod_1.z.object({
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
exports.listVenuesQuerySchema = zod_1.z.object({
    city: zod_1.z.string().min(1).optional()
});
