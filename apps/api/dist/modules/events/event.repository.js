"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findById = exports.findAll = exports.create = void 0;
const prismaClient_1 = require("../../db/prismaClient");
const create = (data) => prismaClient_1.prisma.event.create({
    data,
    include: { venue: true }
});
exports.create = create;
const findAll = (query) => prismaClient_1.prisma.event.findMany({
    where: { tripId: query.tripId },
    orderBy: { orderIndex: 'asc' },
    include: { venue: true }
});
exports.findAll = findAll;
const findById = (id) => prismaClient_1.prisma.event.findUnique({
    where: { id },
    include: { venue: true }
});
exports.findById = findById;
const update = (id, data) => prismaClient_1.prisma.event.update({
    where: { id },
    data,
    include: { venue: true }
});
exports.update = update;
const remove = (id) => prismaClient_1.prisma.event.delete({
    where: { id }
});
exports.remove = remove;
