const { Expo } = require('expo-server-sdk');
const logger = require('../utils/logger');

const expo = new Expo();

/**
 * Sends Expo push notifications to a batch of {token, title, body, data}
 * messages. Invalid/unregistered tokens are skipped rather than thrown —
 * a bad token on one user's device must never block the rest of the batch.
 */
const sendPushNotifications = async (messages) => {
  const valid = messages.filter((m) => Expo.isExpoPushToken(m.token));
  if (!valid.length) return { sent: 0, skipped: messages.length };

  const chunks = expo.chunkPushNotifications(
    valid.map((m) => ({
      to: m.token,
      sound: 'default',
      title: m.title,
      body: m.body,
      data: m.data || {},
    }))
  );

  let sent = 0;
  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      sent += tickets.filter((t) => t.status === 'ok').length;
    } catch (err) {
      logger.warn('Push notification chunk failed', { error: err.message });
    }
  }
  return { sent, skipped: messages.length - valid.length };
};

module.exports = { sendPushNotifications };
