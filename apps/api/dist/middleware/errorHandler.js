"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const logger_1 = require("../config/logger");
const httpError_1 = require("../utils/httpError");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: 'ValidationError',
            details: err.flatten()
        });
    }
    if (err instanceof httpError_1.HttpError) {
        logger_1.logger.warn(err.message, { status: err.status, details: err.details });
        return res.status(err.status).json({
            error: err.name,
            message: err.message,
            details: err.details
        });
    }
    logger_1.logger.error('Unexpected error', err);
    return res.status(500).json({
        error: 'InternalServerError',
        message: 'Something went wrong'
    });
};
exports.errorHandler = errorHandler;
