import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import bookmarkService from '@/services/bookmark.service';

export const useBookmarkStore = defineStore('bookmarks', () => {
  // State
  const bookmarks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isBookmarked = computed(() => (stationId) => {
    return bookmarks.value.some(bookmark => bookmark.station._id === stationId);
  });

  // Actions
  async function fetchUserBookmarks() {
    try {
      loading.value = true;
      error.value = null;
      const response = await bookmarkService.getUserBookmarks();
      bookmarks.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch bookmarks';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function addBookmark(stationId) {
    try {
      loading.value = true;
      error.value = null;
      const response = await bookmarkService.addBookmark(stationId);
      
      // Add to bookmarks if not already there
      if (!bookmarks.value.some(b => b.station._id === stationId)) {
        bookmarks.value.push(response.data);
      }
      
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add bookmark';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function removeBookmark(stationId) {
    try {
      loading.value = true;
      error.value = null;
      await bookmarkService.removeBookmark(stationId);
      
      // Remove from bookmarks array
      bookmarks.value = bookmarks.value.filter(b => b.station._id !== stationId);
      
      return true;
    } catch (err) {
      // Handle unauthorized or not found errors
      if (err.response?.status === 403 || err.response?.status === 404) {
        console.error('Not authorized to remove this bookmark or bookmark not found');
        // Refresh bookmarks to get the correct state
        await fetchUserBookmarks();
      }
      error.value = err.response?.data?.message || 'Failed to remove bookmark';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function checkBookmarkStatus(stationId) {
    try {
      loading.value = true;
      error.value = null;
      const response = await bookmarkService.isBookmarked(stationId);
      return response.isBookmarked;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to check bookmark status';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function toggleBookmark(stationId) {
    if (isBookmarked.value(stationId)) {
      return removeBookmark(stationId);
    } else {
      return addBookmark(stationId);
    }
  }

  async function getUserBookmarkForStation(stationId) {
    try {
      loading.value = true;
      error.value = null;
      const response = await bookmarkService.getUserBookmarkForStation(stationId);
      return response.data;
    } catch (err) {
      if (err.response?.status !== 404) {
        error.value = err.response?.data?.message || 'Failed to get bookmark for station';
      }
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    bookmarks,
    loading,
    error,
    isBookmarked,
    fetchUserBookmarks,
    addBookmark,
    removeBookmark,
    checkBookmarkStatus,
    toggleBookmark,
    getUserBookmarkForStation
  };
}); 