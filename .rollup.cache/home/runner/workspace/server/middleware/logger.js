import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
// Create logs directory if it doesn't exist
var logsDir = path.join(process.cwd(), 'logs');
// Winston configuration
var logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), winston.format.errors({ stack: true }), winston.format.json()),
    defaultMeta: { service: 'maritime-pms' },
    transports: [
        // Console logging
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
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
export var requestLogger = function (req, res, next) {
    var startTime = Date.now();
    res.on('finish', function () {
        var duration = Date.now() - startTime;
        var logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: "".concat(duration, "ms"),
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress,
            timestamp: new Date().toISOString(),
        };
        if (res.statusCode >= 400) {
            logger.error('HTTP Error', logData);
        }
        else if (res.statusCode >= 300) {
            logger.warn('HTTP Redirect', logData);
        }
        else {
            logger.info('HTTP Request', logData);
        }
    });
    next();
};
// Export logger for use throughout the application
export { logger };
export default logger;
//# sourceMappingURL=logger.js.map