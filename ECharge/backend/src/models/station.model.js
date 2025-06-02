const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Station name is required'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required'],
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
    powerOutput: {
      type: Number,
      required: [true, 'Power output is required'],
      min: [0, 'Power output must be a positive number'],
    },
    connectorTypes: {
      type: [String],
      required: [true, 'At least one connector type is required'],
      enum: ['Type1', 'Type2', 'CHAdeMO', 'CCS', 'Tesla'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    pricing: {
      perKwh: {
        type: Number,
        default: 0,
      },
      perMinute: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    openingHours: {
      type: String,
      default: '24/7',
    },
    photos: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Create a 2dsphere index for geospatial queries
stationSchema.index({ 'location.coordinates': '2dsphere' });

const Station = mongoose.model('Station', stationSchema);

module.exports = Station; 