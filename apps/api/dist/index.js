"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const prismaClient_1 = require("./db/prismaClient");
const server_1 = require("./server");
const app = (0, server_1.createServer)();
const server = app.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`PartyPilot API listening on port ${env_1.env.PORT}`);
});
const shutdown = async (signal) => {
    logger_1.logger.info(`Received ${signal}, shutting down gracefully`);
    server.close(async (closeErr) => {
        if (closeErr) {
            logger_1.logger.error('Error shutting down HTTP server', { error: closeErr });
        }
        await prismaClient_1.prisma.$disconnect();
        process.exit(0);
    });
};
['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => void shutdown(sig));
});
