<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white"><span class="text-primary-400 text-shadow-neon">My</span> Bookmarks</h1>
      <p class="text-gray-400 mt-2">Manage your favorite charging stations</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-10 w-10 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-6" role="alert">
      <span class="block sm:inline">{{ error }}</span>
      <button @click="fetchBookmarks" class="mt-2 btn btn-primary text-sm">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="bookmarks.length === 0" class="bg-dark-300 p-8 rounded-lg shadow-md text-center border border-dark-100">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-primary-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      <h2 class="text-xl font-bold mb-2 text-primary-400">No Bookmarks Yet</h2>
      <p class="text-gray-300 mb-4">
        You haven't bookmarked any charging stations yet.
      </p>
      <router-link to="/stations" class="btn btn-primary">
        Browse Stations
      </router-link>
    </div>

    <!-- Bookmarks List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="bookmark in bookmarks" :key="bookmark._id" class="bg-dark-300 rounded-lg shadow-md overflow-hidden border border-dark-100 hover:border-primary-400 transition-colors">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-semibold text-primary-400">{{ bookmark.station.name }}</h3>
              <p class="text-gray-400 mt-1">{{ bookmark.station.location.city }}, {{ bookmark.station.location.state }}</p>
            </div>
            <span class="status-badge" :class="getStatusClass(bookmark.station.status)">
              {{ capitalizeFirst(bookmark.station.status) }}
            </span>
          </div>
          
          <div class="mt-4 space-y-2">
            <div class="flex items-center text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              {{ bookmark.station.location.address }}
            </div>
            
            <div class="flex items-center text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
              </svg>
              {{ bookmark.station.powerOutput }} kW
            </div>
            
            <div class="flex flex-wrap gap-2 mt-2">
              <span v-for="(connector, index) in bookmark.station.connectorTypes" :key="index" class="bg-dark-200 text-primary-400 text-xs px-2 py-1 rounded">
                {{ connector }}
              </span>
            </div>
          </div>
          
          <div class="mt-6 flex justify-between">
            <router-link :to="`/stations/${bookmark.station._id}`" class="btn btn-secondary">
              View Details
            </router-link>
            <button @click="removeBookmark(bookmark.station._id)" class="btn btn-outline-danger flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBookmarkStore } from '@/store/bookmarks';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const bookmarkStore = useBookmarkStore();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref('');

// Check if user is logged in
onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  
  await fetchBookmarks();
});

const bookmarks = computed(() => bookmarkStore.bookmarks);

const fetchBookmarks = async () => {
  try {
    loading.value = true;
    error.value = '';
    await bookmarkStore.fetchUserBookmarks();
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load bookmarks';
    console.error('Error fetching bookmarks:', err);
  } finally {
    loading.value = false;
  }
};

const removeBookmark = async (stationId) => {
  if (!confirm('Are you sure you want to remove this bookmark?')) return;
  
  try {
    loading.value = true;
    await bookmarkStore.removeBookmark(stationId);
    // Success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed bottom-4 right-4 bg-green-900 text-green-100 px-4 py-2 rounded shadow-lg';
    successMessage.textContent = 'Bookmark removed successfully';
    document.body.appendChild(successMessage);
    setTimeout(() => successMessage.remove(), 3000);
  } catch (err) {
    console.error('Error removing bookmark:', err);
    
    // Show error message
    let errorMsg = 'Failed to remove bookmark';
    if (err.response?.status === 403) {
      errorMsg = 'You are not authorized to remove this bookmark';
    } else if (err.response?.status === 404) {
      errorMsg = 'Bookmark not found';
    } else if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }
    
    // Display error message
    const errorElement = document.createElement('div');
    errorElement.className = 'fixed bottom-4 right-4 bg-red-900 text-red-100 px-4 py-2 rounded shadow-lg';
    errorElement.textContent = errorMsg;
    document.body.appendChild(errorElement);
    setTimeout(() => errorElement.remove(), 5000);
    
    // Refresh bookmarks to ensure UI is in sync with server
    await fetchBookmarks();
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'status-active';
    case 'inactive':
      return 'status-inactive';
    case 'maintenance':
      return 'status-maintenance';
    default:
      return 'status-inactive';
  }
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
</script>

<style scoped>
.status-badge {
  @apply px-2 py-1 text-xs font-medium rounded-full;
}
.status-active {
  @apply bg-green-900 text-green-300 border border-green-700;
}
.status-inactive {
  @apply bg-gray-800 text-gray-300 border border-gray-700;
}
.status-maintenance {
  @apply bg-yellow-900 text-yellow-300 border border-yellow-700;
}

.btn-outline-danger {
  @apply border border-red-500 text-red-400 hover:bg-red-900/20 hover:border-red-400;
}
</style> 