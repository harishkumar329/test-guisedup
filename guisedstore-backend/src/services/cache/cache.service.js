import Redis from 'ioredis';
import { logger } from '../../utils/logger.js';

const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on('error', (err) => logger.error('Redis error:', err));
redis.on('connect', () => logger.info('Connected to Redis'));

export class CacheService {
    static async get(key) {
        try {
            const data = await redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.error('Cache get error:', error);
            return null;
        }
    }

    static async set(key, value, expiry = 3600) {
        try {
            await redis.set(key, JSON.stringify(value), 'EX', expiry);
        } catch (error) {
            logger.error('Cache set error:', error);
        }
    }

    static async del(key) {
        try {
            await redis.del(key);
        } catch (error) {
            logger.error('Cache delete error:', error);
        }
    }

    static async invalidatePattern(pattern) {
        try {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(keys);
            }
        } catch (error) {
            logger.error('Cache invalidate error:', error);
        }
    }
}
