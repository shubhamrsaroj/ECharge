import api from './api';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User data (name, email, password)
   * @returns {Promise} - Promise with user data and token
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login a user
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise} - Promise with user data and token
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Get current user data
   * @returns {Promise} - Promise with user data
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService; 