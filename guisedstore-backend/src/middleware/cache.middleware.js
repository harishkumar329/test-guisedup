import { CacheService } from '../services/cache/cache.service.js';
import { logger } from '../utils/logger.js';

export const cacheMiddleware = (keyPrefix, duration = 3600) => {
    return async (req, res, next) => {
        try {
            // Generate cache key based on the request URL and query parameters
            const queryString = Object.keys(req.query)
                .sort()
                .map(key => `${key}=${req.query[key]}`)
                .join('&');
            const cacheKey = `${keyPrefix}:${req.path}${queryString ? `?${queryString}` : ''}`;
            
            // Try to get data from cache
            const cachedData = await CacheService.get(cacheKey);
            
            if (cachedData) {
                logger.debug(`Cache hit for key: ${cacheKey}`);
                return res.json(cachedData);
            }

            // Store the original send function
            const originalSend = res.json;

            // Override res.json to cache the response
            res.json = function (data) {
                // Only cache successful responses
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    // Cache the response data
                    CacheService.set(cacheKey, data, duration);
                    logger.debug(`Cache set for key: ${cacheKey}`);
                }
                
                // Call the original send function
                return originalSend.call(this, data);
            };

            next();
        } catch (error) {
            logger.error('Cache middleware error:', error);
            next();
        }
    };
};
