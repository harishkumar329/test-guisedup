import jwt from 'jsonwebtoken';
import { redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';

export const verifyToken = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({ message: 'Token is required' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`bl_${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token is invalid' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Return user data
    return res.json({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    });
  } catch (error) {
    logger.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const blacklistToken = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Store in Redis with expiry matching token expiry
    await redis.set(`bl_${token}`, '1', 'EX', 24 * 60 * 60); // 24 hours

    return res.json({ message: 'Token blacklisted successfully' });
  } catch (error) {
    logger.error('Token blacklist error:', error);
    return res.status(500).json({ message: 'Error blacklisting token' });
  }
};
