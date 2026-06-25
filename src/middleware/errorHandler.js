/**
 * src/middleware/errorHandler.js
 *
 * Two global Express error handlers:
 *   notFound   — catches requests to routes that don't exist (404)
 *   errorHandler — catches any error thrown inside a route handler (500)
 *
 * By centralizing error handling here, individual route handlers
 * only need to call next(error) and these handlers do the rest.
 */

function notFound(req, res, next) {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message    = err.message    || 'Internal server error';

  res.status(statusCode).json({ message });
}

module.exports = { notFound, errorHandler };
