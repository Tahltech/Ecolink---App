const express = require('express');
const newsController = require('../controllers/newsController');
const { requireAuth, attachUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/bookmarks', requireAuth, newsController.getBookmarks);
router.get('/', attachUser, newsController.list);
router.get('/:id', attachUser, newsController.getOne);
router.post('/:id/bookmark', requireAuth, newsController.bookmark);
router.delete('/:id/bookmark', requireAuth, newsController.unbookmark);

module.exports = router;
