<template>
  <header class="bg-gray-900 border-b border-gray-800">
    <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <router-link to="/" class="flex items-center space-x-2">
          <!-- Modern EV Charging Logo -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500 filter drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Car body -->
            <path d="M5 13l2-6h10l2 6" stroke="currentColor" fill="none" />
            <rect x="3" y="13" width="18" height="5" rx="1" stroke="currentColor" fill="none" />
            <!-- Wheels -->
            <circle cx="7" cy="18" r="1.5" stroke="currentColor" fill="currentColor" />
            <circle cx="17" cy="18" r="1.5" stroke="currentColor" fill="currentColor" />
            <!-- Lightning bolt charging symbol -->
            <path d="M12 7v3h2l-3 5v-3h-2l3-5z" stroke="currentColor" fill="currentColor" class="text-green-500" />
            <!-- Charging plug -->
            <path d="M12 4v3" stroke="currentColor" stroke-width="2" />
            <path d="M10 2h4" stroke="currentColor" stroke-width="2" />
          </svg>
          <span class="text-xl font-bold text-white"><span class="text-green-500 text-shadow-neon">E</span>Charge</span>
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex space-x-8">
        <router-link to="/" class="text-gray-300 hover:text-green-400 font-medium transition-colors">Home</router-link>
        <router-link to="/stations" class="text-gray-300 hover:text-green-400 font-medium transition-colors">Stations</router-link>
        <router-link to="/map" class="text-gray-300 hover:text-green-400 font-medium transition-colors">Map</router-link>
        <template v-if="isLoggedIn">
          <router-link to="/dashboard" class="text-gray-300 hover:text-green-400 font-medium transition-colors">Dashboard</router-link>
          <router-link to="/bookmarks" class="text-gray-300 hover:text-green-400 font-medium transition-colors">
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Bookmarks
            </span>
          </router-link>
        </template>
      </div>

      <!-- Auth Buttons -->
      <div class="flex items-center space-x-4">
        <template v-if="isLoggedIn">
          <div class="relative" ref="profileDropdown">
            <button @click="toggleDropdown" class="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors">
              <span>{{ user?.name }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div v-if="isDropdownOpen" class="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700">
              <router-link to="/dashboard" class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-green-400">Dashboard</router-link>
              <router-link to="/bookmarks" class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-green-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Bookmarks
              </router-link>
              <button @click="handleLogout" class="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-green-400">Logout</button>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="text-gray-300 hover:text-green-400 font-medium transition-colors">Login</router-link>
          <router-link to="/register" class="bg-green-500 hover:bg-green-400 text-black py-2 px-4 rounded-md font-medium text-sm transition-colors">Register</router-link>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <button @click="toggleMobileMenu" class="md:hidden text-gray-300 hover:text-green-400 transition-colors">
        <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-gray-900 border-t border-gray-800">
      <div class="container mx-auto px-4 py-2 space-y-2">
        <router-link to="/" class="block py-2 text-gray-300 hover:text-green-400 font-medium transition-colors">Home</router-link>
        <router-link to="/stations" class="block py-2 text-gray-300 hover:text-green-400 font-medium transition-colors">Stations</router-link>
        <router-link to="/map" class="block py-2 text-gray-300 hover:text-green-400 font-medium transition-colors">Map</router-link>
        <template v-if="isLoggedIn">
          <router-link to="/dashboard" class="block py-2 text-gray-300 hover:text-green-400 font-medium transition-colors">Dashboard</router-link>
          <router-link to="/bookmarks" class="block py-2 text-gray-300 hover:text-green-400 font-medium transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            Bookmarks
          </router-link>
          <button @click="handleLogout" class="w-full text-left block py-2 text-gray-300 hover:text-green-400 font-medium transition-colors">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="block py-2 text-gray-300 hover:text-green-400 font-medium transition-colors">Login</router-link>
          <router-link to="/register" class="block py-2 text-gray-300 hover:text-green-400 font-medium transition-colors">Register</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isLoggedIn);
const user = computed(() => authStore.user);

const isMobileMenuOpen = ref(false);
const isDropdownOpen = ref(false);
const profileDropdown = ref(null);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.text-shadow-neon {
  text-shadow: 0 0 5px rgba(74, 222, 128, 0.5), 0 0 10px rgba(74, 222, 128, 0.3);
}
</style> 