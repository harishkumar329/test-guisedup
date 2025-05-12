import express from 'express';
import productRoutes from '../services/product/product.routes.js';
import walletRoutes from '../services/wallet/wallet.routes.js';
import cartRoutes from '../services/cart/cart.routes.js';
import orderRoutes from '../services/order/order.routes.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: Date.now() });
});

// Root endpoint
router.get("/", (req, res) => {
  res.send("GuisedStore API is running...");
});

// API Routes
router.use('/api/products', productRoutes);
router.use('/api/wallet', walletRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/orders', orderRoutes);

// Not found handler
router.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

export default router;
