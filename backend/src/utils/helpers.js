/**
 * Wraps an async Express handler so thrown/rejected errors are forwarded
 * to the errorHandler middleware instead of crashing the process.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Shape a consistent success response.
 */
const success = (res, data, status = 200, meta = undefined) => {
  return res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) });
};

module.exports = { asyncHandler, success };
