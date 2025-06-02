const Bookmark = require('../models/bookmark.model');
const Station = require('../models/station.model');
const mongoose = require('mongoose');

// @desc    Get user bookmarks
// @route   GET /api/bookmarks
// @access  Private
exports.getUserBookmarks = async (req, res) => {
  try {
    console.log('Getting bookmarks for user:', req.user.id);
    
    // Only fetch bookmarks that belong to the authenticated user
    const bookmarks = await Bookmark.find({ user: req.user.id })
      .populate({
        path: 'station',
        select: 'name location status powerOutput connectorTypes',
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${bookmarks.length} bookmarks for user ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    console.error('Get user bookmarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Add bookmark
// @route   POST /api/bookmarks
// @access  Private
exports.addBookmark = async (req, res) => {
  try {
    const { stationId } = req.body;

    if (!stationId) {
      return res.status(400).json({
        success: false,
        message: 'Station ID is required',
      });
    }

    // Check if station exists
    const station = await Station.findById(stationId);
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }

    // Check if bookmark already exists
    let bookmark = await Bookmark.findOne({
      user: req.user.id,
      station: stationId,
    });

    if (bookmark) {
      return res.status(400).json({
        success: false,
        message: 'Station is already bookmarked',
      });
    }

    // Create bookmark
    bookmark = await Bookmark.create({
      user: req.user.id,
      station: stationId,
    });

    // Populate station data
    await bookmark.populate({
      path: 'station',
      select: 'name location status powerOutput connectorTypes',
    });

    res.status(201).json({
      success: true,
      data: bookmark,
    });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/bookmarks/:stationId
// @access  Private
exports.removeBookmark = async (req, res) => {
  try {
    console.log('Remove bookmark request:');
    console.log('- User ID:', req.user.id);
    console.log('- Station ID:', req.params.stationId);
    
    // Validate stationId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.stationId)) {
      console.log('Invalid station ID format');
      return res.status(400).json({
        success: false,
        message: 'Invalid station ID format',
      });
    }
    
    // First, check if the bookmark exists for ANY user
    const anyBookmark = await Bookmark.findOne({
      station: req.params.stationId
    }).populate('user', 'name email');
    
    if (anyBookmark) {
      console.log('Found bookmark belonging to user:', anyBookmark.user);
      console.log('Requesting user ID:', req.user.id);
      console.log('Bookmark user ID:', anyBookmark.user._id);
      console.log('IDs match?', anyBookmark.user._id.toString() === req.user.id);
    }
    
    // Find the bookmark with both the user ID and station ID
    const bookmark = await Bookmark.findOne({
      user: req.user.id,
      station: req.params.stationId,
    });

    if (!bookmark) {
      console.log('No bookmark found for this user and station');
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found for this user',
      });
    }

    // Verify that the authenticated user is the owner of the bookmark
    if (bookmark.user.toString() !== req.user.id) {
      console.log('Authorization failed:');
      console.log('- Bookmark user ID:', bookmark.user.toString());
      console.log('- Request user ID:', req.user.id);
      
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove this bookmark',
      });
    }

    console.log('Deleting bookmark...');
    await bookmark.deleteOne();
    console.log('Bookmark deleted successfully');

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Check if station is bookmarked
// @route   GET /api/bookmarks/check/:stationId
// @access  Private
exports.checkBookmarkStatus = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      user: req.user.id,
      station: req.params.stationId,
    });

    res.status(200).json({
      success: true,
      isBookmarked: !!bookmark,
    });
  } catch (error) {
    console.error('Check bookmark status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get user bookmark for a specific station
// @route   GET /api/bookmarks/station/:stationId
// @access  Private
exports.getUserBookmarkForStation = async (req, res) => {
  try {
    // Validate stationId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.stationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid station ID format',
      });
    }
    
    console.log(`Checking bookmark for station ${req.params.stationId} and user ${req.user.id}`);
    
    const bookmark = await Bookmark.findOne({
      user: req.user.id,
      station: req.params.stationId,
    }).populate({
      path: 'station',
      select: 'name location status powerOutput connectorTypes',
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bookmark,
    });
  } catch (error) {
    console.error('Get user bookmark for station error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all bookmarks for a specific station (admin only)
// @route   GET /api/bookmarks/admin/station/:stationId
// @access  Private/Admin
exports.getAllBookmarksForStation = async (req, res) => {
  try {
    // Validate stationId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.stationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid station ID format',
      });
    }
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }
    
    console.log(`Admin getting all bookmarks for station ${req.params.stationId}`);
    
    const bookmarks = await Bookmark.find({
      station: req.params.stationId,
    }).populate({
      path: 'user',
      select: 'name email',
    });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    console.error('Get all bookmarks for station error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}; 