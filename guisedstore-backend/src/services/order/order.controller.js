import { Order, OrderItem } from '../../../models/order.model.js';
import { Cart, CartItem } from '../../../models/cart.model.js';
import { Wallet, Transaction } from '../../../models/wallet.model.js';
import { Product, Category } from '../../../models/product.js';
import { sequelize } from '../../../src/config/db.js';
import { logger } from '../../utils/logger.js';
import { connect } from '../../config/rabbitmq.js';

// Create order from cart (checkout)
export const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const channel = await connect();
    const QUEUE_NAME = 'order_processing';
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Get user's active cart
    const cart = await Cart.findOne({
      where: {
        userId: req.user.userId,
        status: 'active'
      },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          include: [{ model: Category, as: 'category' }]
        }]
      }],
      transaction: t
    });

    if (!cart || !cart.items.length) {
      await t.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0);

    // Check wallet balance
    const wallet = await Wallet.findOne({
      where: { userId: req.user.userId },
      transaction: t
    });

    if (!wallet || wallet.balance < totalAmount) {
      await t.rollback();
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Create wallet transaction
    const transaction = await Transaction.create({
      amount: totalAmount,
      type: 'debit',
      description: 'Order payment',
      walletId: wallet.id,
      status: 'pending'
    }, { transaction: t });

    // Create order in pending state
    const order = await Order.create({
      userId: req.user.userId,
      cartId: cart.id,
      totalAmount,
      status: 'pending',
      paymentMethod: 'wallet',
      transactionId: transaction.id
    }, { transaction: t });

    // Create order items
    const orderItems = await Promise.all(cart.items.map(item => 
      OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productSnapshot: {
          name: item.product.name,
          description: item.product.description,
          category: item.product.category.name
        }
      }, { transaction: t })
    ));

    // Mark cart as converted
    await cart.update({ status: 'converted' }, { transaction: t });

    await t.commit();

    // Queue the order for processing
    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify({ orderId: order.id })),
      { persistent: true }
    );

    // Fetch complete order details
    const completeOrder = await Order.findOne({
      where: { id: order.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          include: [{ model: Category, as: 'category' }]
        }]
      }]
    });

    res.status(201).json({
      order: completeOrder,
      message: 'Order placed successfully'
    });
  } catch (error) {
    await t.rollback();
    logger.error('Error creating order:', error);
    res.status(500).json({ message: 'Error processing order' });
  }
};

// Get user's orders
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const where = { userId: req.user.userId };
    if (status) {
      where.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          include: [{ model: Category, as: 'category' }]
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count
    });
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId
      },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          include: [{ model: Category, as: 'category' }]
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    logger.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId,
        status: 'pending'
      },
      transaction: t
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
    }

    // Refund wallet
    const wallet = await Wallet.findOne({
      where: { userId: req.user.userId },
      transaction: t
    });

    // Create refund transaction
    const refundTransaction = await Transaction.create({
      amount: order.totalAmount,
      type: 'credit',
      description: 'Order cancellation refund',
      walletId: wallet.id,
      status: 'completed'
    }, { transaction: t });

    // Update wallet balance
    await wallet.update({
      balance: sequelize.literal(`balance + ${order.totalAmount}`)
    }, { transaction: t });

    // Update order status
    await order.update({
      status: 'cancelled'
    }, { transaction: t });

    await t.commit();

    res.json({ message: 'Order cancelled and refunded successfully' });
  } catch (error) {
    await t.rollback();
    logger.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
};