const { asyncHandler, success } = require('../utils/helpers');
const weatherService = require('../services/weatherService');
const supabaseService = require('../services/supabaseService');
const notificationService = require('../services/notificationService');

const getCurrent = asyncHandler(async (req, res) => {
  const region = req.query.region || req.user?.region || 'Yaoundé';
  const data = await weatherService.getCurrentWeather(region);

  if (req.user?.id) {
    notificationService.generateWeatherAlerts(req.user.id, data).catch(() => {});
  }

  return success(res, data);
});

const getForecast = asyncHandler(async (req, res) => {
  const region = req.query.region || req.user?.region || 'Yaoundé';
  const data = await weatherService.getForecast(region);
  return success(res, data);
});

const getHistory = asyncHandler(async (req, res) => {
  const region = req.query.region || req.user?.region || 'Yaoundé';
  const days = Math.min(Number(req.query.days) || 7, 30);
  const data = await weatherService.getHistory(region, days);
  return success(res, data);
});

const getNowcast = asyncHandler(async (req, res) => {
  const region = req.query.region || req.user?.region || 'Yaoundé';
  const data = await weatherService.getNowcast(region);
  return success(res, data);
});

const getAirQuality = asyncHandler(async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (!lat || !lon) {
    const region = req.query.region || 'Yaoundé';
    const weather = await weatherService.getCurrentWeather(region);
    const coords = weather.coordinates;
    const aq = await weatherService.fetchAirQuality(coords.lat, coords.lon);
    return success(res, { region: weather.region, airQuality: aq });
  }
  const aq = await weatherService.fetchAirQuality(lat, lon);
  return success(res, { airQuality: aq });
});

const getClothing = asyncHandler(async (req, res) => {
  const region = req.query.region || req.user?.region || 'Yaoundé';
  const data = await weatherService.getCurrentWeather(region);
  return success(res, { region: data.region, clothing: data.clothing });
});

const getAgriculture = asyncHandler(async (req, res) => {
  const region = req.query.region || req.user?.region || 'Yaoundé';
  const data = await weatherService.getCurrentWeather(region);
  return success(res, { region: data.region, agriculture: data.agriculture });
});

const getClimateTip = asyncHandler(async (req, res) => {
  const tip = await supabaseService.getRandomClimateTip();
  return success(res, { tip });
});

const reverseGeocode = asyncHandler(async (req, res) => {
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(422).json({ success: false, error: { message: 'lat and lon query params are required' } });
  }
  const location = await weatherService.reverseGeocode(lat, lon);

  // If the caller is logged in, save their live location + resolved region
  // so weather/reports/tips personalize automatically from now on.
  if (req.user?.id) {
    supabaseService
      .updateUserProfile(req.user.id, { region: location.region, latitude: lat, longitude: lon })
      .catch(() => {});
  }

  return success(res, location);
});

module.exports = {
  getCurrent,
  getForecast,
  getHistory,
  getNowcast,
  getAirQuality,
  getClothing,
  getAgriculture,
  getClimateTip,
  reverseGeocode,
};
