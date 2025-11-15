"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = exports.userIdParamSchema = void 0;
const zod_1 = require("zod");
exports.userIdParamSchema = zod_1.z.object({
    userId: zod_1.z.string().cuid()
});
const phoneSchema = zod_1.z.union([zod_1.z.string().min(7).max(20), zod_1.z.null()]).optional();
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1),
    phone: phoneSchema
});
exports.updateUserSchema = exports.createUserSchema.partial();
