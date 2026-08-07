const express = require('express');
const weatherController = require('../controllers/weatherController');
const { attachUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Public, region-driven endpoints; attachUser lets the controller fall back
// to the caller's saved region when logged in.
router.get('/current', attachUser, weatherController.getCurrent);
router.get('/forecast', attachUser, weatherController.getForecast);
router.get('/history', attachUser, weatherController.getHistory);
router.get('/nowcast', attachUser, weatherController.getNowcast);
router.get('/air-quality', attachUser, weatherController.getAirQuality);
router.get('/clothing', attachUser, weatherController.getClothing);
router.get('/agriculture', attachUser, weatherController.getAgriculture);
router.get('/climate-tip', weatherController.getClimateTip);
router.get('/reverse-geocode', attachUser, weatherController.reverseGeocode);

module.exports = router;
