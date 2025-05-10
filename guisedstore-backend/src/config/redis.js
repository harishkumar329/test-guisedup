import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

export const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on('error', (err) => logger.error('Redis rate limiter error:', err));
redis.on('connect', () => logger.info('Connected to Redis rate limiter'));
