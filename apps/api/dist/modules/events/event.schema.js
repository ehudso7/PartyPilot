"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEventsQuerySchema = exports.updateEventSchema = exports.createEventSchema = exports.eventIdParamSchema = exports.eventTypeEnum = void 0;
const zod_1 = require("zod");
exports.eventTypeEnum = zod_1.z.enum(['meetup', 'meal', 'bar', 'club', 'transit', 'other']);
exports.eventIdParamSchema = zod_1.z.object({
    eventId: zod_1.z.string().cuid()
});
const baseEventShape = {
    tripId: zod_1.z.string().cuid(),
    venueId: zod_1.z.string().cuid().nullable().optional(),
    orderIndex: zod_1.z.coerce.number().int().min(0),
    type: exports.eventTypeEnum,
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1).optional(),
    startTime: zod_1.z.coerce.date(),
    endTime: zod_1.z.coerce.date(),
    isPrimary: zod_1.z.boolean().optional().default(true)
};
const validateEventWindow = (data, ctx) => {
    if (data.startTime && data.endTime && data.endTime <= data.startTime) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'endTime must be after startTime',
            path: ['endTime']
        });
    }
};
exports.createEventSchema = zod_1.z
    .object(baseEventShape)
    .superRefine((data, ctx) => validateEventWindow(data, ctx));
exports.updateEventSchema = zod_1.z
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
    .superRefine((data, ctx) => validateEventWindow(data, ctx));
exports.listEventsQuerySchema = zod_1.z.object({
    tripId: zod_1.z.string().cuid().optional()
});
