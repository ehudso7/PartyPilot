"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findAll = exports.findDetailedById = exports.findById = exports.create = void 0;
const prismaClient_1 = require("../../db/prismaClient");
const create = (data) => prismaClient_1.prisma.trip.create({ data });
exports.create = create;
const findById = (id) => prismaClient_1.prisma.trip.findUnique({
    where: { id }
});
exports.findById = findById;
const findDetailedById = (id) => prismaClient_1.prisma.trip.findUnique({
    where: { id },
    include: {
        events: {
            orderBy: { orderIndex: 'asc' },
            include: { venue: true, reservations: true }
        },
        reservations: {
            include: { venue: true, event: true }
        },
        notifications: true
    }
});
exports.findDetailedById = findDetailedById;
const findAll = (query) => prismaClient_1.prisma.trip.findMany({
    where: {
        userId: query.userId
    },
    orderBy: { createdAt: 'desc' }
});
exports.findAll = findAll;
const update = (id, data) => prismaClient_1.prisma.trip.update({
    where: { id },
    data
});
exports.update = update;
const remove = (id) => prismaClient_1.prisma.trip.delete({
    where: { id }
});
exports.remove = remove;
