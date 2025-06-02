import api from './api';

const reviewService = {
  /**
   * Get all reviews for a station
   * @param {string} stationId - Station ID
   * @returns {Promise} - Promise with reviews data
   */
  async getStationReviews(stationId) {
    try {
      const response = await api.get(`/api/stations/${stationId}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  /**
   * Add a review to a station
   * @param {string} stationId - Station ID
   * @param {Object} reviewData - Review data (rating, comment)
   * @returns {Promise} - Promise with created review data
   */
  async addReview(stationId, reviewData) {
    try {
      const response = await api.post(`/api/stations/${stationId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  /**
   * Update a review
   * @param {string} stationId - Station ID
   * @param {string} reviewId - Review ID
   * @param {Object} reviewData - Updated review data
   * @returns {Promise} - Promise with updated review data
   */
  async updateReview(stationId, reviewId, reviewData) {
    try {
      const response = await api.put(`/api/stations/${stationId}/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  /**
   * Delete a review
   * @param {string} stationId - Station ID
   * @param {string} reviewId - Review ID
   * @returns {Promise} - Promise with deletion status
   */
  async deleteReview(stationId, reviewId) {
    try {
      const response = await api.delete(`/api/stations/${stationId}/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  /**
   * Check if user has already reviewed a station
   * @param {string} stationId - Station ID
   * @returns {Promise} - Promise with review data if exists
   */
  async getUserReview(stationId) {
    try {
      const response = await api.get(`/api/stations/${stationId}/reviews/user`);
      return response.data;
    } catch (error) {
      console.error('Error checking user review:', error);
      throw error;
    }
  }
};

export default reviewService; 