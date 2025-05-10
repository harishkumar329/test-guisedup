import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from './cart.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeFromCart);
router.delete('/', clearCart);

export default router;