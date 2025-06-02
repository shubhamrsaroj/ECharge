<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 class="text-3xl font-bold mb-4 md:mb-0 text-white">Charging Stations</h1>
      <router-link v-if="isLoggedIn" to="/stations/add" class="btn btn-primary flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add New Station
      </router-link>
    </div>

    <!-- Filters -->
    <div class="bg-gray-900 p-4 rounded-lg shadow-md mb-6 border border-gray-800">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label for="status" class="form-label text-gray-300">Status</label>
          <select id="status" v-model="filters.status" class="form-input bg-gray-800 border-gray-700 text-white">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div>
          <label for="connectorType" class="form-label text-gray-300">Connector Type</label>
          <select id="connectorType" v-model="filters.connectorType" class="form-input bg-gray-800 border-gray-700 text-white">
            <option value="">All Connectors</option>
            <option value="Type1">Type 1</option>
            <option value="Type2">Type 2</option>
            <option value="CHAdeMO">CHAdeMO</option>
            <option value="CCS">CCS</option>
            <option value="Tesla">Tesla</option>
          </select>
        </div>
        <div>
          <label for="minPower" class="form-label text-gray-300">Min Power (kW)</label>
          <input type="number" id="minPower" v-model="filters.minPower" class="form-input bg-gray-800 border-gray-700 text-white" min="0" />
        </div>
        <div class="flex items-end space-x-2">
          <button @click="applyFilters" class="btn btn-primary flex-1">Apply Filters</button>
          <button @click="resetFilters" class="btn btn-secondary">Reset</button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-gray-900 border border-red-600 text-red-400 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{{ error }}</span>
      <button @click="fetchStations" class="mt-2 btn btn-primary text-sm">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="stations.length === 0" class="bg-gray-900 p-8 rounded-lg shadow-md text-center border border-gray-800">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h2 class="text-xl font-bold mb-2 text-white">No Charging Stations Found</h2>
      <p class="text-gray-400 mb-4">
        There are no charging stations matching your filters. Try adjusting your filters or add a new station.
      </p>
      <div class="flex justify-center space-x-4">
        <button @click="resetFilters" class="btn btn-secondary">Reset Filters</button>
        <router-link v-if="isLoggedIn" to="/stations/add" class="btn btn-primary">
          Add New Station
        </router-link>
      </div>
    </div>

    <!-- Stations List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="station in stations" :key="station._id" class="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-800 transition-transform duration-300 hover:transform hover:scale-105">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h2 class="text-xl font-bold mb-2 text-white">{{ station.name }}</h2>
            <span class="status-badge" :class="station.status === 'active' ? 'bg-green-900 text-green-400 border border-green-500' : 'bg-gray-800 text-red-400 border border-red-500'">
              {{ capitalizeFirst(station.status) }}
            </span>
          </div>
          
          <p class="text-gray-400 mb-4">
            {{ station.location.address }}, {{ station.location.city }}
          </p>
          
          <div class="flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
            </svg>
            <span class="font-medium text-green-400">{{ station.powerOutput }} kW</span>
          </div>
          
          <div class="mb-4">
            <div class="text-sm font-medium text-gray-300 mb-1">Connector Types:</div>
            <div class="flex flex-wrap gap-2">
              <span v-for="connector in station.connectorTypes" :key="connector" class="bg-gray-800 text-green-400 border border-green-500 px-2 py-1 rounded text-sm">
                {{ connector }}
              </span>
            </div>
          </div>
          
          <div class="flex space-x-2 mt-4">
            <router-link :to="`/stations/${station._id}`" class="btn btn-secondary flex-1 text-center">
              View Details
            </router-link>
            <router-link v-if="isLoggedIn && (isAdmin || isOwner(station))" :to="`/stations/edit/${station._id}`" class="btn btn-primary">
              Edit
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="stations.length > 0" class="mt-8 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button 
          @click="prevPage" 
          :disabled="pagination.page === 1" 
          :class="[
            'pagination-btn',
            pagination.page === 1 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-800'
          ]"
        >
          Previous
        </button>
        
        <div v-for="page in paginationRange" :key="page" class="flex items-center">
          <button 
            @click="goToPage(page)" 
            :class="[
              'pagination-btn',
              pagination.page === page 
                ? 'bg-green-900 text-green-400 border-green-500' 
                : 'hover:bg-gray-800'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="nextPage" 
          :disabled="pagination.page === pagination.totalPages" 
          :class="[
            'pagination-btn',
            pagination.page === pagination.totalPages 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-800'
          ]"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStationStore } from '@/store/stations';
import { useAuthStore } from '@/store/auth';

const stationStore = useStationStore();
const authStore = useAuthStore();

const stations = computed(() => stationStore.stations);
const loading = computed(() => stationStore.loading);
const error = computed(() => stationStore.error);
const filters = ref({ ...stationStore.filters });
const pagination = computed(() => stationStore.pagination);

const isLoggedIn = computed(() => authStore.isLoggedIn);
const isAdmin = computed(() => authStore.isAdmin);

// Pagination range (show 5 pages max)
const paginationRange = computed(() => {
  const totalPages = pagination.value.totalPages;
  const currentPage = pagination.value.page;
  
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }
  
  if (currentPage >= totalPages - 2) {
    return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  
  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
});

// Fetch stations on mount
onMounted(() => {
  fetchStations();
});

// Watch for filter changes from other components
watch(() => stationStore.filters, (newFilters) => {
  filters.value = { ...newFilters };
}, { deep: true });

// Fetch stations
const fetchStations = async () => {
  try {
    await stationStore.fetchStations();
  } catch (error) {
    console.error('Error fetching stations:', error);
  }
};

// Apply filters
const applyFilters = async () => {
  try {
    stationStore.setFilters(filters.value);
    await stationStore.fetchStations();
  } catch (error) {
    console.error('Error applying filters:', error);
  }
};

// Reset filters
const resetFilters = async () => {
  filters.value = {
    status: '',
    connectorType: '',
    minPower: '',
    maxPower: '',
  };
  stationStore.resetFilters();
  await stationStore.fetchStations();
};

// Pagination methods
const prevPage = async () => {
  if (pagination.value.page > 1) {
    stationStore.setPage(pagination.value.page - 1);
    await stationStore.fetchStations();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const nextPage = async () => {
  if (pagination.value.page < pagination.value.totalPages) {
    stationStore.setPage(pagination.value.page + 1);
    await stationStore.fetchStations();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const goToPage = async (page) => {
  stationStore.setPage(page);
  await stationStore.fetchStations();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Helper functions
const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-900 text-green-400 border border-green-500';
    case 'inactive':
      return 'bg-gray-800 text-red-400 border border-red-500';
    case 'maintenance':
      return 'bg-yellow-900 text-yellow-400 border border-yellow-500';
    default:
      return 'bg-gray-800 text-gray-400 border border-gray-600';
  }
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const isOwner = (station) => {
  return authStore.user && station.owner && authStore.user.id === station.owner._id;
};
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium mb-1;
}

.form-input {
  @apply block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm;
}

.btn {
  @apply py-2 px-4 rounded-md font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300;
}

.btn-primary {
  @apply bg-green-500 text-black hover:bg-green-400;
}

.btn-secondary {
  @apply bg-gray-800 text-green-400 border border-green-500 hover:bg-gray-700;
}

.status-badge {
  @apply px-2 py-1 rounded-md text-xs font-medium;
}

.pagination-btn {
  @apply px-3 py-1 border border-gray-700 rounded-md bg-gray-900 text-gray-300;
}
</style> 