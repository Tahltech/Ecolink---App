const express = require('express');
const reportsController = require('../controllers/reportsController');
const { requireAuth, attachUser } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validation');
const {
  createReportValidator,
  updateReportValidator,
  updateStatusValidator,
} = require('../validators/reportValidators');

const router = express.Router();

// Verified reports are viewable by anyone (e.g. the public map); "mine" and
// mutations require a logged-in citizen.
router.get('/mine', requireAuth, reportsController.myReports);
router.get('/', attachUser, reportsController.list);
router.get('/:id', attachUser, reportsController.getOne);
router.post('/', requireAuth, createReportValidator, validate, reportsController.create);
router.put('/:id', requireAuth, updateReportValidator, validate, reportsController.update);
router.delete('/:id', requireAuth, reportsController.remove);
// TODO: restrict to admin users once an is_admin/role column exists on
// `users` — for now any authenticated user can call this, same as the rest
// of the API's write endpoints.
router.patch(
  '/:id/status',
  requireAuth,
  updateStatusValidator,
  validate,
  reportsController.updateStatus
);

module.exports = router;
