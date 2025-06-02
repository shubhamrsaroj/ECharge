import api from './api';

const bookmarkService = {
  /**
   * Get all bookmarks for the current user
   * @returns {Promise} - Promise with bookmarks data
   */
  async getUserBookmarks() {
    try {
      const response = await api.get('/api/bookmarks');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      throw error;
    }
  },

  /**
   * Add a station to bookmarks
   * @param {string} stationId - Station ID to bookmark
   * @returns {Promise} - Promise with bookmark data
   */
  async addBookmark(stationId) {
    try {
      const response = await api.post('/api/bookmarks', { stationId });
      return response.data;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },

  /**
   * Remove a station from bookmarks
   * @param {string} stationId - Station ID to remove from bookmarks
   * @returns {Promise} - Promise with deletion status
   */
  async removeBookmark(stationId) {
    try {
      const response = await api.delete(`/api/bookmarks/${stationId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        console.error('Not authorized to remove this bookmark');
      } else if (error.response?.status === 404) {
        console.error('Bookmark not found');
      } else {
        console.error('Error removing bookmark:', error);
      }
      throw error;
    }
  },

  /**
   * Check if a station is bookmarked by the current user
   * @param {string} stationId - Station ID to check
   * @returns {Promise} - Promise with boolean result
   */
  async isBookmarked(stationId) {
    try {
      const response = await api.get(`/api/bookmarks/check/${stationId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      throw error;
    }
  },

  /**
   * Get a user's bookmark for a specific station
   * @param {string} stationId - Station ID to check
   * @returns {Promise} - Promise with bookmark data
   */
  async getUserBookmarkForStation(stationId) {
    try {
      const response = await api.get(`/api/bookmarks/station/${stationId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        console.error('Bookmark not found for this station');
      } else {
        console.error('Error getting bookmark for station:', error);
      }
      throw error;
    }
  }
};

export default bookmarkService; 