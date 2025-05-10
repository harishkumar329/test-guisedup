import { connect } from '../../config/rabbitmq.js';
import { logger } from '../../utils/logger.js';

const QUEUE_NAME = 'elastic_sync';

export const queueElasticSync = async (action, productId) => {
  try {
    const channel = await connect();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify({ action, productId })),
      { persistent: true }
    );

    logger.info(`Queued Elasticsearch sync: ${action} for product ${productId}`);
  } catch (error) {
    logger.error('Error queuing Elasticsearch sync:', error);
    throw error;
  }
};