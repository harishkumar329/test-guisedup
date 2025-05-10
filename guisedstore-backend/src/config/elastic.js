import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

export const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200',
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: true
});

// Test connection and create index if it doesn't exist
const initializeElasticsearch = async () => {
  try {
    await elasticClient.ping();
    logger.info('Connected to Elasticsearch');

    // Create products index if it doesn't exist
    const indexExists = await elasticClient.indices.exists({ index: 'products' });
    if (!indexExists) {
      await elasticClient.indices.create({
        index: 'products',
        body: {
          mappings: {
            properties: {
              name: { type: 'text' },
              description: { type: 'text' },
              price: { type: 'float' },
              status: { type: 'keyword' },
              categoryId: { type: 'keyword' },
              category: {
                properties: {
                  id: { type: 'keyword' },
                  name: { type: 'keyword' }
                }
              }
            }
          }
        }
      });
      logger.info('Created products index');
    }
  } catch (error) {
    logger.error('Error connecting to Elasticsearch:', error);
  }
};

// Initialize Elasticsearch when this module is imported
initializeElasticsearch();