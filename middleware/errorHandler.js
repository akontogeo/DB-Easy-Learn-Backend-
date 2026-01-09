/**
 * Centralized error handling middleware for Express.
 * Handles validation errors, custom status errors, and internal server errors.
 * @module middleware/errorHandler
 */

/**
 * Handles Mongoose or custom validation errors.
 * @param {Error} err - The error object
 * @param {import('express').Response} res - Express response object
 * @returns {import('express').Response}
 */
function handleValidationError(err, res) {
  return res.status(400).json({ success: false, error: err.message, message: 'Validation Error' });
}

/**
 * Handles errors with a custom status code and message.
 * @param {Error & {status: number}} err - The error object with status
 * @param {import('express').Response} res - Express response object
 * @returns {import('express').Response}
 */
function handleStatusError(err, res) {
  return res.status(err.status).json({ success: false, error: err.message });
}

/**
 * Handles generic internal server errors.
 * @param {Error} err - The error object
 * @param {import('express').Response} res - Express response object
 * @returns {import('express').Response}
 */
function handleInternalError(err, res) {
  return res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message || 'Unexpected error' });
}

/**
 * Express error-handling middleware function.
 * Logs the error and sends an appropriate response based on error type.
 * @param {Error} err - The error object
 * @param {import('express').Request} _ - Express request object (unused)
 * @param {import('express').Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function errorHandler(err, _, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);

  if (err.name === 'ValidationError') {
    return handleValidationError(err, res);
  }

  if (err.status && err.message) {
    return handleStatusError(err, res);
  }

  return handleInternalError(err, res);
}
