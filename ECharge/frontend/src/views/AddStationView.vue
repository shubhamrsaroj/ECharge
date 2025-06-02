<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center mb-6">
      <router-link to="/stations" class="text-primary-400 hover:text-primary-300 mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </router-link>
      <h1 class="text-3xl font-bold text-white"><span class="text-primary-400 text-shadow-neon">Add</span> Charging Station</h1>
    </div>

    <div class="bg-dark-300 rounded-lg shadow-md overflow-hidden border border-dark-200">
      <div class="p-6">
        <form @submit.prevent="submitForm" class="text-gray-300">
          <!-- Error Alert -->
          <div v-if="error" class="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-6" role="alert">
            <span class="block sm:inline">{{ error }}</span>
          </div>

          <!-- Basic Information -->
          <div class="mb-8 bg-dark-400 p-6 rounded-lg border border-dark-200">
            <h2 class="text-xl font-semibold mb-4 text-primary-400">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="form-label text-gray-300">Station Name <span class="text-primary-400">*</span></label>
                <input type="text" id="name" v-model="form.name" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" required />
              </div>
              <div>
                <label for="status" class="form-label text-gray-300">Status <span class="text-primary-400">*</span></label>
                <select id="status" v-model="form.status" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" required>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <div class="mb-8 bg-dark-400 p-6 rounded-lg border border-dark-200">
            <h2 class="text-xl font-semibold mb-4 text-primary-400">Location</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="address" class="form-label text-gray-300">Address <span class="text-primary-400">*</span></label>
                <input type="text" id="address" v-model="form.location.address" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" required />
              </div>
              <div>
                <label for="city" class="form-label text-gray-300">City <span class="text-primary-400">*</span></label>
                <input type="text" id="city" v-model="form.location.city" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" required />
              </div>
              <div>
                <label for="state" class="form-label text-gray-300">State/Province <span class="text-primary-400">*</span></label>
                <input type="text" id="state" v-model="form.location.state" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" required />
              </div>
              <div>
                <label for="zipCode" class="form-label text-gray-300">ZIP/Postal Code <span class="text-primary-400">*</span></label>
                <input type="text" id="zipCode" v-model="form.location.zipCode" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" required />
              </div>
              <div>
                <label for="country" class="form-label text-gray-300">Country <span class="text-primary-400">*</span></label>
                <input type="text" id="country" v-model="form.location.country" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" required />
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-medium mb-2 text-white">Coordinates <span class="text-primary-400">*</span></h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="latitude" class="form-label text-gray-300">Latitude</label>
                  <input type="number" id="latitude" v-model="latitude" step="0.000001" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" required />
                </div>
                <div>
                  <label for="longitude" class="form-label text-gray-300">Longitude</label>
                  <input type="number" id="longitude" v-model="longitude" step="0.000001" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" required />
                </div>
              </div>
              <div class="mt-4">
                <button type="button" @click="getCurrentLocation" class="btn btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  Use My Current Location
                </button>
              </div>
            </div>
          </div>

          <!-- Technical Details -->
          <div class="mb-8 bg-dark-400 p-6 rounded-lg border border-dark-200">
            <h2 class="text-xl font-semibold mb-4 text-primary-400">Technical Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="powerOutput" class="form-label text-gray-300">Power Output (kW) <span class="text-primary-400">*</span></label>
                <input type="number" id="powerOutput" v-model="form.powerOutput" min="0" step="0.1" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" required />
              </div>
              <div>
                <label for="openingHours" class="form-label text-gray-300">Opening Hours</label>
                <input type="text" id="openingHours" v-model="form.openingHours" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" placeholder="e.g., 24/7 or Mon-Fri 9:00-18:00" />
              </div>
            </div>

            <div class="mt-6">
              <label class="form-label text-gray-300">Connector Types <span class="text-primary-400">*</span></label>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                <div v-for="type in connectorTypes" :key="type" class="flex items-center">
                  <input type="checkbox" :id="type" :value="type" v-model="form.connectorTypes" class="h-4 w-4 text-primary-400 focus:ring-primary-400 border-dark-200 rounded" />
                  <label :for="type" class="ml-2 block text-sm text-gray-300">{{ type }}</label>
                </div>
              </div>
              <p v-if="form.connectorTypes.length === 0" class="mt-2 text-sm text-red-400">Please select at least one connector type</p>
            </div>
          </div>

          <!-- Pricing -->
          <div class="mb-8 bg-dark-400 p-6 rounded-lg border border-dark-200">
            <h2 class="text-xl font-semibold mb-4 text-primary-400">Pricing</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="perKwh" class="form-label text-gray-300">Price per kWh</label>
                <input type="number" id="perKwh" v-model="form.pricing.perKwh" min="0" step="0.01" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" />
              </div>
              <div>
                <label for="perMinute" class="form-label text-gray-300">Price per Minute</label>
                <input type="number" id="perMinute" v-model="form.pricing.perMinute" min="0" step="0.01" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" />
              </div>
              <div>
                <label for="currency" class="form-label text-gray-300">Currency</label>
                <input type="text" id="currency" v-model="form.pricing.currency" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" placeholder="e.g., USD, EUR" />
              </div>
            </div>
          </div>

          <!-- Amenities -->
          <div class="mb-8 bg-dark-400 p-6 rounded-lg border border-dark-200">
            <h2 class="text-xl font-semibold mb-4 text-primary-400">Amenities</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="amenity in availableAmenities" :key="amenity" class="flex items-center">
                <input type="checkbox" :id="'amenity-' + amenity" :value="amenity" v-model="form.amenities" class="h-4 w-4 text-primary-400 focus:ring-primary-400 border-dark-200 rounded" />
                <label :for="'amenity-' + amenity" class="ml-2 block text-sm text-gray-300">{{ amenity }}</label>
              </div>
            </div>
          </div>

          <!-- Photos -->
          <div class="mb-8 bg-dark-400 p-6 rounded-lg border border-dark-200">
            <h2 class="text-xl font-semibold mb-4 text-primary-400">Photos</h2>
            <div>
              <label for="photos" class="form-label text-gray-300">Photo URLs (one per line)</label>
              <textarea id="photos" v-model="photosText" rows="3" class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20" placeholder="Enter photo URLs, one per line"></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Adding Station...' : 'Add Charging Station' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStationStore } from '@/store/stations';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const stationStore = useStationStore();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref('');

// Form data
const form = reactive({
  name: '',
  status: 'active',
  location: {
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    coordinates: [0, 0], // [longitude, latitude]
    type: 'Point',
  },
  powerOutput: 0,
  connectorTypes: [],
  openingHours: '24/7',
  pricing: {
    perKwh: 0,
    perMinute: 0,
    currency: 'USD',
  },
  amenities: [],
  photos: [],
  owner: null,
});

// For easier handling of coordinates
const latitude = ref(0);
const longitude = ref(0);

// For easier handling of photos
const photosText = ref('');

// Available options
const connectorTypes = ['Type1', 'Type2', 'CHAdeMO', 'CCS', 'Tesla'];
const availableAmenities = ['Restroom', 'Cafe', 'WiFi', 'Shopping', 'Restaurant', 'Parking', 'Lounge'];

// Get current location
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
};

// Submit form
const submitForm = async () => {
  try {
    // Validate form
    if (!form.name || !form.location.address || !form.location.city || 
        !form.location.state || !form.location.zipCode || !form.location.country || 
        form.connectorTypes.length === 0) {
      error.value = 'Please fill in all required fields.';
      return;
    }

    loading.value = true;
    error.value = '';

    // Update coordinates and photos before submission
    form.location.coordinates = [parseFloat(longitude.value), parseFloat(latitude.value)];
    
    if (photosText.value) {
      form.photos = photosText.value.split('\n').filter(url => url.trim() !== '');
    }

    // Set the owner to current user's ID using the consistent userId getter
    form.owner = authStore.userId;
    console.log('Setting station owner to:', form.owner);

    // Submit to API
    const result = await stationStore.createStation(form);
    console.log('Created station:', result);
    
    // Redirect to the new station's details page
    router.push(`/stations/${result._id}`);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to add charging station. Please try again.';
    console.error('Error adding station:', err);
  } finally {
    loading.value = false;
  }
};
</script> 