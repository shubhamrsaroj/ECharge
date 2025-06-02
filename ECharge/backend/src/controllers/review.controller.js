const Review = require('../models/review.model');
const Station = require('../models/station.model');
const { validationResult } = require('express-validator');

// @desc    Get reviews for a station
// @route   GET /api/stations/:stationId/reviews
// @access  Public
exports.getStationReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ station: req.params.stationId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error('Get station reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get current user's review for a station
// @route   GET /api/stations/:stationId/reviews/user
// @access  Private
exports.getUserReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      station: req.params.stationId,
      user: req.user.id,
    }).populate('user', 'name');

    // Return empty data with success status if no review found
    if (!review) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No review found for this user and station',
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Get user review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Add review for a station
// @route   POST /api/stations/:stationId/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Check if station exists
    const station = await Station.findById(req.params.stationId);
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }

    // Check if user already reviewed this station
    const existingReview = await Review.findOne({
      station: req.params.stationId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this station',
      });
    }

    // Create review
    const review = await Review.create({
      rating: req.body.rating,
      comment: req.body.comment,
      user: req.user.id,
      station: req.params.stationId,
    });

    // Populate user data
    await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update review
// @route   PUT /api/stations/:stationId/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user is review owner
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review',
      });
    }

    // Update review
    review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        rating: req.body.rating,
        comment: req.body.comment,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('user', 'name');

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/stations/:stationId/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user is review owner or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review',
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}; 