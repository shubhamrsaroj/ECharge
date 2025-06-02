import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import reviewService from '@/services/review.service';

export const useReviewStore = defineStore('reviews', () => {
  // State
  const reviews = ref([]);
  const userReview = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0;
    const sum = reviews.value.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.value.length).toFixed(1);
  });

  const hasUserReviewed = computed(() => {
    return userReview.value !== null;
  });

  // Actions
  async function fetchStationReviews(stationId) {
    try {
      loading.value = true;
      error.value = null;
      const response = await reviewService.getStationReviews(stationId);
      reviews.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch reviews';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUserReview(stationId) {
    try {
      loading.value = true;
      error.value = null;
      const response = await reviewService.getUserReview(stationId);
      userReview.value = response.data || null;
      return userReview.value;
    } catch (err) {
      console.log('Error fetching user review:', err);
      error.value = err.response?.data?.message || 'Failed to fetch user review';
      userReview.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function addReview(stationId, reviewData) {
    try {
      loading.value = true;
      error.value = null;
      const response = await reviewService.addReview(stationId, reviewData);
      
      // Add to reviews array
      reviews.value.unshift(response.data);
      userReview.value = response.data;
      
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add review';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateReview(stationId, reviewId, reviewData) {
    try {
      loading.value = true;
      error.value = null;
      const response = await reviewService.updateReview(stationId, reviewId, reviewData);
      
      // Update in reviews array
      const index = reviews.value.findIndex(r => r._id === reviewId);
      if (index !== -1) {
        reviews.value[index] = response.data;
      }
      
      // Update user review if it's the same
      if (userReview.value && userReview.value._id === reviewId) {
        userReview.value = response.data;
      }
      
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update review';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteReview(stationId, reviewId) {
    try {
      loading.value = true;
      error.value = null;
      await reviewService.deleteReview(stationId, reviewId);
      
      // Remove from reviews array
      reviews.value = reviews.value.filter(r => r._id !== reviewId);
      
      // Clear user review if it's the same
      if (userReview.value && userReview.value._id === reviewId) {
        userReview.value = null;
      }
      
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete review';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    reviews.value = [];
    userReview.value = null;
    error.value = null;
  }

  return {
    reviews,
    userReview,
    loading,
    error,
    averageRating,
    hasUserReviewed,
    fetchStationReviews,
    fetchUserReview,
    addReview,
    updateReview,
    deleteReview,
    reset
  };
}); 