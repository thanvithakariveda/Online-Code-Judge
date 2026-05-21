import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Protect routes — requires valid JWT in Authorization: Bearer <token>.
 * Attaches req.user (password excluded) on success.
 */
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(res, { message: 'Not authorized. Please log in.', statusCode: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return sendError(res, { message: 'User no longer exists.', statusCode: 401 });
    }

    next();
  } catch {
    return sendError(res, { message: 'Invalid or expired token.', statusCode: 401 });
  }
};
