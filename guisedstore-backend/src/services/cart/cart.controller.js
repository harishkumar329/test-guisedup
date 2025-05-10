import { Cart, CartItem } from './cart.model.js';
import { Product, Category } from '../../../models/product.js';
import { sequelize } from '../../../src/config/db.js';
import { logger } from '../../utils/logger.js';

// Get user's active cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
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
          include: [{
            model: Category,
            as: 'category'
          }]
        }]
      }]
    });

    if (!cart) {
      // Create new cart if none exists
      cart = await Cart.create({
        userId: req.user.userId,
        status: 'active'
      });
      cart.items = [];
    }

    // Calculate cart totals
    const total = cart.items.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0);

    const cartData = cart.toJSON();
    // Map image to imageUrl in products
    if (cartData.items) {
      cartData.items = cartData.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          imageUrl: item.product.image || '/assets/placeholder.jpg'
        }
      }));
    }

    res.json({
      cart: {
        ...cartData,
        total
      }
    });
  } catch (error) {
    logger.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get or create active cart
    let [cart] = await Cart.findOrCreate({
      where: {
        userId: req.user.userId,
        status: 'active'
      },
      defaults: {
        userId: req.user.userId,
        status: 'active'
      },
      transaction: t
    });

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId
      },
      transaction: t
    });

    if (cartItem) {
      // Update quantity if item exists
      cartItem = await cartItem.update({
        quantity: cartItem.quantity + quantity,
        price: product.price // Update price in case it changed
      }, { transaction: t });
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price
      }, { transaction: t });
    }

    await t.commit();

    // Fetch updated cart
    cart = await Cart.findOne({
      where: { id: cart.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          include: [{
            model: Category,
            as: 'category'
          }]
        }]
      }]
    });

    const total = cart.items.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0);

    res.json({
      cart: {
        ...cart.toJSON(),
        total
      }
    });
  } catch (error) {
    await t.rollback();
    logger.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Find cart item and ensure it belongs to user's active cart
    const cartItem = await CartItem.findOne({
      where: { id: itemId },
      include: [{
        model: Cart,
        where: {
          userId: req.user.userId,
          status: 'active'
        }
      }],
      transaction: t
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Update quantity
    await cartItem.update({ quantity }, { transaction: t });
    await t.commit();

    // Fetch updated cart
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
          include: [{
            model: Category,
            as: 'category'
          }]
        }]
      }]
    });

    const total = cart.items.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0);

    res.json({
      cart: {
        ...cart.toJSON(),
        total
      }
    });
  } catch (error) {
    await t.rollback();
    logger.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { itemId } = req.params;

    // Find and remove cart item
    const result = await CartItem.destroy({
      where: { id: itemId },
      include: [{
        model: Cart,
        where: {
          userId: req.user.userId,
          status: 'active'
        }
      }],
      transaction: t
    });

    if (!result) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await t.commit();

    // Fetch updated cart
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
          include: [{
            model: Category,
            as: 'category'
          }]
        }]
      }]
    });

    const total = cart.items.reduce((sum, item) => 
      sum + (parseFloat(item.price) * item.quantity), 0);

    res.json({
      cart: {
        ...cart.toJSON(),
        total
      }
    });
  } catch (error) {
    await t.rollback();
    logger.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const cart = await Cart.findOne({
      where: {
        userId: req.user.userId,
        status: 'active'
      },
      transaction: t
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await CartItem.destroy({
      where: { cartId: cart.id },
      transaction: t
    });

    await t.commit();
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    await t.rollback();
    logger.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};