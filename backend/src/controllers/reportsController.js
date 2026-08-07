const { asyncHandler, success } = require('../utils/helpers');
const { AppError } = require('../middleware/errorHandler');
const supabaseService = require('../services/supabaseService');

const list = asyncHandler(async (req, res) => {
  const verifiedOnly = req.query.verified === 'true';
  const reports = await supabaseService.getFloodReports({
    status: req.query.status,
    region: req.query.region,
    verifiedOnly,
  });
  return success(res, { reports });
});

const myReports = asyncHandler(async (req, res) => {
  const reports = await supabaseService.getFloodReports({ userId: req.user.id });
  return success(res, { reports });
});

const getOne = asyncHandler(async (req, res) => {
  const report = await supabaseService.getFloodReportById(req.params.id);
  return success(res, { report });
});

const create = asyncHandler(async (req, res) => {
  const {
    region, division, subdivision, village,
    latitude, longitude, description, image_url, severity,
  } = req.body;

  const report = await supabaseService.createFloodReport({
    user_id: req.user.id,
    region,
    division,
    subdivision,
    village,
    latitude,
    longitude,
    description,
    image_url,
    severity,
    status: 'Pending',
  });
  return success(res, { report }, 201);
});

const update = asyncHandler(async (req, res) => {
  const existing = await supabaseService.getFloodReportById(req.params.id);
  if (existing.user_id !== req.user.id) throw new AppError('Forbidden', 403);
  if (existing.status !== 'Pending') throw new AppError('Only pending reports can be edited', 400);

  const allowed = ['region', 'division', 'subdivision', 'village', 'latitude', 'longitude', 'description', 'image_url', 'severity'];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const report = await supabaseService.updateFloodReport(req.params.id, updates);
  return success(res, { report });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await supabaseService.getFloodReportById(req.params.id);
  if (existing.user_id !== req.user.id) throw new AppError('Forbidden', 403);
  if (existing.status !== 'Pending') throw new AppError('Only pending reports can be deleted', 400);
  await supabaseService.deleteFloodReport(req.params.id);
  return success(res, { message: 'Report deleted' });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ['Verified', 'Rejected', 'Resolved', 'Pending'];
  if (!valid.includes(status)) throw new AppError('Invalid status', 400);
  const report = await supabaseService.updateFloodReport(req.params.id, { status });
  return success(res, { report });
});

module.exports = { list, myReports, getOne, create, update, remove, updateStatus };
