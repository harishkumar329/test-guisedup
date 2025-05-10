import express from 'express';
import { getWallet, addMoney, deductMoney, getTransactions } from './wallet.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';

const router = express.Router();

// All wallet routes require authentication
router.use(authMiddleware);

router.get('/', getWallet);
router.post('/add', addMoney);
router.post('/deduct', deductMoney);
router.get('/transactions', getTransactions);

export default router;