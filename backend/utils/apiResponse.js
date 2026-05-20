/**
 * Standard API response helpers.
 *
 * Success: { success: true, message, data }
 * Error:   { success: false, message }
 */

export function sendSuccess(res, { message = 'Success', data = {}, statusCode = 200 }) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(res, { message = 'Something went wrong', statusCode = 400 }) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}
