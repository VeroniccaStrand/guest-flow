import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

// Define a custom type for the error object
interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  // Default to 500 if status code is 200
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Prisma-specific errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Example of a Prisma error code, you can handle more specific ones if needed
    if (err.code === 'P2002') {
      statusCode = 409; // Conflict
      message = 'Unique constraint failed on the fields: ' + err.meta?.target;
    } else if (err.code === 'P2025') {
      statusCode = 404; // Not Found
      message = 'Record not found';
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400; // Bad Request
    message = 'Validation error';
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500; // Internal Server Error
    message = 'Database initialization error';
  }

  // Send response with status code and message
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
