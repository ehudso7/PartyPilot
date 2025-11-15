"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findById = exports.findAll = exports.create = void 0;
const prismaClient_1 = require("../../db/prismaClient");
const create = (data) => prismaClient_1.prisma.venue.create({ data });
exports.create = create;
const findAll = (query) => prismaClient_1.prisma.venue.findMany({
    where: {
        city: query.city
    },
    orderBy: { name: 'asc' }
});
exports.findAll = findAll;
const findById = (id) => prismaClient_1.prisma.venue.findUnique({
    where: { id }
});
exports.findById = findById;
const update = (id, data) => prismaClient_1.prisma.venue.update({
    where: { id },
    data
});
exports.update = update;
const remove = (id) => prismaClient_1.prisma.venue.delete({
    where: { id }
});
exports.remove = remove;
