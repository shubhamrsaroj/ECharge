<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6 text-primary-400">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Stats Card 1 -->
      <div class="bg-dark-300 rounded-lg shadow-md p-6 border border-dark-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-primary-400">Your Stations</h2>
          <div class="bg-dark-200 p-2 rounded-full border border-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <div class="flex items-baseline">
          <p class="text-3xl font-bold text-primary-400">{{ userStationsCount }}</p>
          <p class="ml-2 text-sm text-gray-400">stations</p>
        </div>
        <div class="mt-4">
          <router-link to="/stations/add" class="text-primary-400 hover:text-primary-300 font-medium text-sm flex items-center">
            Add New Station
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>
      
      <!-- Stats Card 2 -->
      <div class="bg-dark-300 rounded-lg shadow-md p-6 border border-dark-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-primary-400">Active Stations</h2>
          <div class="bg-dark-200 p-2 rounded-full border border-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div class="flex items-baseline">
          <p class="text-3xl font-bold text-primary-400">{{ activeStationsCount }}</p>
          <p class="ml-2 text-sm text-gray-400">stations</p>
        </div>
        <div class="mt-4">
          <router-link to="/stations?status=active" class="text-primary-400 hover:text-primary-300 font-medium text-sm flex items-center">
            View Active Stations
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>
      
      <!-- Stats Card 3 -->
      <div class="bg-dark-300 rounded-lg shadow-md p-6 border border-dark-100">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-primary-400">Maintenance Required</h2>
          <div class="bg-dark-200 p-2 rounded-full border border-primary-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div class="flex items-baseline">
          <p class="text-3xl font-bold text-primary-400">{{ maintenanceStationsCount }}</p>
          <p class="ml-2 text-sm text-gray-400">stations</p>
        </div>
        <div class="mt-4">
          <router-link to="/stations?status=maintenance" class="text-primary-400 hover:text-primary-300 font-medium text-sm flex items-center">
            View Maintenance Stations
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Your Stations Section -->
    <div class="bg-dark-300 rounded-lg shadow-md overflow-hidden mb-8 border border-dark-100">
      <div class="px-6 py-4 border-b border-dark-200">
        <h2 class="text-xl font-semibold text-primary-400">Your Charging Stations</h2>
      </div>
      
      <div v-if="loading" class="p-6 flex justify-center">
        <svg class="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="error" class="p-6 text-center">
        <p class="text-red-400 mb-2">{{ error }}</p>
        <button @click="fetchUserStations" class="btn btn-primary text-sm">Try Again</button>
      </div>
      
      <div v-else-if="userStations.length === 0" class="p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="text-lg font-medium text-primary-400 mb-2">No Charging Stations Yet</h3>
        <p class="text-gray-400 mb-4">You haven't added any charging stations yet.</p>
        <router-link to="/stations/add" class="btn btn-primary">
          Add Your First Station
        </router-link>
      </div>
      
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-dark-200">
            <thead class="bg-dark-400">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-primary-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-primary-400 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-primary-400 uppercase tracking-wider">
                  Power
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-primary-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-primary-400 uppercase tracking-wider">
                  Connectors
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-primary-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-dark-300 divide-y divide-dark-200">
              <tr v-for="station in userStations" :key="station._id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-200">{{ station.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ station.location.city }}, {{ station.location.state }}</div>
                  <div class="text-sm text-gray-400">{{ station.location.country }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-primary-400">{{ station.powerOutput }} kW</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="status-badge" :class="station.status === 'active' ? 'status-active' : 'status-inactive'">
                    {{ capitalizeFirst(station.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ station.connectorTypes.join(', ') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <router-link :to="`/stations/${station._id}`" class="text-primary-400 hover:text-primary-300">
                      View
                    </router-link>
                    <router-link :to="`/stations/edit/${station._id}`" class="text-primary-400 hover:text-primary-300">
                      Edit
                    </router-link>
                    <button @click="confirmDelete(station)" class="text-red-400 hover:text-red-300">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-dark-300 rounded-lg shadow-xl max-w-md w-full p-6 border border-dark-100">
        <h3 class="text-lg font-medium text-primary-400 mb-4">Confirm Deletion</h3>
        <p class="text-gray-300 mb-6">
          Are you sure you want to delete the charging station "{{ stationToDelete?.name }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelDelete" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="deleteStation" class="btn bg-red-600 text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStationStore } from '@/store/stations';
import { useAuthStore } from '@/store/auth';

const stationStore = useStationStore();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref('');
const userStations = ref([]);
const showDeleteModal = ref(false);
const stationToDelete = ref(null);

// Computed properties for stats
const userStationsCount = computed(() => userStations.value.length);
const activeStationsCount = computed(() => userStations.value.filter(s => s.status === 'active').length);
const maintenanceStationsCount = computed(() => userStations.value.filter(s => s.status === 'maintenance').length);

onMounted(() => {
  fetchUserStations();
});

// Fetch stations owned by the current user
const fetchUserStations = async () => {
  if (!authStore.isLoggedIn) return;
  
  try {
    loading.value = true;
    error.value = '';
    
    // In a real app, you would have an API endpoint to fetch user's stations
    // Here we're simulating it by fetching all stations and filtering
    await stationStore.fetchStations();
    console.log('All stations:', JSON.stringify(stationStore.stations));
    console.log('Current user ID:', authStore.userId);
    
    userStations.value = stationStore.stations.filter(station => {
      console.log(`Station ${station.name} - owner:`, JSON.stringify(station.owner));
      
      // Check if owner is a string ID or an object with _id
      const ownerId = typeof station.owner === 'string' ? station.owner : station.owner?._id;
      console.log(`Station ${station.name} - comparing owner ${ownerId} with user ${authStore.userId}`);
      
      return station.owner && 
        (ownerId === authStore.userId);
    });
    
    console.log('Filtered stations:', userStations.value.length);
  } catch (err) {
    error.value = 'Failed to load your stations. Please try again.';
    console.error('Error fetching user stations:', err);
  } finally {
    loading.value = false;
  }
};

// Delete station functions
const confirmDelete = (station) => {
  stationToDelete.value = station;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  stationToDelete.value = null;
  showDeleteModal.value = false;
};

const deleteStation = async () => {
  if (!stationToDelete.value) return;
  
  try {
    loading.value = true;
    await stationStore.deleteStation(stationToDelete.value._id);
    
    // Remove from local list
    userStations.value = userStations.value.filter(s => s._id !== stationToDelete.value._id);
    
    // Close modal
    cancelDelete();
  } catch (err) {
    error.value = 'Failed to delete station. Please try again.';
    console.error('Error deleting station:', err);
  } finally {
    loading.value = false;
  }
};

// Helper functions
const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-900 text-primary-400';
    case 'inactive':
      return 'bg-gray-700 text-gray-300';
    case 'maintenance':
      return 'bg-yellow-900 text-yellow-400';
    default:
      return 'bg-gray-700 text-gray-300';
  }
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
</script> 