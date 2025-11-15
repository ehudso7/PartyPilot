"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrip = exports.updateTrip = exports.getTripDetails = exports.createTrip = exports.listTrips = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const trip_schema_1 = require("./trip.schema");
const tripService = __importStar(require("./trip.service"));
exports.listTrips = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const query = trip_schema_1.listTripsQuerySchema.parse(req.query);
    const trips = await tripService.listTrips(query);
    res.json({ trips });
});
exports.createTrip = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const payload = trip_schema_1.createTripSchema.parse(req.body);
    const trip = await tripService.createTrip(payload);
    res.status(201).json({ trip });
});
exports.getTripDetails = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { tripId } = trip_schema_1.tripIdParamSchema.parse(req.params);
    const trip = await tripService.getTripDetails(tripId);
    const { events, reservations, notifications, ...tripBase } = trip;
    const venues = events
        .map((event) => event.venue)
        .filter((venue) => Boolean(venue));
    const uniqueVenues = Array.from(new Map(venues.map((venue) => [venue.id, venue])).values());
    res.json({
        trip: tripBase,
        events,
        venues: uniqueVenues,
        reservations,
        notifications
    });
});
exports.updateTrip = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { tripId } = trip_schema_1.tripIdParamSchema.parse(req.params);
    const payload = trip_schema_1.updateTripSchema.parse(req.body);
    const trip = await tripService.updateTrip(tripId, payload);
    res.json({ trip });
});
exports.deleteTrip = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { tripId } = trip_schema_1.tripIdParamSchema.parse(req.params);
    await tripService.deleteTrip(tripId);
    res.status(204).send();
});
