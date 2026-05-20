import { sendError } from '../utils/apiResponse.js';

/**
 * Restrict route to admin users (must run after protect middleware).
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return sendError(res, { message: 'Admin access required.', statusCode: 403 });
  }
  next();
};
