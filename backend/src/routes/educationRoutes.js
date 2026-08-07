const express = require('express');
const educationController = require('../controllers/educationController');
const { attachUser } = require('../middleware/authMiddleware');

const router = express.Router();

// All educational content is public — no login required to learn.
router.get('/tips', educationController.listTips);
router.get('/diseases', educationController.listDiseases);
router.get('/diseases/:id', educationController.getDisease);
router.get('/initiatives', educationController.listInitiatives);
router.get('/regional-tips', attachUser, educationController.getRegionalTips);
router.get('/', educationController.listContent);
router.get('/:id', educationController.getContent);

module.exports = router;
