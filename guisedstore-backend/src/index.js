import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { startElasticSyncQueue } from './queues/elastic.queue.js';
import { logger } from './utils/logger.js';
import { syncProducts } from './services/product/product.search.js';
import { rateLimiterMiddleware } from './middleware/rate-limiter.middleware.js';
import router from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:4200', 'https://guisedstore.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiterMiddleware);

// Use the centralized router
app.use('/', router);

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