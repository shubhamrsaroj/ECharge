import api from './api';

const stationService = {
  /**
   * Get all charging stations with optional filters
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise with stations data
   */
  async getStations(params = {}) {
    try {
      console.log('Fetching stations with params:', params);
      const response = await api.get('/api/stations', { params });
      console.log('Stations API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  },

  /**
   * Get nearby charging stations
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} distance - Distance in km
   * @returns {Promise} - Promise with stations data
   */
  async getNearbyStations(lat, lng, distance = 10) {
    try {
      console.log(`Fetching nearby stations at (${lat}, ${lng}) within ${distance}km`);
      const response = await api.get('/api/stations/nearby', {
        params: { lat, lng, distance },
      });
      console.log('Nearby stations API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby stations:', error);
      throw error;
    }
  },

  /**
   * Get a single charging station by ID
   * @param {string} id - Station ID
   * @returns {Promise} - Promise with station data
   */
  async getStationById(id) {
    try {
      console.log(`Fetching station with ID: ${id}`);
      const response = await api.get(`/api/stations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching station ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new charging station
   * @param {Object} stationData - Station data
   * @returns {Promise} - Promise with created station data
   */
  async createStation(stationData) {
    try {
      console.log('Creating new station:', stationData);
      const response = await api.post('/api/stations', stationData);
      return response.data;
    } catch (error) {
      console.error('Error creating station:', error);
      throw error;
    }
  },

  /**
   * Update a charging station
   * @param {string} id - Station ID
   * @param {Object} stationData - Updated station data
   * @returns {Promise} - Promise with updated station data
   */
  async updateStation(id, stationData) {
    try {
      console.log(`Updating station ${id}:`, stationData);
      const response = await api.put(`/api/stations/${id}`, stationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating station ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a charging station
   * @param {string} id - Station ID
   * @returns {Promise} - Promise with deletion status
   */
  async deleteStation(id) {
    try {
      console.log(`Deleting station ${id}`);
      const response = await api.delete(`/api/stations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting station ${id}:`, error);
      throw error;
    }
  },
};

export default stationService; 