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

module.exports = { generateWeatherAlerts, notifyClimateTip, notifyNewArticle, sendDailyClimateTips };
