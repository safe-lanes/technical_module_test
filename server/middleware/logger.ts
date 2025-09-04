// @ts-nocheck
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');

// Winston configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'maritime-pms' },
  transports: [
    // Console logging
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // Daily rotating file for all logs
    new DailyRotateFile({
      filename: path.join(logsDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),

    // Separate file for errors only
    new DailyRotateFile({
      level: 'error',
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
});

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      logger.error('HTTP Error', logData);
    } else if (res.statusCode >= 300) {
      logger.warn('HTTP Redirect', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });

  next();
};

// Export logger for use throughout the application
export { logger };

export default logger;
