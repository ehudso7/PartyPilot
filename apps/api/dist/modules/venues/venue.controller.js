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
exports.deleteVenue = exports.updateVenue = exports.getVenueById = exports.createVenue = exports.listVenues = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const venue_schema_1 = require("./venue.schema");
const venueService = __importStar(require("./venue.service"));
exports.listVenues = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const query = venue_schema_1.listVenuesQuerySchema.parse(req.query);
    const venues = await venueService.listVenues(query);
    res.json({ venues });
});
exports.createVenue = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const payload = venue_schema_1.createVenueSchema.parse(req.body);
    const venue = await venueService.createVenue(payload);
    res.status(201).json({ venue });
});
exports.getVenueById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { venueId } = venue_schema_1.venueIdParamSchema.parse(req.params);
    const venue = await venueService.getVenueById(venueId);
    res.json({ venue });
});
exports.updateVenue = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { venueId } = venue_schema_1.venueIdParamSchema.parse(req.params);
    const payload = venue_schema_1.updateVenueSchema.parse(req.body);
    const venue = await venueService.updateVenue(venueId, payload);
    res.json({ venue });
});
exports.deleteVenue = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { venueId } = venue_schema_1.venueIdParamSchema.parse(req.params);
    await venueService.deleteVenue(venueId);
    res.status(204).send();
});
