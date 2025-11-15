"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findByEmail = exports.findById = exports.findAll = exports.create = void 0;
const prismaClient_1 = require("../../db/prismaClient");
const create = (data) => prismaClient_1.prisma.user.create({ data });
exports.create = create;
const findAll = () => prismaClient_1.prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
});
exports.findAll = findAll;
const findById = (id) => prismaClient_1.prisma.user.findUnique({
    where: { id }
});
exports.findById = findById;
const findByEmail = (email) => prismaClient_1.prisma.user.findUnique({
    where: { email }
});
exports.findByEmail = findByEmail;
const update = (id, data) => prismaClient_1.prisma.user.update({
    where: { id },
    data
});
exports.update = update;
const remove = (id) => prismaClient_1.prisma.user.delete({
    where: { id }
});
exports.remove = remove;
