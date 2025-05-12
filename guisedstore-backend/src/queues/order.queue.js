import { connect } from '../config/rabbitmq.js';
import { logger } from '../utils/logger.js';
import { Order } from '../../models/order.model.js';
import { Wallet, Transaction } from '../../models/wallet.model.js';
import { sequelize } from '../config/db.js';

const QUEUE_NAME = 'order_processing';

export const initOrderQueue = async () => {
  try {
    const channel = await connect();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // Set prefetch to 1 to ensure we don't overload the connection pool
    await channel.prefetch(1);
    
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg === null) return;
      
      let t = null;
      try {
        const orderData = JSON.parse(msg.content.toString());
        logger.info(`Processing order ${orderData.orderId}`);
        
        // Start transaction with timeout
        t = await sequelize.transaction({
          timeout: 30000 // 30 second timeout
        });
          const order = await Order.findByPk(orderData.orderId, { 
            transaction: t,
            lock: true  // Lock the row to prevent concurrent processing
          });

          if (!order) {
            throw new Error(`Order ${orderData.orderId} not found`);
          }

          const wallet = await Wallet.findOne({
            where: { userId: order.userId },
            transaction: t,
            lock: true  // Lock the wallet record
          });

          if (!wallet) {
            throw new Error(`Wallet not found for user ${order.userId}`);
          }

          // Validate sufficient balance
          if (wallet.balance < order.totalAmount) {
            throw new Error('Insufficient wallet balance');
          }

          // Create wallet transaction
          const transaction = await Transaction.create({
            amount: order.totalAmount,
            type: 'debit',
            description: 'Order payment',
            walletId: wallet.id,
            status: 'pending'
          }, { transaction: t });

          // Update wallet balance
          await wallet.update({
            balance: sequelize.literal(`balance - ${order.totalAmount}`)
          }, { transaction: t });

          // Complete wallet transaction
          await transaction.update({ status: 'completed' }, { transaction: t });
          
          // Update order status
          await order.update({ 
            status: 'processing',
            paymentMethod: 'wallet',
            transactionId: transaction.id
          }, { transaction: t });

          await t.commit();
          logger.info(`Successfully processed order ${orderData.orderId}`);
          channel.ack(msg);
      } catch (error) {
          if (t) await t.rollback();
          logger.error(`Error processing order ${orderData.orderId}:`, error);
          // Requeue the message after a delay
          setTimeout(() => {
            channel.nack(msg, false, true);
          }, 5000);
      }
    }, { noAck: false });

    logger.info('Order processing queue initialized');
  } catch (error) {
    logger.error('Error initializing order queue:', error);
    // Attempt to reconnect after a delay
    setTimeout(initOrderQueue, 5000);
  }
};
