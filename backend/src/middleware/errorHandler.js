/**
 * Global error handler middleware
 * Catches all errors and returns a structured response
 */
const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  
  // Log the error
  console.error(`[ERROR] ${timestamp}`, {
    message: err.message,
    status: err.status || 500,
    path: req.path,
    method: req.method,
  });

  // Determine status code
  const status = err.status || err.statusCode || 500;
  
  // Build error response
  const response = {
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
      timestamp,
    },
  };

  // Don't expose stack trace in production
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  res.status(status).json(response);
};

module.exports = errorHandler;
