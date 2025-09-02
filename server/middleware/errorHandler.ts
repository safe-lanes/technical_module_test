import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, DatabaseError, ValidationError } from '../utils/errors';
import { logger } from './logger';

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    status: number;
    details?: any;
    stack?: string;
  };
}

const isDevelopment = process.env.NODE_ENV === 'development';

// Async error wrapper for route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler middleware
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // Log the error
  const errorLog = {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  };

  if (error instanceof AppError && error.isOperational) {
    logger.warn('Operational Error', errorLog);
  } else {
    logger.error('System Error', errorLog);
  }

  // Handle different error types
  if (error instanceof ZodError) {
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }));

    error = new ValidationError('Validation failed');
    (error as any).details = validationErrors;
  }

  // Handle database errors
  if (error.name === 'ER_DUP_ENTRY' || error.message.includes('duplicate')) {
    error = new DatabaseError('Duplicate entry found');
  }

  if (error.name === 'ER_NO_REFERENCED_ROW' || error.message.includes('foreign key')) {
    error = new DatabaseError('Referenced record not found');
  }

  // Default to 500 server error
  if (!(error instanceof AppError)) {
    error = new AppError('Something went wrong', 500, false);
  }

  const appError = error as AppError;
  const statusCode = appError.statusCode || 500;

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: appError.message,
      code: appError.code,
      status: statusCode,
      ...(isDevelopment && { stack: appError.stack }),
      ...((appError as any).details && { details: (appError as any).details })
    }
  };

  res.status(statusCode).json(errorResponse);
};

// 404 handler for unmatched routes
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};