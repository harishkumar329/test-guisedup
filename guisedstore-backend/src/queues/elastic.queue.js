import { connect } from '../config/rabbitmq.js';
import { logger } from '../utils/logger.js';
import { elasticClient } from '../config/elastic.js';
import { Product } from '../../models/product.js';

const QUEUE_NAME = 'elastic_sync';

export const startElasticSyncQueue = async () => {
  try {
    const channel = await connect();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          const { action, productId } = JSON.parse(msg.content.toString());
          logger.info(`Processing Elasticsearch sync: ${action} for product ${productId}`);

          switch (action) {
            case 'index':
            case 'update':
              const product = await Product.findByPk(productId, {
                include: ['category']
              });
              if (product) {
                await elasticClient.index({
                  index: 'products',
                  id: product.id.toString(),
                  document: {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    category: product.category?.name,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt
                  }
                });
                logger.info(`Product ${productId} indexed in Elasticsearch`);
              }
              break;

            case 'delete':
              await elasticClient.delete({
                index: 'products',
                id: productId.toString()
              });
              logger.info(`Product ${productId} deleted from Elasticsearch`);
              break;

            default:
              logger.warn(`Unknown Elasticsearch sync action: ${action}`);
          }

          channel.ack(msg);
        } catch (error) {
          logger.error('Error processing Elasticsearch sync:', error);
          // Negative acknowledge and requeue the message
          channel.nack(msg, false, true);
        }
      }
    }, {
      noAck: false // Enable manual acknowledgment
    });

    logger.info('Elasticsearch sync queue consumer started');
  } catch (error) {
    logger.error('Error starting Elasticsearch sync queue:', error);
    throw error;
  }
};
