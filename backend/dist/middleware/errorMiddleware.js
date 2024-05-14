"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const errorHandler = (err, req, res, next) => {
    var _a;
    // Default to 500 if status code is 200
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    // Handle Prisma-specific errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // Example of a Prisma error code, you can handle more specific ones if needed
        if (err.code === 'P2002') {
            statusCode = 409; // Conflict
            message = 'Unique constraint failed on the fields: ' + ((_a = err.meta) === null || _a === void 0 ? void 0 : _a.target);
        }
        else if (err.code === 'P2025') {
            statusCode = 404; // Not Found
            message = 'Record not found';
        }
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 400; // Bad Request
        message = 'Validation error';
    }
    else if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        statusCode = 500; // Internal Server Error
        message = 'Database initialization error';
    }
    // Send response with status code and message
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
exports.default = errorHandler;
