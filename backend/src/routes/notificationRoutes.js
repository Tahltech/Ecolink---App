const express = require('express');
const notificationController = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth, notificationController.list);
router.patch('/read-all', requireAuth, notificationController.markAllRead);
router.patch('/:id/read', requireAuth, notificationController.markRead);
// TODO: restrict to admin/cron once an is_admin role exists — see the
// same caveat on reportRoutes.js's status endpoint.
router.post('/daily-tips/run', requireAuth, notificationController.runDailyTips);

module.exports = router;
