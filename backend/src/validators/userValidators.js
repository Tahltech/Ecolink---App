const { body } = require('express-validator');

const updateProfileValidator = [
  body('fullname').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('phone').optional().isString(),
  body('region').optional().isString(),
  body('district').optional().isString(),
  body('avatar').optional().isURL().withMessage('avatar must be a valid URL'),
];

module.exports = { updateProfileValidator };
