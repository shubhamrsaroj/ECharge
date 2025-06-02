<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-dark-300 border border-red-600 text-red-400 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{{ error }}</span>
      <button @click="fetchStation" class="mt-2 btn btn-primary text-sm">Try Again</button>
    </div>

    <!-- Station Details -->
    <div v-else-if="station" class="bg-dark-300 rounded-lg shadow-md overflow-hidden border border-dark-100">
      <!-- Header -->
      <div class="bg-dark-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between border-b border-dark-100">
        <div class="flex items-center mb-4 md:mb-0">
          <router-link to="/stations" class="text-primary-400 hover:text-primary-500 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
          <h1 class="text-2xl font-bold text-primary-400">{{ station.name }}</h1>
          <span class="status-badge ml-4" :class="station.status === 'active' ? 'status-active' : 'status-inactive'">
            {{ capitalizeFirst(station.status) }}
          </span>
        </div>
        <div class="flex space-x-3">
          <button 
            v-if="isLoggedIn" 
            @click="toggleBookmark" 
            class="btn btn-secondary flex items-center"
            :class="{'btn-outline-primary': isStationBookmarked}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path v-if="isStationBookmarked" d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              <path v-else fill-rule="evenodd" d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4zm4 2a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            {{ isStationBookmarked ? 'Bookmarked' : 'Bookmark' }}
          </button>
          <a :href="`https://www.google.com/maps/dir/?api=1&destination=${station.location.coordinates[1]},${station.location.coordinates[0]}`" 
            target="_blank" rel="noopener noreferrer" 
            class="btn btn-secondary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clip-rule="evenodd" />
            </svg>
            Get Directions
          </a>
          <router-link v-if="isLoggedIn && (isAdmin || isOwner)" :to="`/stations/edit/${station._id}`" class="btn btn-primary">
            Edit Station
          </router-link>
        </div>
      </div>

      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column: Location & Details -->
          <div class="lg:col-span-2">
            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4 text-primary-400">Location</h2>
              <div class="bg-dark-200 p-4 rounded-lg border border-dark-100">
                <p class="text-gray-300">{{ station.location.address }}</p>
                <p class="text-gray-300">{{ station.location.city }}, {{ station.location.state }} {{ station.location.zipCode }}</p>
                <p class="text-gray-300">{{ station.location.country }}</p>
                <p class="mt-2 text-sm text-gray-400">
                  Coordinates: {{ station.location.coordinates[1] }}, {{ station.location.coordinates[0] }}
                </p>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4 text-primary-400">Technical Details</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-dark-200 p-4 rounded-lg border border-dark-100">
                  <h3 class="font-medium text-primary-300 mb-2">Power Output</h3>
                  <p class="text-2xl font-bold text-primary-400">{{ station.powerOutput }} kW</p>
                </div>
                <div class="bg-dark-200 p-4 rounded-lg border border-dark-100">
                  <h3 class="font-medium text-primary-300 mb-2">Opening Hours</h3>
                  <p class="text-gray-300">{{ station.openingHours }}</p>
                </div>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4 text-primary-400">Connector Types</h2>
              <div class="flex flex-wrap gap-3">
                <div v-for="connector in station.connectorTypes" :key="connector" class="bg-dark-200 text-primary-400 border border-primary-500 px-4 py-2 rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                  </svg>
                  {{ connector }}
                </div>
              </div>
            </div>

            <div class="mb-8" v-if="station.amenities && station.amenities.length > 0">
              <h2 class="text-xl font-semibold mb-4 text-primary-400">Amenities</h2>
              <div class="flex flex-wrap gap-3">
                <div v-for="amenity in station.amenities" :key="amenity" class="bg-dark-200 text-primary-400 border border-primary-500 px-4 py-2 rounded-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  {{ amenity }}
                </div>
              </div>
            </div>

            <!-- Reviews Section -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-primary-400">Reviews</h2>
                <div class="flex items-center">
                  <div class="text-primary-400 text-lg mr-2">
                    <span v-for="i in 5" :key="i" :class="i <= averageRating ? 'text-primary-400' : 'text-gray-500'">★</span>
                  </div>
                  <span class="text-white font-medium">{{ averageRating }}/5</span>
                  <span class="text-gray-400 ml-2">({{ reviews.length }} reviews)</span>
                </div>
              </div>

              <!-- User Review Form -->
              <div v-if="isLoggedIn && !reviewFormVisible && !hasUserReviewed">
                <button @click="reviewFormVisible = true" class="btn btn-primary mb-6">
                  Write a Review
                </button>
              </div>

              <review-form
                v-if="isLoggedIn && (reviewFormVisible || editingReview)"
                :initial-rating="editingReview ? userReview.rating : 0"
                :initial-comment="editingReview ? userReview.comment : ''"
                :loading="reviewLoading"
                :is-editing="editingReview"
                @submit="handleReviewSubmit"
                @cancel="cancelReviewEdit"
              />

              <!-- Reviews List -->
              <review-list
                :reviews="reviews"
                :loading="reviewsLoading"
                @edit="startEditingReview"
                @delete="handleDeleteReview"
              />
            </div>
          </div>

          <!-- Right Column: Map & Pricing -->
          <div>
            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4 text-primary-400">Map</h2>
              <div id="station-map" class="h-64 rounded-lg shadow-md overflow-hidden border border-dark-100"></div>
            </div>

            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4 text-primary-400">Pricing</h2>
              <div class="bg-dark-200 p-4 rounded-lg border border-dark-100">
                <div v-if="station.pricing.perKwh > 0" class="mb-2">
                  <span class="font-medium text-primary-300">Per kWh:</span>
                  <span class="text-gray-300 ml-2">{{ station.pricing.perKwh }} {{ station.pricing.currency }}</span>
                </div>
                <div v-if="station.pricing.perMinute > 0">
                  <span class="font-medium text-primary-300">Per Minute:</span>
                  <span class="text-gray-300 ml-2">{{ station.pricing.perMinute }} {{ station.pricing.currency }}</span>
                </div>
                <div v-if="station.pricing.perKwh === 0 && station.pricing.perMinute === 0" class="text-primary-400 font-medium">
                  Free Charging
                </div>
              </div>
            </div>

            <div class="mb-8">
              <h2 class="text-xl font-semibold mb-4 text-primary-400">Owner</h2>
              <div class="bg-dark-200 p-4 rounded-lg border border-dark-100">
                <p class="font-medium text-gray-300">{{ station.owner?.name || 'Unknown' }}</p>
                <p v-if="station.owner?.email" class="text-gray-400 mt-1">{{ station.owner.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="bg-dark-300 p-8 rounded-lg shadow-md text-center border border-dark-100">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-primary-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-bold mb-2 text-primary-400">Charging Station Not Found</h2>
      <p class="text-gray-300 mb-4">
        The charging station you're looking for could not be found.
      </p>
      <router-link to="/stations" class="btn btn-primary">
        View All Stations
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStationStore } from '@/store/stations';
import { useAuthStore } from '@/store/auth';
import { useBookmarkStore } from '@/store/bookmarks';
import { useReviewStore } from '@/store/reviews';
import ReviewForm from '@/components/review/ReviewForm.vue';
import ReviewList from '@/components/review/ReviewList.vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const route = useRoute();
const stationStore = useStationStore();
const authStore = useAuthStore();
const bookmarkStore = useBookmarkStore();
const reviewStore = useReviewStore();

const loading = ref(true);
const error = ref('');
const station = ref(null);
const map = ref(null);

// Bookmark state
const bookmarkLoading = ref(false);
const isStationBookmarked = ref(false);

// Review state
const reviewsLoading = ref(false);
const reviewLoading = ref(false);
const reviewFormVisible = ref(false);
const editingReview = ref(false);

const isLoggedIn = computed(() => authStore.isLoggedIn);
const isAdmin = computed(() => authStore.isAdmin);
const isOwner = computed(() => {
  return authStore.user && station.value?.owner && authStore.user.id === station.value.owner._id;
});

// Reviews getters
const reviews = computed(() => reviewStore.reviews);
const userReview = computed(() => reviewStore.userReview);
const hasUserReviewed = computed(() => reviewStore.hasUserReviewed);
const averageRating = computed(() => reviewStore.averageRating);

onMounted(() => {
  fetchStation();
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
  // Reset review store when leaving the page
  reviewStore.reset();
});

const fetchStation = async () => {
  const stationId = route.params.id;
  
  try {
    loading.value = true;
    error.value = '';
    
    const data = await stationStore.fetchStationById(stationId);
    station.value = data;
    
    // Initialize map
    initMap();
    
    // If user is logged in, check bookmark status and fetch reviews
    if (authStore.isLoggedIn) {
      checkBookmarkStatus();
      fetchReviews();
    } else {
      // If not logged in, just fetch reviews
      fetchReviews();
    }
    
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load station details';
    console.error('Error fetching station:', err);
  } finally {
    loading.value = false;
  }
};

const initMap = () => {
  if (!station.value || !station.value.location.coordinates) return;
  
  // Wait for DOM to be ready
  setTimeout(() => {
    if (map.value) map.value.remove();
    
    const lat = station.value.location.coordinates[1];
    const lng = station.value.location.coordinates[0];
    
    map.value = L.map('station-map').setView([lat, lng], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.value);
    
    // Create popup content with reviews
    let popupContent = `
      <div style="font-family: 'Arial', sans-serif; min-width: 250px;">
        <h3 style="margin: 0; padding: 10px; background: linear-gradient(135deg, #22c55e, #10b981); 
            color: white; border-radius: 5px 5px 0 0; font-size: 16px; font-weight: bold;">
          ${station.value.name}
        </h3>
        <div style="padding: 10px;">
          <p style="margin: 5px 0; color: #334155;"><strong>Address:</strong> ${station.value.location.address}</p>
    `;
    
    // Add reviews section if available
    if (reviews.value && reviews.value.length > 0) {
      // Show average rating
      const avgRating = averageRating.value;
      const stars = '★'.repeat(Math.floor(avgRating)) + (avgRating % 1 >= 0.5 ? '★' : '☆') + '☆'.repeat(4 - Math.floor(avgRating));
      
      popupContent += `
        <div style="margin-top: 10px; border-top: 1px solid #e5e7eb; padding-top: 8px;">
          <h4 style="margin: 0 0 8px 0; color: #334155; font-weight: bold;">Reviews</h4>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="color: #22c55e; font-weight: bold;">${stars}</span>
            <span style="color: #6b7280;">${avgRating}/5 (${reviews.value.length} reviews)</span>
          </div>
      `;
      
      // Show up to 2 most recent reviews
      const recentReviews = reviews.value.slice(0, 2);
      recentReviews.forEach(review => {
        const reviewStars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const date = new Date(review.createdAt).toLocaleDateString();
        
        popupContent += `
          <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #22c55e; font-weight: bold;">${reviewStars}</span>
              <small style="color: #6b7280;">${date}</small>
            </div>
            <p style="margin: 3px 0 0 0; color: #334155; font-size: 13px;">
              ${review.user?.name || 'Anonymous'}: ${review.comment || 'No comment'}
            </p>
          </div>
        `;
      });
      
      popupContent += `</div>`;
    } else {
      popupContent += `
        <div style="margin-top: 10px; border-top: 1px solid #e5e7eb; padding-top: 8px;">
          <p style="margin: 5px 0; color: #6b7280; font-style: italic;">No reviews yet</p>
        </div>
      `;
    }
    
    popupContent += `
        </div>
      </div>
    `;
    
    L.marker([lat, lng]).addTo(map.value)
      .bindPopup(popupContent)
      .openPopup();
  }, 100);
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Bookmark functions
const checkBookmarkStatus = async () => {
  if (!authStore.isLoggedIn || !station.value) return;
  
  try {
    bookmarkLoading.value = true;
    console.log('Checking bookmark status for station:', station.value._id);
    console.log('Current user:', authStore.user?.id);
    
    // First try to get the specific bookmark
    const bookmark = await bookmarkStore.getUserBookmarkForStation(station.value._id);
    if (bookmark) {
      console.log('Found bookmark:', bookmark);
      isStationBookmarked.value = true;
      return;
    }
    
    // Fall back to the check endpoint if needed
    const status = await bookmarkStore.checkBookmarkStatus(station.value._id);
    isStationBookmarked.value = status;
  } catch (err) {
    console.error('Error checking bookmark status:', err);
    isStationBookmarked.value = false;
  } finally {
    bookmarkLoading.value = false;
  }
};

const toggleBookmark = async () => {
  if (!authStore.isLoggedIn || !station.value) return;
  
  try {
    bookmarkLoading.value = true;
    await bookmarkStore.toggleBookmark(station.value._id);
    isStationBookmarked.value = !isStationBookmarked.value;
  } catch (err) {
    console.error('Error toggling bookmark:', err);
    
    // If we get a 403 or 404, refresh the bookmark status
    if (err.response?.status === 403 || err.response?.status === 404) {
      await checkBookmarkStatus();
    }
    
    // Show error message to user
    alert(err.response?.data?.message || 'Failed to update bookmark. Please try again.');
  } finally {
    bookmarkLoading.value = false;
  }
};

// Review functions
const fetchReviews = async () => {
  if (!station.value) return;
  
  try {
    reviewsLoading.value = true;
    await reviewStore.fetchStationReviews(station.value._id);
    
    // If user is logged in, check if they have already reviewed
    if (authStore.isLoggedIn) {
      await reviewStore.fetchUserReview(station.value._id);
    }
  } catch (err) {
    console.error('Error fetching reviews:', err);
  } finally {
    reviewsLoading.value = false;
  }
};

const handleReviewSubmit = async (reviewData) => {
  if (!authStore.isLoggedIn || !station.value) return;
  
  try {
    reviewLoading.value = true;
    
    if (editingReview.value && userReview.value) {
      await reviewStore.updateReview(station.value._id, userReview.value._id, reviewData);
    } else {
      await reviewStore.addReview(station.value._id, reviewData);
    }
    
    // Reset form state
    reviewFormVisible.value = false;
    editingReview.value = false;
  } catch (err) {
    console.error('Error submitting review:', err);
  } finally {
    reviewLoading.value = false;
  }
};

const startEditingReview = (review) => {
  editingReview.value = true;
  reviewFormVisible.value = false;
};

const cancelReviewEdit = () => {
  editingReview.value = false;
  reviewFormVisible.value = false;
};

const handleDeleteReview = async (reviewId) => {
  if (!authStore.isLoggedIn || !station.value) return;
  
  if (!confirm('Are you sure you want to delete this review?')) return;
  
  try {
    await reviewStore.deleteReview(station.value._id, reviewId);
  } catch (err) {
    console.error('Error deleting review:', err);
  }
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
</style> 