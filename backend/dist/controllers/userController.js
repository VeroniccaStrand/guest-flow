"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
exports.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, fullname, role } = req.body;
    const userExists = yield prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    if (userExists) {
        res.status(400).json({ error: 'User with this username already exists' });
        return;
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const user = yield prisma.user.create({
        data: {
            username: username,
            password: hashedPassword,
            fullname: fullname,
            role: role,
        },
    });
    if (user) {
        res.status(201).json({
            id: user.id,
            username: user.username,
            role: user.role,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));
//LOGIN
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || typeof username !== 'string') {
        res.status(400);
        throw new Error('Invalid username');
    }
    const user = yield prisma.user.findUnique({
        where: {
            username: username
        },
    });
    if (user && (yield bcrypt_1.default.compare(password, user.password))) {
        res.json({
            id: user.id,
            name: user.fullname,
            token: generateToken(res, user.id, user.role)
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid credentials');
    }
}));
//Generate JWT
const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';
const generateToken = (res, id, role) => {
    const token = jsonwebtoken_1.default.sign({ id, role }, jwtSecret, {
        expiresIn: '30d',
    });
    res.cookie('jwt', token, {});
    console.log(token);
};
