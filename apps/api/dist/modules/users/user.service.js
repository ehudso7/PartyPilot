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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.createUser = exports.listUsers = void 0;
const httpError_1 = require("../../utils/httpError");
const userRepository = __importStar(require("./user.repository"));
const normalizeCreatePayload = (data) => ({
    email: data.email,
    name: data.name,
    phone: data.phone ?? null
});
const normalizeUpdatePayload = (data) => {
    const payload = {};
    if (data.email !== undefined)
        payload.email = data.email;
    if (data.name !== undefined)
        payload.name = data.name;
    if (data.phone !== undefined)
        payload.phone = data.phone;
    return payload;
};
const listUsers = () => userRepository.findAll();
exports.listUsers = listUsers;
const createUser = async (data) => {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
        throw new httpError_1.HttpError(409, 'User with this email already exists');
    }
    return userRepository.create(normalizeCreatePayload(data));
};
exports.createUser = createUser;
const getUserById = async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
        throw new httpError_1.HttpError(404, 'User not found');
    }
    return user;
};
exports.getUserById = getUserById;
const updateUser = async (id, data) => {
    await (0, exports.getUserById)(id);
    return userRepository.update(id, normalizeUpdatePayload(data));
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    await (0, exports.getUserById)(id);
    await userRepository.remove(id);
};
exports.deleteUser = deleteUser;
