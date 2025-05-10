import express from 'express';
import { getProducts, getProduct, searchProducts, getCategories } from './product.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { cacheMiddleware } from '../../middleware/cache.middleware.js';
import { searchLimiter } from '../../middleware/rate-limiter.middleware.js';

const router = express.Router();

// Public routes
router.get('/categories', cacheMiddleware('categories', 3600), getCategories);
router.get('/search', searchLimiter, cacheMiddleware('search', 1800), searchProducts);
router.get('/', cacheMiddleware('products', 1800), getProducts);
router.get('/:id', cacheMiddleware('product', 1800), getProduct);

export default router;