const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');

const env = require('./config/env');
const logger = require('./utils/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const newsService = require('./services/newsService');
const notificationService = require('./services/notificationService');

const authRoutes = require('./routes/authRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const newsRoutes = require('./routes/newsRoutes');
const educationRoutes = require('./routes/educationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// ---- Global middleware -------------------------------------------------
app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

const limiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ---- Health check --------------------------------------------------------
app.get('/health', (req, res) => res.json({ status: 'ok', env: env.nodeEnv }));

// ---- Routes ----------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// ---- Error handling (must be last) ------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---- Scheduled jobs -----------------------------------------------------
// Keep climate news fresh across all categories/agencies continuously,
// independent of user traffic (also self-refreshes on read — see
// newsService.getNews's stale-while-revalidate branch).
// Send each user with a known region that day's regional climate-tip as
// both an in-app notification and a real push notification.
if (env.nodeEnv !== 'test') {
  cron.schedule('0 */6 * * *', () => {
    newsService.refreshAllCategories().catch((err) => logger.warn('Scheduled news refresh failed', { error: err.message }));
  });

  cron.schedule('0 7 * * *', () => {
    notificationService.sendDailyClimateTips().catch((err) => logger.warn('Scheduled daily tips failed', { error: err.message }));
  }, { timezone: 'Africa/Douala' });

  logger.info('Scheduled jobs registered: news refresh (every 6h), daily climate tips (07:00 Africa/Douala)');
}

app.listen(env.port, () => {
  logger.info(`Climate App API listening on port ${env.port} [${env.nodeEnv}]`);
});

module.exports = app;
