import { Wallet, Transaction } from '../../../models/wallet.model.js';
import { sequelize } from '../../../src/config/db.js';

// Get wallet balance and transaction history
export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      where: { userId: req.user.userId },
      include: [{
        model: Transaction,
        limit: 10,
        order: [['createdAt', 'DESC']]
      }]
    });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json(wallet);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ message: 'Error fetching wallet details' });
  }
};

// Add money to wallet
export const addMoney = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    let wallet = await Wallet.findOne({ 
      where: { userId: req.user.userId },
      transaction: t
    });

    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user.userId,
        balance: 0
      }, { transaction: t });
    }

    // Create transaction record
    const transaction = await Transaction.create({
      amount,
      type: 'credit',
      description: 'Money added to wallet',
      walletId: wallet.id,
      status: 'completed'
    }, { transaction: t });

    // Update wallet balance
    await wallet.update({
      balance: sequelize.literal(`balance + ${amount}`)
    }, { transaction: t });

    await t.commit();

    res.json({ 
      message: 'Money added successfully',
      balance: wallet.balance + parseFloat(amount),
      transaction 
    });
  } catch (error) {
    await t.rollback();
    console.error('Error adding money:', error);
    res.status(500).json({ message: 'Error adding money to wallet' });
  }
};

// Use wallet balance for payment
export const deductMoney = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { amount, description = 'Purchase payment' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const wallet = await Wallet.findOne({ 
      where: { userId: req.user.userId },
      transaction: t
    });

    if (!wallet) {
      await t.rollback();
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.balance < amount) {
      await t.rollback();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create transaction record
    const transaction = await Transaction.create({
      amount,
      type: 'debit',
      description,
      walletId: wallet.id,
      status: 'completed'
    }, { transaction: t });

    // Update wallet balance
    await wallet.update({
      balance: sequelize.literal(`balance - ${amount}`)
    }, { transaction: t });

    await t.commit();

    res.json({ 
      message: 'Payment successful',
      balance: wallet.balance - parseFloat(amount),
      transaction 
    });
  } catch (error) {
    await t.rollback();
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};

// Get transaction history
export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const wallet = await Wallet.findOne({
      where: { userId: req.user.userId }
    });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where: { walletId: wallet.id },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transaction history' });
  }
};