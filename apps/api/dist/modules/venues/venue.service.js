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
const httpError_1 = require("../../utils/httpError");
const venueRepository = __importStar(require("./venue.repository"));
const toCreatePayload = (data) => ({
    name: data.name,
    address: data.address,
    city: data.city,
    lat: data.lat,
    lng: data.lng,
    bookingType: data.bookingType,
    bookingProvider: data.bookingProvider,
    bookingUrl: data.bookingUrl,
    phone: data.phone,
    website: data.website,
    rating: data.rating,
    priceLevel: data.priceLevel,
    dressCodeSummary: data.dressCodeSummary,
    groupFriendly: data.groupFriendly ?? true
});
const toUpdatePayload = (data) => ({
    name: data.name,
    address: data.address,
    city: data.city,
    lat: data.lat,
    lng: data.lng,
    bookingType: data.bookingType,
    bookingProvider: data.bookingProvider,
    bookingUrl: data.bookingUrl,
    phone: data.phone,
    website: data.website,
    rating: data.rating,
    priceLevel: data.priceLevel,
    dressCodeSummary: data.dressCodeSummary,
    groupFriendly: data.groupFriendly
});
const listVenues = (query) => venueRepository.findAll(query);
exports.listVenues = listVenues;
const createVenue = (data) => venueRepository.create(toCreatePayload(data));
exports.createVenue = createVenue;
const getVenueById = async (venueId) => {
    const venue = await venueRepository.findById(venueId);
    if (!venue) {
        throw new httpError_1.HttpError(404, 'Venue not found');
    }
    return venue;
};
exports.getVenueById = getVenueById;
const updateVenue = async (venueId, data) => {
    await (0, exports.getVenueById)(venueId);
    return venueRepository.update(venueId, toUpdatePayload(data));
};
exports.updateVenue = updateVenue;
const deleteVenue = async (venueId) => {
    await (0, exports.getVenueById)(venueId);
    await venueRepository.remove(venueId);
};
exports.deleteVenue = deleteVenue;
