import { sequelize, DataTypes } from '../../../src/config/db.js';
import User from '../../../models/user.js';

const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'wallets',
  timestamps: true
});

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('credit', 'debit'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  walletId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'wallets',
      key: 'id'
    }
  }
}, {
  tableName: 'wallet_transactions',
  timestamps: true
});

// Associations
Wallet.belongsTo(User, {
  foreignKey: 'userId'  // This explicitly tells Sequelize to use 'userId' instead of 'UserId'
});
User.hasOne(Wallet, {
  foreignKey: 'userId'
});
Wallet.hasMany(Transaction, {
  foreignKey: 'walletId'
});
Transaction.belongsTo(Wallet, {
  foreignKey: 'walletId'
});

export { Wallet, Transaction };