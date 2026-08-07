const { asyncHandler, success } = require('../utils/helpers');
const { AppError } = require('../middleware/errorHandler');
const supabaseService = require('../services/supabaseService');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await supabaseService.getUserProfile(req.user.id);
  return success(res, { user: profile });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['fullname', 'phone', 'region', 'district', 'avatar'];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });
  if (!Object.keys(updates).length) throw new AppError('No valid fields to update', 400);
  const profile = await supabaseService.updateUserProfile(req.user.id, updates);
  return success(res, { user: profile });
});

const updatePushToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new AppError('token is required', 400);
  const profile = await supabaseService.updateUserProfile(req.user.id, { push_token: token });
  return success(res, { user: profile });
});

module.exports = { getProfile, updateProfile, updatePushToken };
