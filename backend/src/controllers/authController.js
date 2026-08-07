const { supabaseAdmin } = require('../config/supabase');
const { asyncHandler, success } = require('../utils/helpers');
const { AppError } = require('../middleware/errorHandler');
const supabaseService = require('../services/supabaseService');
const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * POST /api/auth/register
 * Creates a Supabase Auth user + matching row in public.users.
 */
const register = asyncHandler(async (req, res) => {
  const { fullname, email, password, phone, region, district } = req.body;

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // skip verification — users can sign in immediately
  });

  if (authError) throw new AppError(authError.message, 400);

  try {
    const profile = await supabaseService.createUserProfile({
      id: authData.user.id,
      fullname,
      email,
      phone,
      region,
      district,
    });
    return success(res, { user: profile }, 201);
  } catch (profileError) {
    // Roll back the auth user if profile creation fails, to avoid orphans
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    logger.error('Rolled back auth user after profile creation failure', {
      error: profileError.message,
    });
    throw new AppError('Failed to create user profile', 500);
  }
});

/**
 * POST /api/auth/login
 * Signs the user in and returns the Supabase session (access + refresh token).
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
  if (error) throw new AppError(error.message, 401);

  const profile = await supabaseService.getUserProfile(data.user.id);

  return success(res, {
    user: profile,
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  });
});

/**
 * POST /api/auth/logout
 * Invalidates the session server-side.
 */
const logout = asyncHandler(async (req, res) => {
  const { error } = await supabaseAdmin.auth.admin.signOut(req.token);
  if (error) throw new AppError(error.message, 400);
  return success(res, { message: 'Logged out successfully' });
});

/**
 * POST /api/auth/reset-password
 * Sends a password-reset email via Supabase. The link carries the user
 * back into the app via a deep link (see env.passwordResetRedirectUrl),
 * landing on NewPasswordScreen with a short-lived recovery access_token.
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: env.passwordResetRedirectUrl,
  });
  if (error) {
    // Supabase's own error here is often an opaque "{}" (e.g. when its
    // configured SMTP provider rejects the send) — not useful to show a
    // user, so surface a readable message and log the real one for us.
    logger.error('Password reset email failed to send', { error: error.message, status: error.status });
    throw new AppError('Could not send the reset email right now. Please try again shortly.', 400);
  }
  return success(res, { message: 'Password reset email sent' });
});

/**
 * POST /api/auth/update-password
 * Completes a password reset. `access_token` is the short-lived recovery
 * token Supabase embedded in the reset-link deep link — verifying it here
 * (same check requireAuth uses) proves the request really came from
 * whoever clicked the emailed link, before we let them set a new password.
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { access_token: accessToken, password } = req.body;

  const { data, error: verifyError } = await supabaseAdmin.auth.getUser(accessToken);
  if (verifyError || !data?.user) {
    throw new AppError('This reset link is invalid or has expired. Request a new one.', 401);
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(data.user.id, { password });
  if (error) throw new AppError(error.message, 400);

  return success(res, { message: 'Password updated successfully' });
});

/**
 * GET /api/auth/me
 * Returns the authenticated user's profile. Requires requireAuth middleware.
 */
const getMe = asyncHandler(async (req, res) => {
  const profile = await supabaseService.getUserProfile(req.user.id);
  return success(res, { user: profile });
});

module.exports = { register, login, logout, resetPassword, updatePassword, getMe };
