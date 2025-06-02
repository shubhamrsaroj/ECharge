const express = require('express');
const {
  getUserBookmarks,
  addBookmark,
  removeBookmark,
  checkBookmarkStatus,
  getUserBookmarkForStation,
  getAllBookmarksForStation,
} = require('../controllers/bookmark.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All bookmark routes require authentication
router.use(protect);

// Get all bookmarks and create bookmark
router.route('/').get(getUserBookmarks).post(addBookmark);

// Check if station is bookmarked
router.get('/check/:stationId', checkBookmarkStatus);

// Get user bookmark for specific station
router.get('/station/:stationId', getUserBookmarkForStation);

// Admin route to get all bookmarks for a station
router.get('/admin/station/:stationId', authorize('admin'), getAllBookmarksForStation);

// Remove bookmark
router.delete('/:stationId', removeBookmark);

module.exports = router; 