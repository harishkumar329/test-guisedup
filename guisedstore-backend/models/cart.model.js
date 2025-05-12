import { sequelize, DataTypes } from '../src/config/db.js';
import User from './user.js';
import { Product } from './product.js';

const Cart = sequelize.define('Cart', {
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
  status: {
    type: DataTypes.ENUM('active', 'converted', 'abandoned'),
    defaultValue: 'active'
  }
}, {
  tableName: 'carts',
  timestamps: true
});

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cartId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'carts',
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
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'cart_items',
  timestamps: true
});

// Associations
Cart.belongsTo(User, { 
  foreignKey: 'userId' // Explicitly tell Sequelize to use 'userId' instead of 'UserId'
});
User.hasMany(Cart, { 
  foreignKey: 'userId'
});

Cart.hasMany(CartItem, {
  foreignKey: 'cartId',
  as: 'items'
});
CartItem.belongsTo(Cart, { 
  foreignKey: 'cartId'
});

CartItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});
Product.hasMany(CartItem, { 
  foreignKey: 'productId'
});

export { Cart, CartItem };