const supabaseService = require('./supabaseService');
const pushService = require('./pushService');
const { getDailyTipForRegion } = require('../utils/regionalClimateTips');
const logger = require('../utils/logger');

const generateWeatherAlerts = async (userId, weather) => {
  const alerts = [];
  const rain = weather.current?.rainProbability ?? 0;
  const temp = weather.current?.temperature ?? 25;

  if (rain > 70) {
    alerts.push({
      type: 'flood',
      title: 'Heavy Rain Alert',
      message: `High rain probability (${rain}%) in your region. Avoid flood-prone areas.`,
    });
  }
  if (temp > 35) {
    alerts.push({
      type: 'heat',
      title: 'Heat Wave Warning',
      message: `Temperatures reaching ${temp}°C. Stay hydrated and limit outdoor activity midday.`,
    });
  }
  if (rain > 50 && temp > 28) {
    alerts.push({
      type: 'flood',
      title: 'Flood Risk',
      message: 'Combined heat and rainfall increase flood risk in low-lying areas.',
    });
  }

  const created = [];
  for (const alert of alerts) {
    const note = await supabaseService.createNotification({
      userId,
      title: alert.title,
      message: alert.message,
      type: alert.type,
    });
    created.push(note);
  }
  return created;
};

const notifyClimateTip = async (userId, tip) => {
  if (!tip) return null;
  return supabaseService.createNotification({
    userId,
    title: 'Climate Tip of the Day',
    message: `${tip.title}: ${tip.description}`,
    type: 'tip',
  });
};

const notifyNewArticle = async (userId, article) => {
  return supabaseService.createNotification({
    userId,
    title: 'New Climate News',
    message: article.title,
    type: 'news',
  });
};

/**
 * Broadcasts a verified flood report to every user in the same region —
 * in-app notification for all of them, plus a real push notification for
 * whoever has registered a device token. Scoped to the report's region
 * rather than truly everyone, so a flood in the Far North doesn't page
 * someone in the Littoral.
 */
const notifyFloodReportVerified = async (report) => {
  const users = await supabaseService.getUsersForDailyTips();
  const affected = users.filter((u) => u.region === report.region && u.id !== report.user_id);
  if (!affected.length) return { usersNotified: 0, pushSent: 0 };

  const title = `Flood Alert — ${report.region}`;
  const location = report.village || report.subdivision || report.region;
  const message = `A ${(report.severity || '').toLowerCase()} severity flood was reported near ${location}. Stay alert and avoid low-lying areas.`;

  const pushMessages = [];
  for (const user of affected) {
    // eslint-disable-next-line no-await-in-loop
    await supabaseService.createNotification({
      userId: user.id,
      title,
      message,
      type: 'flood',
      region: report.region,
    });
    if (user.push_token) {
      pushMessages.push({ token: user.push_token, title, body: message, data: { type: 'flood', reportId: report.id } });
    }
  }

  const pushResult = pushMessages.length
    ? await pushService.sendPushNotifications(pushMessages)
    : { sent: 0, skipped: 0 };

  logger.info('Flood alert broadcast', { region: report.region, usersNotified: affected.length, pushSent: pushResult.sent });
  return { usersNotified: affected.length, pushSent: pushResult.sent };
};

/**
 * Daily job: for every user with a known region, create an in-app
 * notification with that day's regional climate-improvement tip, and send
 * a real push notification if they've registered a device token. Tapping
 * the notification opens the Local Climate Tips screen for their region.
 */
const sendDailyClimateTips = async () => {
  const users = await supabaseService.getUsersForDailyTips();
  const pushMessages = [];
  let created = 0;

  for (const user of users) {
    const daily = getDailyTipForRegion(user.region);
    await supabaseService.createNotification({
      userId: user.id,
      title: `Daily Climate Tip — ${daily.region}`,
      message: daily.tip,
      type: 'tip',
      region: daily.region,
    });
    created += 1;

    if (user.push_token) {
      pushMessages.push({
        token: user.push_token,
        title: `Daily Climate Tip — ${daily.region}`,
        body: daily.tip,
        data: { type: 'tip', region: daily.region },
      });
    }
  }

  const pushResult = pushMessages.length
    ? await pushService.sendPushNotifications(pushMessages)
    : { sent: 0, skipped: 0 };

  logger.info('Daily climate tips dispatched', { users: users.length, notificationsCreated: created, ...pushResult });
  return { usersNotified: created, pushSent: pushResult.sent };
};

module.exports = {
  generateWeatherAlerts,
  notifyClimateTip,
  notifyNewArticle,
  notifyFloodReportVerified,
  sendDailyClimateTips,
};
