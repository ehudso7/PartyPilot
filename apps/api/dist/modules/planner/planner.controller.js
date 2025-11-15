"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planTrip = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const planner_schema_1 = require("./planner.schema");
const planner_service_1 = require("./planner.service");
exports.planTrip = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const payload = planner_schema_1.planTripRequestSchema.parse(req.body);
    const result = await (0, planner_service_1.planTripFromPrompt)(payload);
    res.status(201).json(result);
});
