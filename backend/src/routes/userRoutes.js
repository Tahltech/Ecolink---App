const express = require('express');
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const { updateProfileValidator } = require('../validators/userValidators');

const router = express.Router();

router.get('/me', requireAuth, userController.getProfile);
router.put('/me', requireAuth, updateProfileValidator, validate, userController.updateProfile);
router.post('/push-token', requireAuth, userController.updatePushToken);

module.exports = router;
