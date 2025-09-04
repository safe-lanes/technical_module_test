import { __assign } from 'tslib';
import { ZodError } from 'zod';
import { AppError, DatabaseError, ValidationError } from '../utils/errors';
import { logger } from './logger';
var isDevelopment = process.env.NODE_ENV === 'development';
// Async error wrapper for route handlers
export var asyncHandler = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
// Global error handler middleware
export var globalErrorHandler = function (err, req, res, next) {
  var error = err;
  // Log the error
  var errorLog = {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  };
  if (error instanceof AppError && error.isOperational) {
    logger.warn('Operational Error', errorLog);
  } else {
    logger.error('System Error', errorLog);
  }
  // Handle different error types
  if (error instanceof ZodError) {
    var validationErrors = error.errors.map(function (err) {
      return {
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      };
    });
    error = new ValidationError('Validation failed');
    error.details = validationErrors;
  }
  // Handle database errors
  if (error.name === 'ER_DUP_ENTRY' || error.message.includes('duplicate')) {
    error = new DatabaseError('Duplicate entry found');
  }
  if (
    error.name === 'ER_NO_REFERENCED_ROW' ||
    error.message.includes('foreign key')
  ) {
    error = new DatabaseError('Referenced record not found');
  }
  // Default to 500 server error
  if (!(error instanceof AppError)) {
    error = new AppError('Something went wrong', 500, false);
  }
  var appError = error;
  var statusCode = appError.statusCode || 500;
  var errorResponse = {
    success: false,
    error: __assign(
      __assign(
        { message: appError.message, code: appError.code, status: statusCode },
        isDevelopment && { stack: appError.stack }
      ),
      appError.details && { details: appError.details }
    ),
  };
  res.status(statusCode).json(errorResponse);
};
// 404 handler for unmatched routes
export var notFoundHandler = function (req, res, next) {
  var error = new AppError('Route '.concat(req.originalUrl, ' not found'), 404);
  next(error);
};
//# sourceMappingURL=errorHandler.js.map
