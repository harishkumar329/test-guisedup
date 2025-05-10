import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./services/auth/auth.routes.js";
import productRoutes from "./services/product/product.routes.js";
import walletRoutes from "./services/wallet/wallet.routes.js";
import cartRoutes from "./services/cart/cart.routes.js";
import orderRoutes from "./services/order/order.routes.js";
import { startElasticSyncQueue } from './queues/elastic.queue.js';
// import adminRouter from "./admin.js";
import { logger } from './utils/logger.js';
import { syncProducts } from './services/product/product.search.js';
import { rateLimiterMiddleware } from './middleware/rate-limiter.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'https://guisedstore.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiterMiddleware);

// Helper function to wait
const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Database connection and server start
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    logger.info('Connected to database');

    // Wait for RabbitMQ and Elasticsearch to be ready
    await waitFor(5000);

    // Initialize queues
    await startElasticSyncQueue();
    logger.info('Elasticsearch sync queue started successfully');

    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    // Sync products with Elasticsearch after server start
    try {
      await syncProducts();
      logger.info('Initial Elasticsearch sync completed');
    } catch (error) {
      logger.error('Failed to sync with Elasticsearch:', error);
      // Continue running even if initial sync fails
    }
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Sync products with Elasticsearch
(async () => {
  try {
    await syncProducts();
    logger.info('Initial Elasticsearch sync completed');
  } catch (error) {
    logger.error('Failed to sync with Elasticsearch:', error);
  }
})();

// Admin router - must be mounted before other routes
// app.use(adminRouter);

// API routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: Date.now() });
});

app.get("/", (req, res) => {
  res.send("GuisedStore API is running...");
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);