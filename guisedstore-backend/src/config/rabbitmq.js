import amqp from 'amqplib';
import { logger } from '../utils/logger.js';

let connection = null;
let channel = null;

export const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const connect = async (retries = 5) => {
  try {
    if (channel) {
      return channel;
    }

    // Get RabbitMQ URL from environment variables with fallback
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

    // Create a connection
    connection = await amqp.connect(rabbitmqUrl);
    
    // Handle connection errors and closures
    connection.on('error', (err) => {
      logger.error('RabbitMQ connection error:', err);
      connection = null;
      channel = null;
    });

    connection.on('close', () => {
      logger.info('RabbitMQ connection closed');
      connection = null;
      channel = null;
    });

    // Create a channel
    channel = await connection.createChannel();
    
    // Handle channel errors and closures
    channel.on('error', (err) => {
      logger.error('RabbitMQ channel error:', err);
      channel = null;
    });

    channel.on('close', () => {
      logger.info('RabbitMQ channel closed');
      channel = null;
    });

    logger.info('Connected to RabbitMQ');
    return channel;    } catch (error) {
      logger.error('Error connecting to RabbitMQ:', error);
      if (retries > 0) {
        logger.info(`Retrying connection in 5 seconds... (${retries} attempts left)`);
        await waitFor(5000);
        return connect(retries - 1);
      }
    }
  };

// Graceful shutdown function
export const closeConnection = async () => {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    logger.info('RabbitMQ connection closed gracefully');
  } catch (error) {
    logger.error('Error closing RabbitMQ connection:', error);
    throw error;
  }
};