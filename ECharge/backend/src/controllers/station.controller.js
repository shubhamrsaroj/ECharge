const Station = require('../models/station.model');
const { validationResult } = require('express-validator');

// @desc    Get all charging stations
// @route   GET /api/stations
// @access  Public
exports.getStations = async (req, res) => {
  try {
    // Build query
    let query = {};
    
    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by connector type if provided
    if (req.query.connectorType) {
      query.connectorTypes = { $in: [req.query.connectorType] };
    }
    
    // Filter by minimum power output if provided
    if (req.query.minPower) {
      query.powerOutput = { $gte: Number(req.query.minPower) };
    }
    
    // Filter by maximum power output if provided
    if (req.query.maxPower) {
      query.powerOutput = { ...query.powerOutput, $lte: Number(req.query.maxPower) };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    console.log('Fetching stations with query:', query);
    
    // Get stations
    const stations = await Station.find(query)
      .populate('owner', 'name email')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    console.log(`Found ${stations.length} stations`);
    // Log first station's owner for debugging
    if (stations.length > 0) {
      console.log('First station owner:', stations[0].owner);
      console.log('Owner type:', typeof stations[0].owner);
      if (stations[0].owner) {
        console.log('Owner ID:', stations[0].owner._id || stations[0].owner);
      }
    }
    
    // Get total count
    const total = await Station.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: stations.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: stations,
    });
  } catch (error) {
    console.error('Get stations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get nearby charging stations
// @route   GET /api/stations/nearby
// @access  Public
exports.getNearbyStations = async (req, res) => {
  try {
    const { lat, lng, distance = 10, unit = 'km' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude',
      });
    }

    // Calculate radius in radians
    // Earth radius in kilometers is 6378.1
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    const stations = await Station.find({
      'location.coordinates': {
        $geoWithin: { $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius] },
      },
    }).populate('owner', 'name email');

    res.status(200).json({
      success: true,
      count: stations.length,
      data: stations,
    });
  } catch (error) {
    console.error('Get nearby stations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single charging station
// @route   GET /api/stations/:id
// @access  Public
exports.getStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id).populate(
      'owner',
      'name email'
    );

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }

    res.status(200).json({
      success: true,
      data: station,
    });
  } catch (error) {
    console.error('Get station error:', error);
    
    // Check if error is due to invalid ID
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create new charging station
// @route   POST /api/stations
// @access  Private
exports.createStation = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Add owner to req.body
    console.log('User from request:', req.user);
    req.body.owner = req.user.id;
    console.log('Setting station owner to:', req.body.owner);

    // Create station
    const station = await Station.create(req.body);
    console.log('Created station with owner:', station.owner);

    res.status(201).json({
      success: true,
      data: station,
    });
  } catch (error) {
    console.error('Create station error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update charging station
// @route   PUT /api/stations/:id
// @access  Private
exports.updateStation = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }

    // Check if user is station owner or admin
    if (station.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this station',
      });
    }

    // Update station
    station = await Station.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: station,
    });
  } catch (error) {
    console.error('Update station error:', error);
    
    // Check if error is due to invalid ID
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete charging station
// @route   DELETE /api/stations/:id
// @access  Private
exports.deleteStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }

    // Check if user is station owner or admin
    if (station.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this station',
      });
    }

    // Delete station
    await station.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Delete station error:', error);
    
    // Check if error is due to invalid ID
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Station not found',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}; 