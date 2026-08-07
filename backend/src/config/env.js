require('dotenv').config();

/**
 * Central place to read and validate environment variables.
 * Never hardcode credentials — everything comes from process.env.
 */
const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
  // eslint-disable-next-line no-console
  console.warn(
    `[env] Missing environment variables: ${missing.join(', ')}. ` +
      'Set them in backend/.env before starting the server.'
  );
}

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || '*',

  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Deep link the password-reset email sends the user back into — must
  // also be added to Supabase Dashboard -> Authentication -> URL
  // Configuration -> Redirect URLs, or Supabase will reject it.
  passwordResetRedirectUrl: process.env.PASSWORD_RESET_REDIRECT_URL || 'ecolink://reset-password',

  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,

  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  openMeteoBaseUrl: process.env.OPENMETEO_BASE_URL,
  newsApiKey: process.env.NEWS_API_KEY,
  openAqBaseUrl: process.env.OPENAQ_BASE_URL,
};
