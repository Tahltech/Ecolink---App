const { asyncHandler, success } = require('../utils/helpers');
const supabaseService = require('../services/supabaseService');
const notificationService = require('../services/notificationService');

const list = asyncHandler(async (req, res) => {
  const notifications = await supabaseService.getNotifications(req.user.id, {
    unreadOnly: req.query.unread === 'true',
    limit: Number(req.query.limit) || 50,
  });
  return success(res, { notifications });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await supabaseService.markNotificationRead(req.user.id, req.params.id);
  return success(res, { notification });
});

const markAllRead = asyncHandler(async (req, res) => {
  await supabaseService.markAllNotificationsRead(req.user.id);
  return success(res, { message: 'All notifications marked as read' });
});

// Manual trigger for the daily regional climate-tip job — same logic the
// node-cron schedule in server.js runs automatically once a day. Handy for
// testing/demo without waiting for the scheduled time.
const runDailyTips = asyncHandler(async (req, res) => {
  const result = await notificationService.sendDailyClimateTips();
  return success(res, result);
});

module.exports = { list, markRead, markAllRead, runDailyTips };
