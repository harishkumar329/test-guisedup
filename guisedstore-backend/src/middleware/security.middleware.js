import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { logger } from '../utils/logger.js';

// Rate limiting configuration
export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// Security headers middleware
export const securityMiddleware = [
    // Helmet security headers
    helmet(),
    
    // Content Security Policy
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
        },
    }),

    // Rate limiting
    rateLimiter,

    // Custom security middleware
    (req, res, next) => {
        // Mask sensitive data in logs
        const maskSensitiveData = (obj) => {
            const masked = { ...obj };
            const sensitiveFields = ['password', 'token', 'credit_card'];
            
            sensitiveFields.forEach(field => {
                if (masked[field]) masked[field] = '***masked***';
            });
            
            return masked;
        };

        // Log request details with masked sensitive data
        logger.info('Incoming request', {
            method: req.method,
            path: req.path,
            query: maskSensitiveData(req.query),
            body: maskSensitiveData(req.body),
            ip: req.ip,
        });

        next();
    }
];
