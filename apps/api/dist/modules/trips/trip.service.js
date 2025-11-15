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
exports.deleteTrip = exports.updateTrip = exports.getTripDetails = exports.ensureTripExists = exports.createTrip = exports.listTrips = void 0;
const httpError_1 = require("../../utils/httpError");
const tripRepository = __importStar(require("./trip.repository"));
const toCreatePayload = (data) => ({
    userId: data.userId,
    title: data.title,
    city: data.city,
    dateStart: data.dateStart,
    dateEnd: data.dateEnd,
    groupSizeMin: data.groupSizeMin,
    groupSizeMax: data.groupSizeMax,
    occasion: data.occasion,
    budgetLevel: data.budgetLevel,
    status: data.status
});
const toUpdatePayload = (data) => ({
    userId: data.userId,
    title: data.title,
    city: data.city,
    dateStart: data.dateStart,
    dateEnd: data.dateEnd,
    groupSizeMin: data.groupSizeMin,
    groupSizeMax: data.groupSizeMax,
    occasion: data.occasion,
    budgetLevel: data.budgetLevel,
    status: data.status
});
const listTrips = (query) => tripRepository.findAll(query);
exports.listTrips = listTrips;
const createTrip = (data) => tripRepository.create(toCreatePayload(data));
exports.createTrip = createTrip;
const ensureTripExists = async (tripId) => {
    const trip = await tripRepository.findById(tripId);
    if (!trip) {
        throw new httpError_1.HttpError(404, 'Trip not found');
    }
    return trip;
};
exports.ensureTripExists = ensureTripExists;
const getTripDetails = async (tripId) => {
    const trip = await tripRepository.findDetailedById(tripId);
    if (!trip) {
        throw new httpError_1.HttpError(404, 'Trip not found');
    }
    return trip;
};
exports.getTripDetails = getTripDetails;
const updateTrip = async (tripId, data) => {
    await (0, exports.ensureTripExists)(tripId);
    return tripRepository.update(tripId, toUpdatePayload(data));
};
exports.updateTrip = updateTrip;
const deleteTrip = async (tripId) => {
    await (0, exports.ensureTripExists)(tripId);
    await tripRepository.remove(tripId);
};
exports.deleteTrip = deleteTrip;
