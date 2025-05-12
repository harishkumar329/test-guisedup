import { sequelize, DataTypes } from '../src/config/db.js';
import User from './user.js';
import { Product } from './product.js';
import { Wallet } from './wallet.model.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  cartId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'carts',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'processing',
      'completed',
      'failed',
      'cancelled'
    ),
    defaultValue: 'pending'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('wallet'),
    defaultValue: 'wallet'
  },
  transactionId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'wallet_transactions',
      key: 'id'
    }
  },
  failureReason: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  productSnapshot: {
    type: DataTypes.JSONB,
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: true
});

// Associations
Order.belongsTo(User, {
  foreignKey: 'userId'  // Explicitly tell Sequelize to use 'userId' instead of 'UserId'
});
User.hasMany(Order, {
  foreignKey: 'userId'
});

Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId'
});

OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

export { Order, OrderItem };