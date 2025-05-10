import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';

// Common configuration for rate limiters
const rateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    standardHeaders: true,     // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,      // Disable the `X-RateLimit-*` headers
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args),
        prefix: 'rl:', // Redis key prefix for rate limiter
    }),
    handler: (req, res) => {
        logger.warn('Rate limit exceeded', {
            ip: req.ip,
            path: req.path,
            method: req.method
        });
        res.status(429).json({
            error: 'Too many requests, please try again later',
            retryAfter: res.getHeader('Retry-After')
        });
    }
};

// General API rate limiter
export const generalLimiter = rateLimit({
    ...rateLimitConfig,
    max: 100, // 100 requests per 15 minutes
});

// Auth endpoints rate limiter (more strict)
export const authLimiter = rateLimit({
    ...rateLimitConfig,
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 failed attempts per hour
    skipSuccessfulRequests: true, // Only count failed attempts
});

// Order endpoints rate limiter
export const orderLimiter = rateLimit({
    ...rateLimitConfig,
    max: 30, // 30 requests per 15 minutes
    keyGenerator: (req) => {
        return req.user ? req.user.userId : req.ip; // Use userId if authenticated
    }
});

// Product search rate limiter
export const searchLimiter = rateLimit({
    ...rateLimitConfig,
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // 50 searches per 5 minutes
});

// Payment endpoints rate limiter
export const paymentLimiter = rateLimit({
    ...rateLimitConfig,
    max: 10, // 10 payment requests per 15 minutes
    keyGenerator: (req) => {
        return req.user ? req.user.userId : req.ip;
    }
});

// Export middleware array for use in routes
export const rateLimiterMiddleware = [
    // Global rate limiter
    generalLimiter
];
