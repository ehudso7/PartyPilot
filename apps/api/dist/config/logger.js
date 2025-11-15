"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const env_1 = require("./env");
const buildLoggerMethod = (level) => {
    return (message, meta = {}) => {
        const payload = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        // eslint-disable-next-line no-console
        console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}${payload}`);
    };
};
const isDev = env_1.env.NODE_ENV !== 'production';
exports.logger = {
    debug: isDev ? buildLoggerMethod('debug') : () => undefined,
    info: buildLoggerMethod('info'),
    warn: buildLoggerMethod('warn'),
    error: buildLoggerMethod('error')
};
