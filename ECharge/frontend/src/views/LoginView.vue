<template>
  <div class="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 17h10v4H7z"></path>
          <path d="M7 11h10v6H7z"></path>
          <path d="M11 8h2v3h-2z"></path>
          <path d="M12 3L6 8h12z"></path>
        </svg>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-white">Sign in to your account</h2>
      <p class="mt-2 text-center text-sm text-gray-400">
        Or
        <router-link to="/register" class="font-medium text-green-500 hover:text-green-400 underline">
          create a new account
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-gray-900 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-800 transform transition-all duration-300 hover:shadow-2xl">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div v-if="error" class="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ error }}</span>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300">Email address</label>
            <div class="mt-1">
              <input id="email" name="email" type="email" autocomplete="email" required v-model="email" 
                class="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-500 
                focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
            <div class="mt-1 relative">
              <input 
                id="password" 
                :type="showPassword ? 'text' : 'password'" 
                name="password" 
                autocomplete="current-password" 
                required 
                v-model="password" 
                class="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-500 
                focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" 
              />
              <button 
                type="button" 
                @click="togglePasswordVisibility" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5" 
                  :class="{ 'text-green-500': showPassword }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    v-if="showPassword" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                  />
                  <path 
                    v-else 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                  <path 
                    v-if="!showPassword"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe" 
                class="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-700 rounded bg-gray-800" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <router-link to="/forgot-password" class="font-medium text-green-500 hover:text-green-400">
                Forgot your password?
              </router-link>
            </div>
          </div>

          <div>
            <button type="submit" :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
              text-black bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
              transition-all duration-300 transform hover:scale-105">
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const error = ref('');
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    
    // Redirect to the intended page or dashboard
    const redirectPath = route.query.redirect || '/dashboard';
    router.push(redirectPath);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to sign in. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Dark theme styles */
.shadow-xl {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
}

.hover\:shadow-2xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5);
}
</style> 