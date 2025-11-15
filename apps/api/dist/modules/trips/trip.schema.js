"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTripsQuerySchema = exports.updateTripSchema = exports.createTripSchema = exports.tripIdParamSchema = exports.budgetLevelEnum = exports.tripStatusEnum = void 0;
const zod_1 = require("zod");
exports.tripStatusEnum = zod_1.z.enum(['draft', 'planned', 'confirmed', 'completed']);
exports.budgetLevelEnum = zod_1.z.enum(['low', 'medium', 'high']);
exports.tripIdParamSchema = zod_1.z.object({
    tripId: zod_1.z.string().cuid()
});
const baseTripShape = {
    userId: zod_1.z.string().cuid(),
    title: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    dateStart: zod_1.z.coerce.date(),
    dateEnd: zod_1.z.coerce.date(),
    groupSizeMin: zod_1.z.coerce.number().int().min(1),
    groupSizeMax: zod_1.z.coerce.number().int().min(1),
    occasion: zod_1.z.string().min(1),
    budgetLevel: exports.budgetLevelEnum,
    status: exports.tripStatusEnum.default('draft')
};
const validateRanges = (data, ctx) => {
    if (data.groupSizeMin !== undefined &&
        data.groupSizeMax !== undefined &&
        data.groupSizeMin > data.groupSizeMax) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'groupSizeMin must be less than or equal to groupSizeMax',
            path: ['groupSizeMin']
        });
    }
    if (data.dateStart && data.dateEnd && data.dateEnd < data.dateStart) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'dateEnd must be after dateStart',
            path: ['dateEnd']
        });
    }
};
exports.createTripSchema = zod_1.z
    .object(baseTripShape)
    .superRefine((data, ctx) => validateRanges(data, ctx));
exports.updateTripSchema = zod_1.z
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
    .superRefine((data, ctx) => validateRanges(data, ctx));
exports.listTripsQuerySchema = zod_1.z.object({
    userId: zod_1.z.string().cuid().optional()
});
