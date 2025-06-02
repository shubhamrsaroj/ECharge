<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Charging Stations Map</h1>
    
    <!-- Map Filters -->
    <div class="bg-dark-300 p-4 rounded-lg shadow-md mb-6 border border-dark-100">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label for="status" class="form-label">Status</label>
          <select id="status" v-model="filters.status" class="form-input">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div>
          <label for="connectorType" class="form-label">Connector Type</label>
          <select id="connectorType" v-model="filters.connectorType" class="form-input">
            <option value="">All Connectors</option>
            <option value="Type1">Type 1</option>
            <option value="Type2">Type 2</option>
            <option value="CHAdeMO">CHAdeMO</option>
            <option value="CCS">CCS</option>
            <option value="Tesla">Tesla</option>
          </select>
        </div>
        <div>
          <label for="minPower" class="form-label">Min Power (kW)</label>
          <input type="number" id="minPower" v-model="filters.minPower" class="form-input" min="0" />
        </div>
        <div class="flex items-end">
          <button @click="applyFilters" class="btn btn-primary w-full">Apply Filters</button>
        </div>
      </div>
    </div>
    
    <!-- Map Container -->
    <div class="bg-dark-300 rounded-lg shadow-md overflow-hidden border border-dark-100">
      <div id="map" class="h-[600px] w-full"></div>
    </div>
    
    <!-- Selected Station Details -->
    <div v-if="selectedStation" class="mt-6 bg-dark-300 p-6 rounded-lg shadow-md border border-dark-100">
      <div class="flex justify-between items-start">
        <h2 class="text-2xl font-bold mb-4">{{ selectedStation.name }}</h2>
        <span class="status-badge" :class="selectedStation.status === 'active' ? 'status-active' : 'status-inactive'">
          {{ capitalizeFirst(selectedStation.status) }}
        </span>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-2">Location</h3>
          <p class="text-gray-300">{{ selectedStation.location.address }}</p>
          <p class="text-gray-300">{{ selectedStation.location.city }}, {{ selectedStation.location.state }} {{ selectedStation.location.zipCode }}</p>
          <p class="text-gray-300">{{ selectedStation.location.country }}</p>
          
          <h3 class="text-lg font-semibold mt-4 mb-2">Technical Details</h3>
          <p class="text-gray-300"><span class="font-medium text-primary-300">Power Output:</span> {{ selectedStation.powerOutput }} kW</p>
          <div class="mt-2">
            <span class="font-medium text-primary-300">Connector Types:</span>
            <div class="flex flex-wrap gap-2 mt-1">
              <span v-for="connector in selectedStation.connectorTypes" :key="connector" class="bg-dark-200 text-primary-400 border border-primary-500 px-2 py-1 rounded text-sm">
                {{ connector }}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-semibold mb-2">Pricing</h3>
          <p class="text-gray-300" v-if="selectedStation.pricing.perKwh > 0">
            <span class="font-medium text-primary-300">Per kWh:</span> {{ selectedStation.pricing.perKwh }} {{ selectedStation.pricing.currency }}
          </p>
          <p class="text-gray-300" v-if="selectedStation.pricing.perMinute > 0">
            <span class="font-medium text-primary-300">Per Minute:</span> {{ selectedStation.pricing.perMinute }} {{ selectedStation.pricing.currency }}
          </p>
          
          <h3 class="text-lg font-semibold mt-4 mb-2">Opening Hours</h3>
          <p class="text-gray-300">{{ selectedStation.openingHours }}</p>
          
          <h3 class="text-lg font-semibold mt-4 mb-2">Amenities</h3>
          <div v-if="selectedStation.amenities.length > 0" class="flex flex-wrap gap-2">
            <span v-for="amenity in selectedStation.amenities" :key="amenity" class="bg-dark-200 text-primary-400 border border-primary-500 px-2 py-1 rounded text-sm">
              {{ amenity }}
            </span>
          </div>
          <p v-else class="text-gray-400">No amenities listed</p>
        </div>
      </div>
      
      <div class="mt-6 flex space-x-4">
        <a :href="`https://www.google.com/maps/dir/?api=1&destination=${selectedStation.location.coordinates[1]},${selectedStation.location.coordinates[0]}`" 
          target="_blank" rel="noopener noreferrer" 
          class="btn btn-secondary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clip-rule="evenodd" />
          </svg>
          Get Directions
        </a>
        <router-link v-if="isLoggedIn && (isAdmin || isOwner(selectedStation))" :to="`/stations/edit/${selectedStation._id}`" class="btn btn-primary">
          Edit Station
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useStationStore } from '@/store/stations';
import { useAuthStore } from '@/store/auth';
import { useReviewStore } from '@/store/reviews';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const stationStore = useStationStore();
const authStore = useAuthStore();
const reviewStore = useReviewStore();

const map = ref(null);
const markers = ref([]);
const selectedStation = ref(null);
const filters = ref({
  status: '',
  connectorType: '',
  minPower: '',
});
const stationReviews = ref({});

const isLoggedIn = computed(() => authStore.isLoggedIn);
const isAdmin = computed(() => authStore.isAdmin);

// Initialize map
onMounted(async () => {
  // Create map
  map.value = L.map('map').setView([40.7128, -74.0060], 13); // Default to New York City
  
  // Add colorful tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">HOT</a>',
    maxZoom: 19,
  }).addTo(map.value);
  
  // Try to get user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.value.setView([latitude, longitude], 13);
        loadNearbyStations(latitude, longitude);
      },
      () => {
        // If geolocation fails, load all stations
        loadAllStations();
      }
    );
  } else {
    // If geolocation not supported, load all stations
    loadAllStations();
  }
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});

// Load stations near user's location
const loadNearbyStations = async (lat, lng) => {
  try {
    const stations = await stationStore.fetchNearbyStations(lat, lng, 20);
    console.log('Nearby stations loaded:', stations);
    if (stations && stations.length > 0) {
      addStationsToMap(stations);
    } else {
      console.log('No nearby stations found, loading all stations instead');
      loadAllStations();
    }
  } catch (error) {
    console.error('Error loading nearby stations:', error);
    loadAllStations();
  }
};

// Load all stations
const loadAllStations = async () => {
  try {
    await stationStore.fetchStations({ limit: 100 }); // Increase limit to get more stations
    console.log('All stations loaded:', stationStore.stations);
    addStationsToMap(stationStore.stations);
  } catch (error) {
    console.error('Error loading stations:', error);
  }
};

// Fetch reviews for a station
const fetchStationReviews = async (stationId) => {
  try {
    const response = await reviewStore.fetchStationReviews(stationId);
    stationReviews.value[stationId] = response;
    return response;
  } catch (error) {
    console.error(`Error fetching reviews for station ${stationId}:`, error);
    return [];
  }
};

// Generate HTML for reviews to show in popup
const generateReviewsHtml = (station) => {
  const reviews = stationReviews.value[station._id];
  
  if (!reviews || reviews.length === 0) {
    return '<p style="margin: 5px 0; color: #6b7280; font-style: italic;">No reviews yet</p>';
  }
  
  // Show up to 3 reviews in the popup
  const reviewsToShow = reviews.slice(0, 3);
  
  let html = '<div style="margin-top: 10px; border-top: 1px solid #e5e7eb; padding-top: 8px;">';
  html += '<h4 style="margin: 0 0 8px 0; color: #334155; font-weight: bold;">Recent Reviews</h4>';
  
  reviewsToShow.forEach(review => {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const date = new Date(review.createdAt).toLocaleDateString();
    
    html += `
      <div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #22c55e; font-weight: bold;">${stars}</span>
          <small style="color: #6b7280;">${date}</small>
        </div>
        <p style="margin: 3px 0 0 0; color: #334155; font-size: 13px;">
          ${review.user?.name || 'Anonymous'}: ${review.comment || 'No comment'}
        </p>
      </div>
    `;
  });
  
  if (reviews.length > 3) {
    html += `<p style="margin: 0; text-align: center; font-size: 12px; color: #6b7280;">
      + ${reviews.length - 3} more reviews
    </p>`;
  }
  
  html += '</div>';
  return html;
};

// Add stations to map
const addStationsToMap = async (stations) => {
  // Clear existing markers
  markers.value.forEach(marker => map.value.removeLayer(marker));
  markers.value = [];
  
  console.log('Adding stations to map:', stations);
  
  if (!stations || stations.length === 0) {
    console.warn('No stations to add to map');
    return;
  }
  
  // Fetch reviews for all stations in parallel
  await Promise.all(stations.map(station => fetchStationReviews(station._id)));
  
  // Add new markers
  stations.forEach(station => {
    if (!station.location || !station.location.coordinates) {
      console.warn('Station missing coordinates:', station);
      return;
    }
    
    const [lng, lat] = station.location.coordinates;
    
    if (!lng || !lat) {
      console.warn('Invalid coordinates for station:', station);
      return;
    }
    
    // Create marker with custom icon based on status
    const marker = L.marker([lat, lng], {
      icon: getMarkerIcon(station.status),
      title: station.name,
    }).addTo(map.value);
    
    // Add colorful popup with basic info and reviews
    const popupContent = `
      <div style="font-family: 'Arial', sans-serif; min-width: 250px;">
        <h3 style="margin: 0; padding: 10px; background: linear-gradient(135deg, #22c55e, #10b981); 
            color: white; border-radius: 5px 5px 0 0; font-size: 16px; font-weight: bold;">
          ${station.name}
        </h3>
        <div style="padding: 10px;">
          <p style="margin: 5px 0; color: #334155;"><strong>Power:</strong> ${station.powerOutput} kW</p>
          <p style="margin: 5px 0; color: #334155;"><strong>Connectors:</strong> ${station.connectorTypes.join(', ')}</p>
          <p style="margin: 5px 0; color: #334155;"><strong>Status:</strong> 
            <span style="color: ${station.status === 'active' ? '#22c55e' : station.status === 'maintenance' ? '#f59e0b' : '#ef4444'}; font-weight: bold;">
              ${station.status.charAt(0).toUpperCase() + station.status.slice(1)}
            </span>
          </p>
          ${generateReviewsHtml(station)}
          <button onclick="document.querySelector('[data-station-id=\\'${station._id}\\']').click()" 
            style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; 
            padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px; width: 100%;">
            View Details
          </button>
        </div>
      </div>
    `;
    
    marker.bindPopup(popupContent);
    
    // Add click handler
    marker.on('click', () => {
      selectedStation.value = station;
    });
    
    markers.value.push(marker);
  });
  
  // Add a hidden button that can be triggered from the popup
  if (!document.querySelector('.station-detail-triggers')) {
    const triggerContainer = document.createElement('div');
    triggerContainer.className = 'station-detail-triggers';
    triggerContainer.style.display = 'none';
    document.body.appendChild(triggerContainer);
  }
  
  // Add trigger buttons for each station
  const triggerContainer = document.querySelector('.station-detail-triggers');
  triggerContainer.innerHTML = '';
  stations.forEach(station => {
    const button = document.createElement('button');
    button.setAttribute('data-station-id', station._id);
    button.onclick = () => {
      selectedStation.value = station;
    };
    triggerContainer.appendChild(button);
  });
  
  // Fit map to markers if any exist
  if (markers.value.length > 0) {
    const group = L.featureGroup(markers.value);
    map.value.fitBounds(group.getBounds().pad(0.1));
    console.log('Map bounds set to fit all markers');
  } else {
    console.warn('No markers to fit map bounds');
  }
};

// Create custom marker icons based on station status
const getMarkerIcon = (status) => {
  let color;
  switch (status) {
    case 'active':
      color = '#22c55e'; // Green
      break;
    case 'inactive':
      color = '#ef4444'; // Red
      break;
    case 'maintenance':
      color = '#f59e0b'; // Amber
      break;
    default:
      color = '#3b82f6'; // Blue
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Apply filters
const applyFilters = async () => {
  try {
    stationStore.setFilters(filters.value);
    await stationStore.fetchStations();
    addStationsToMap(stationStore.stations);
  } catch (error) {
    console.error('Error applying filters:', error);
  }
};

// Helper functions
const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    case 'maintenance':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const isOwner = (station) => {
  return authStore.user && station.owner && authStore.user.id === station.owner._id;
};

// Update the map tile layer to a more colorful option and add custom marker colors
const initMap = () => {
  if (!selectedStation.value || !selectedStation.value.location.coordinates) return;
  
  // Wait for DOM to be ready
  setTimeout(() => {
    if (map.value) map.value.remove();
    
    const lat = selectedStation.value.location.coordinates[1];
    const lng = selectedStation.value.location.coordinates[0];
    
    map.value = L.map('map').setView([lat, lng], 15);
    
    // Use a more colorful map style
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.value);
    
    // Add a colorful marker
    const marker = L.marker([lat, lng], {
      icon: getMarkerIcon(selectedStation.value.status)
    }).addTo(map.value)
      .bindPopup(`<b>${selectedStation.value.name}</b><br>${selectedStation.value.location.address}`)
      .openPopup();
  }, 100);
};
</script>

<style scoped>
/* Custom map styling */
#map {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid #4ade80;
}

.status-badge {
  @apply px-2 py-1 text-xs font-medium rounded-full;
}

.status-active {
  @apply bg-green-900 text-green-300 border border-green-700;
}

.status-inactive {
  @apply bg-red-900 text-red-300 border border-red-700;
}

.status-maintenance {
  @apply bg-amber-900 text-amber-300 border border-amber-700;
}

/* Make filter section more colorful */
.bg-dark-300 {
  background: linear-gradient(135deg, #1e293b, #0f172a);
}

/* Add colorful hover effect to buttons */
.btn-primary {
  @apply bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700;
  transition: all 0.3s ease;
}

.btn-secondary {
  @apply bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700;
  transition: all 0.3s ease;
}

/* Style the filter inputs */
.form-input {
  @apply border-2 border-blue-500 focus:border-green-500 focus:ring focus:ring-green-300 focus:ring-opacity-50;
}

/* Add animation to selected station */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}

.selectedStation {
  animation: pulse 2s infinite;
}
</style> 