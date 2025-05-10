import express from 'express';
import { createOrder, getOrders, getOrder, cancelOrder } from './order.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';
import { orderLimiter } from '../../middleware/rate-limiter.middleware.js';

const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);

router.post('/', orderLimiter, createOrder);
router.get('/', orderLimiter, getOrders);
router.get('/:id', orderLimiter, getOrder);
router.post('/:id/cancel', orderLimiter, cancelOrder);

export default router;