"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_routes_1 = __importDefault(require("../modules/events/event.routes"));
const planner_routes_1 = __importDefault(require("../modules/planner/planner.routes"));
const trip_routes_1 = __importDefault(require("../modules/trips/trip.routes"));
const user_routes_1 = __importDefault(require("../modules/users/user.routes"));
const venue_routes_1 = __importDefault(require("../modules/venues/venue.routes"));
const router = (0, express_1.Router)();
router.use('/api/users', user_routes_1.default);
router.use('/api/trips', planner_routes_1.default);
router.use('/api/trips', trip_routes_1.default);
router.use('/api/events', event_routes_1.default);
router.use('/api/venues', venue_routes_1.default);
exports.default = router;
