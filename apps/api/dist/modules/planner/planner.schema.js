"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planTripRequestSchema = void 0;
const zod_1 = require("zod");
exports.planTripRequestSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1),
    userId: zod_1.z.string().cuid()
});
