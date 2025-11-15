"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(status, message, details) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.details = details;
    }
}
exports.HttpError = HttpError;
const notFound = (resource) => new HttpError(404, `${resource} not found`);
exports.notFound = notFound;
