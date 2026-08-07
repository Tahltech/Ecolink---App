const { asyncHandler, success } = require('../utils/helpers');
const { AppError } = require('../middleware/errorHandler');
const newsService = require('../services/newsService');
const supabaseService = require('../services/supabaseService');

const list = asyncHandler(async (req, res) => {
  const { category, search, page, limit } = req.query;
  const data = await newsService.getNews({
    category,
    search,
    page: Number(page) || 1,
    limit: Math.min(Number(limit) || 20, 50),
  });
  return success(res, data);
});

const getOne = asyncHandler(async (req, res) => {
  const article = await supabaseService.getArticleById(req.params.id);
  let bookmarked = false;
  if (req.user?.id) {
    bookmarked = await supabaseService.isBookmarked(req.user.id, req.params.id);
  }
  return success(res, { article, bookmarked });
});

const bookmark = asyncHandler(async (req, res) => {
  const bookmarkRow = await supabaseService.addBookmark(req.user.id, req.params.id);
  return success(res, { bookmark: bookmarkRow }, 201);
});

const unbookmark = asyncHandler(async (req, res) => {
  await supabaseService.removeBookmark(req.user.id, req.params.id);
  return success(res, { message: 'Bookmark removed' });
});

const getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await supabaseService.getUserBookmarks(req.user.id);
  return success(res, { bookmarks });
});

module.exports = { list, getOne, bookmark, unbookmark, getBookmarks };
