const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validation');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('fullname').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('phone').optional().isString(),
    body('region').optional().isString(),
    body('district').optional().isString(),
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

router.post('/logout', requireAuth, authController.logout);

router.post(
  '/reset-password',
  [body('email').isEmail().withMessage('A valid email is required')],
  validate,
  authController.resetPassword
);

router.post(
  '/update-password',
  [
    body('access_token').notEmpty().withMessage('access_token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  authController.updatePassword
);

router.get('/me', requireAuth, authController.getMe);

module.exports = router;
