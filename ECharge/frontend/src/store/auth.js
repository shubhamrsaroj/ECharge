import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authService from '@/services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  
  // Add a getter for user ID that handles both formats
  const userId = computed(() => {
    if (!user.value) return null;
    // Handle both formats: user._id or user.id
    return user.value._id || user.value.id;
  });

  // Actions
  async function register(userData) {
    try {
      loading.value = true;
      error.value = null;
      const response = await authService.register(userData);
      
      // Ensure user object has consistent ID property
      const userWithConsistentId = {
        ...response.user,
        id: response.user._id
      };
      
      user.value = userWithConsistentId;
      token.value = response.token;
      localStorage.setItem('user', JSON.stringify(userWithConsistentId));
      localStorage.setItem('token', response.token);
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function login(credentials) {
    try {
      loading.value = true;
      error.value = null;
      const response = await authService.login(credentials);
      
      // Ensure user object has consistent ID property
      const userWithConsistentId = {
        ...response.user,
        id: response.user._id
      };
      
      user.value = userWithConsistentId;
      token.value = response.token;
      localStorage.setItem('user', JSON.stringify(userWithConsistentId));
      localStorage.setItem('token', response.token);
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  async function fetchCurrentUser() {
    try {
      loading.value = true;
      error.value = null;
      if (!token.value) return null;
      
      const response = await authService.getCurrentUser();
      
      // Ensure user object has consistent ID property
      const userWithConsistentId = {
        ...response.user,
        id: response.user.id || response.user._id
      };
      
      user.value = userWithConsistentId;
      localStorage.setItem('user', JSON.stringify(userWithConsistentId));
      return userWithConsistentId;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch user data';
      // If unauthorized, log out
      if (err.response?.status === 401) {
        logout();
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isLoggedIn,
    isAdmin,
    userId,
    register,
    login,
    logout,
    fetchCurrentUser,
  };
}); 