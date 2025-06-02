import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import stationService from '@/services/station.service';

export const useStationStore = defineStore('stations', () => {
  // State
  const stations = ref([]);
  const currentStation = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const filters = ref({
    status: '',
    connectorType: '',
    minPower: '',
    maxPower: '',
  });
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Getters
  const filteredStations = computed(() => {
    return stations.value;
  });

  // Actions
  async function fetchStations(params = {}) {
    try {
      loading.value = true;
      error.value = null;
      
      const queryParams = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...filters.value,
        ...params,
      };
      
      const response = await stationService.getStations(queryParams);
      stations.value = response.data;
      pagination.value = response.pagination;
      return response;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch stations';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchNearbyStations(lat, lng, distance = 10) {
    try {
      loading.value = true;
      error.value = null;
      const response = await stationService.getNearbyStations(lat, lng, distance);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch nearby stations';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchStationById(id) {
    try {
      loading.value = true;
      error.value = null;
      const response = await stationService.getStationById(id);
      currentStation.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch station';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createStation(stationData) {
    try {
      loading.value = true;
      error.value = null;
      const response = await stationService.createStation(stationData);
      stations.value.unshift(response.data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create station';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateStation(id, stationData) {
    try {
      loading.value = true;
      error.value = null;
      const response = await stationService.updateStation(id, stationData);
      
      // Update in the stations array if exists
      const index = stations.value.findIndex(s => s._id === id);
      if (index !== -1) {
        stations.value[index] = response.data;
      }
      
      // Update current station if it's the same
      if (currentStation.value && currentStation.value._id === id) {
        currentStation.value = response.data;
      }
      
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update station';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteStation(id) {
    try {
      loading.value = true;
      error.value = null;
      await stationService.deleteStation(id);
      
      // Remove from stations array
      stations.value = stations.value.filter(s => s._id !== id);
      
      // Clear current station if it's the same
      if (currentStation.value && currentStation.value._id === id) {
        currentStation.value = null;
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete station';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters };
    pagination.value.page = 1; // Reset to first page when filters change
  }

  function resetFilters() {
    filters.value = {
      status: '',
      connectorType: '',
      minPower: '',
      maxPower: '',
    };
    pagination.value.page = 1;
  }

  function setPage(page) {
    pagination.value.page = page;
  }

  return {
    stations,
    currentStation,
    loading,
    error,
    filters,
    pagination,
    filteredStations,
    fetchStations,
    fetchNearbyStations,
    fetchStationById,
    createStation,
    updateStation,
    deleteStation,
    setFilters,
    resetFilters,
    setPage,
  };
}); 