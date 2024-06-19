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
exports.updateUserProfile = exports.logoutUser = exports.getAllUsers = exports.deleteUser = exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../server");
const prisma = new client_1.PrismaClient();
// @desc    Register new user
// @route   POST /api/users
// @access  Private / ADMIN
exports.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, fullname, role } = req.body;
    // Check if user with the given username already exists
    const userExists = yield prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    if (userExists) {
        // If user exists, send a 400 error response
        res.status(400).json({ error: 'User with this username already exists' });
        return;
    }
    // Hash the user's password
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    // Create the new user
    const user = yield prisma.user.create({
        data: {
            username: username,
            password: hashedPassword,
            fullname: fullname,
            role: role,
        },
    });
    server_1.io.emit('addedUser', (user));
    console.log('socket');
    // Send response if user is created successfully
    if (user) {
        res.status(201).json({
            id: user.id,
            username: user.username,
            role: user.role,
        });
    }
    else {
        // If user creation fails, send a 400 error response
        res.status(400);
        throw new Error('Invalid user data');
    }
}));
// @desc    Login User / generate token
// @route   POST /api/users/login
// @access  Public
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('backend login');
    const { username, password } = req.body;
    // Validate the username
    if (!username || typeof username !== 'string') {
        res.status(400);
        throw new Error('Invalid username');
    }
    // Find the user by username
    const user = yield prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    // Check if user exists and password matches
    if (user && (yield bcrypt_1.default.compare(password, user.password))) {
        // If valid, generate and send token along with user details
        const token = generateToken(res, user.id, user.role);
        res.json({
            id: user.id,
            name: user.fullname,
            token: token,
        });
    }
    else {
        // If invalid, send a 400 error response
        res.status(400);
        throw new Error('Invalid credentials');
    }
}));
// @desc    Delete User
// @route   DELETE /api/users
// @access  Private / ADMIN
exports.deleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    console.log('delete backend user');
    // Check if the user exists before attempting to delete
    const user = yield prisma.user.findUnique({
        where: { username },
    });
    if (!user) {
        // Throw an error if user is not found
        res.status(404);
        throw new Error('User not found');
    }
    console.log('delete');
    // Proceed with deletion if user exists
    yield prisma.user.delete({
        where: { username },
    });
    server_1.io.emit('deletedUser', { username: username });
    console.log('socket');
    // Send response indicating successful deletion
    res.status(200).json({
        username: user.username,
        message: 'User deleted successfully najs',
    });
}));
// @desc    Get all users
// @route   GET /api/users
// @access  Private / ADMIN
exports.getAllUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve all users from the database
    const users = yield prisma.user.findMany();
    console.log('backend user');
    // Send the list of users as the response
    res.status(200).json(users);
}));
// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
exports.logoutUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Clear the JWT cookie by setting it to an empty string and setting the expiration date to the past
    res.cookie('jwt', '', {
        httpOnly: false,
        expires: new Date(0),
    });
    // Send a success response indicating the user has been logged out
    res.status(200).json({ message: 'Logged out successfully' });
}));
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private ADMIN
exports.updateUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, fullname, password } = req.body;
    if (!username) {
        res.status(400);
        throw new Error('Username is required');
    }
    const user = yield prisma.user.findUnique({
        where: { username: username }, // Assuming req.user contains the logged-in user's info
    });
    if (user) {
        user.username = req.body.username || user.username;
        user.fullname = req.body.fullname || user.fullname;
        if (req.body.password) {
            const salt = yield bcrypt_1.default.genSalt(10);
            user.password = yield bcrypt_1.default.hash(req.body.password, salt);
        }
        const updatedUser = yield prisma.user.update({
            where: { id: user.id },
            data: {
                username: user.username,
                fullname: user.fullname,
                password: user.password,
            },
        });
        res.json({
            id: updatedUser.id,
            username: updatedUser.username,
            fullname: updatedUser.fullname,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
}));
// Generate JWT
const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';
const generateToken = (res, id, role) => {
    // Generate a JWT token with the user's ID and role, and an expiration of 30 days
    const token = jsonwebtoken_1.default.sign({ id, role }, jwtSecret, {
        expiresIn: '30d',
    });
    // Set the token as a cookie in the response
    res.cookie('jwt', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
    });
    return token;
};
