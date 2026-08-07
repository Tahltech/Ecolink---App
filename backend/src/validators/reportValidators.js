const { body } = require('express-validator');

const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

const createReportValidator = [
  body('region').trim().notEmpty().withMessage('Region is required'),
  body('division').trim().notEmpty().withMessage('Division is required'),
  body('subdivision').trim().notEmpty().withMessage('Subdivision is required'),
  body('village').trim().notEmpty().withMessage('Village or neighbourhood is required'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('A valid latitude is required'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('A valid longitude is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('image_url').optional().isURL().withMessage('image_url must be a valid URL'),
  body('severity').isIn(SEVERITY_LEVELS).withMessage(`Severity must be one of: ${SEVERITY_LEVELS.join(', ')}`),
];

const updateReportValidator = [
  body('region').optional().trim().notEmpty(),
  body('division').optional().trim().notEmpty(),
  body('subdivision').optional().trim().notEmpty(),
  body('village').optional().trim().notEmpty(),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('image_url').optional().isURL(),
  body('severity').optional().isIn(SEVERITY_LEVELS),
];

const updateStatusValidator = [
  body('status').isIn(['Verified', 'Rejected', 'Resolved', 'Pending']).withMessage('Invalid status'),
];

module.exports = { createReportValidator, updateReportValidator, updateStatusValidator };
