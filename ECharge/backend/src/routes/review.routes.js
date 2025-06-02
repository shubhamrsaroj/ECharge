const express = require('express');
const { check } = require('express-validator');
const {
  getStationReviews,
  getUserReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Get all reviews for a station
router.get('/', getStationReviews);

// Get user's review for a station
router.get('/user', protect, getUserReview);

// Add review
router.post(
  '/',
  protect,
  [
    check('rating', 'Rating is required and must be between 1 and 5')
      .isNumeric()
      .isInt({ min: 1, max: 5 }),
  ],
  addReview
);

// Update and delete review
router
  .route('/:id')
  .put(
    protect,
    [
      check('rating', 'Rating is required and must be between 1 and 5')
        .isNumeric()
        .isInt({ min: 1, max: 5 }),
    ],
    updateReview
  )
  .delete(protect, deleteReview);

module.exports = router; 