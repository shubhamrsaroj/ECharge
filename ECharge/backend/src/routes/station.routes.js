const express = require('express');
const { check } = require('express-validator');
const {
  getStations,
  getStation,
  getNearbyStations,
  createStation,
  updateStation,
  deleteStation,
} = require('../controllers/station.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all stations and create station routes
router
  .route('/')
  .get(getStations)
  .post(
    protect,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('location.coordinates', 'Coordinates are required').isArray(),
      check('location.address', 'Address is required').not().isEmpty(),
      check('location.city', 'City is required').not().isEmpty(),
      check('location.state', 'State is required').not().isEmpty(),
      check('location.zipCode', 'Zip code is required').not().isEmpty(),
      check('location.country', 'Country is required').not().isEmpty(),
      check('powerOutput', 'Power output is required').isNumeric(),
      check('connectorTypes', 'At least one connector type is required').isArray({ min: 1 }),
    ],
    createStation
  );

// Get nearby stations route
router.get('/nearby', getNearbyStations);

// Get, update, and delete station routes
router
  .route('/:id')
  .get(getStation)
  .put(protect, updateStation)
  .delete(protect, deleteStation);

module.exports = router; 