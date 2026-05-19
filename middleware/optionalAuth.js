import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/** Attach user if valid token present; continue without user otherwise */
export const optionalAuth = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch {
    // ignore invalid token
  }
  next();
};
