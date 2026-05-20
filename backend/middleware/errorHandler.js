/**
 * Global error handler — returns consistent JSON error responses.
 * Maps common Mongoose errors to 400 instead of 500.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Invalid MongoDB ObjectId in URL params
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format.';
  }

  // Mongoose schema validation failed
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Duplicate key (unique index)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field} already exists.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/** 404 handler for unknown routes */
export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
