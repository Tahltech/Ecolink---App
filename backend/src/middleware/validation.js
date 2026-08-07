const { validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * Runs after an array of express-validator checks; collects errors and
 * forwards a single 422 AppError if any field failed validation.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => `${e.path}: ${e.msg}`)
      .join('; ');
    return next(new AppError(message, 422));
  }
  next();
};

module.exports = { validate };
