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
exports.protectVisit = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const protectVisit = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    // Extract token from request cookies if cookies are defined
    if (req.cookies) {
        token = req.cookies.jwt;
    }
    // If token exists, verify it
    if (token) {
        try {
            // Verify the token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Check if userId is present in the decoded token
            if (!decoded.id) {
                res.status(401).json({ message: 'Not authorized, token is missing userId' });
                return;
            }
            // Attach user to request
            req.user = decoded;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token verification failed' });
        }
    }
    else {
        res.status(401).json({ message: 'Not authorized, no token found' });
    }
}));
exports.protectVisit = protectVisit;
