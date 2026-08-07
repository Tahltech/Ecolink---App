const { supabaseAdmin } = require('../config/supabase');
const { AppError } = require('./errorHandler');
const { asyncHandler } = require('../utils/helpers');

/**
 * Verifies the Bearer JWT issued by Supabase Auth and attaches the
 * authenticated user (id, email, ...) to req.user.
 * Protect any route that requires a logged-in user with this middleware.
 */
const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new AppError('Missing or invalid Authorization header', 401);
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    throw new AppError('Invalid or expired token', 401);
  }

  req.user = data.user;
  req.token = token;
  next();
});

/**
 * Attaches req.user when a valid Bearer token is present, but never blocks
 * the request — used on public endpoints (weather, news, education) that
 * personalize their response when the caller happens to be logged in.
 */
const attachUser = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (token) {
    const { data } = await supabaseAdmin.auth.getUser(token);
    if (data?.user) {
      req.user = data.user;
      req.token = token;
    }
  }
  next();
});

module.exports = { requireAuth, attachUser };
