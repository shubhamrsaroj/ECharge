<template>
  <div class="min-h-screen bg-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M7 17h10v4H7z"></path>
          <path d="M7 11h10v6H7z"></path>
          <path d="M11 8h2v3h-2z"></path>
          <path d="M12 3L6 8h12z"></path>
        </svg>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-green-900">Reset your password</h2>
      <p class="mt-2 text-center text-sm text-green-600">
        Remember your password?
        <router-link to="/login" class="font-medium text-green-700 hover:text-green-500 underline">
          Sign in
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-green-200">
        <!-- Step 1: Email Input -->
        <form v-if="step === 1" class="space-y-6" @submit.prevent="handleSendOTP">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ error }}</span>
          </div>
          
          <div v-if="message" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ message }}</span>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-green-800">Email address</label>
            <div class="mt-1">
              <input id="email" name="email" type="email" autocomplete="email" required v-model="email" 
                class="appearance-none block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
            </div>
            <p class="mt-2 text-xs text-gray-500">Enter the email address associated with your account.</p>
          </div>

          <div>
            <button type="submit" :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
              text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Sending...' : 'Send verification code' }}
            </button>
          </div>
        </form>

        <!-- Step 2: OTP Verification -->
        <form v-if="step === 2" class="space-y-6" @submit.prevent="handleVerifyOTP">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ error }}</span>
          </div>
          
          <div v-if="message" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ message }}</span>
          </div>
          
          <div>
            <label for="otp" class="block text-sm font-medium text-green-800">Verification Code</label>
            <div class="mt-1">
              <input id="otp" name="otp" type="text" autocomplete="one-time-code" required v-model="otp" 
                class="appearance-none block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
            </div>
            <p class="mt-2 text-xs text-gray-500">Enter the verification code sent to your email.</p>
          </div>

          <div class="flex items-center justify-between">
            <button type="button" @click="resendOTP" :disabled="resendCountdown > 0" class="text-sm text-green-600 hover:text-green-500">
              {{ resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend code' }}
            </button>
          </div>

          <div>
            <button type="submit" :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
              text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Verifying...' : 'Verify code' }}
            </button>
          </div>
        </form>

        <!-- Step 3: Reset Password -->
        <form v-if="step === 3" class="space-y-6" @submit.prevent="handleResetPassword">
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ error }}</span>
          </div>
          
          <div>
            <label for="newPassword" class="block text-sm font-medium text-green-800">New Password</label>
            <div class="mt-1 relative">
              <input 
                id="newPassword" 
                :type="showPassword ? 'text' : 'password'" 
                name="newPassword" 
                autocomplete="new-password" 
                required 
                v-model="newPassword" 
                class="appearance-none block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" 
              />
              <button 
                type="button" 
                @click="togglePasswordVisibility" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
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
              <p class="mt-1 text-xs text-gray-500">Password must be at least 6 characters and include uppercase, lowercase, number, and special character (@$!%*?&)</p>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-green-800">Confirm Password</label>
            <div class="mt-1 relative">
              <input 
                id="confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'" 
                name="confirmPassword" 
                autocomplete="new-password" 
                required 
                v-model="confirmPassword" 
                class="appearance-none block w-full px-3 py-2 border border-green-300 rounded-md shadow-sm placeholder-gray-400 
                focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" 
              />
              <button 
                type="button" 
                @click="toggleConfirmPasswordVisibility" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5" 
                  :class="{ 'text-green-500': showConfirmPassword }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    v-if="showConfirmPassword" 
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
                    v-if="!showConfirmPassword"
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                  />
                </svg>
              </button>
            </div>
            <p v-if="passwordsDoNotMatch" class="mt-1 text-sm text-red-600">Passwords do not match</p>
          </div>

          <div>
            <button type="submit" :disabled="loading || passwordsDoNotMatch"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
              text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
              disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Resetting...' : 'Reset Password' }}
            </button>
          </div>
        </form>

        <!-- Step 4: Success -->
        <div v-if="step === 4" class="space-y-6">
          <div v-if="message" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ message }}</span>
          </div>

          <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
            <div class="flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-center">Password Reset Successful!</h3>
            <p class="mt-2 text-sm text-center">Your password has been successfully reset.</p>
            <p class="mt-2 text-sm text-center">You will be redirected to login in a few seconds...</p>
          </div>

          <div>
            <router-link to="/login"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
              text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Return to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();

// Form state
const step = ref(1);
const email = ref('');
const otp = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const error = ref('');
const message = ref('');
const resendCountdown = ref(0);
let countdownInterval = null;

// Computed properties
const passwordsDoNotMatch = computed(() => {
  return newPassword.value && confirmPassword.value && newPassword.value !== confirmPassword.value;
});

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Start countdown for resend OTP
const startResendCountdown = () => {
  resendCountdown.value = 60;
  countdownInterval = setInterval(() => {
    if (resendCountdown.value > 0) {
      resendCountdown.value -= 1;
    } else {
      clearInterval(countdownInterval);
    }
  }, 1000);
};

// Clean up interval when component is unmounted
watch(() => step.value, (newStep) => {
  if (newStep !== 2 && countdownInterval) {
    clearInterval(countdownInterval);
  }
});

// Handle sending OTP
const handleSendOTP = async () => {
  try {
    loading.value = true;
    error.value = '';
    message.value = '';
    
    // Call API to send OTP
    const response = await api.post('/api/auth/forgot-password', { email: email.value });
    
    // If OTP is available in the response (development mode), display it
    if (response.data.otp) {
      message.value = `Verification code sent. Your OTP is: ${response.data.otp}`;
    } else {
      message.value = 'Verification code sent. Please check your email or the console log for the OTP code.';
    }
    
    step.value = 2;
    startResendCountdown();
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to send verification code. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Handle resending OTP
const resendOTP = async () => {
  if (resendCountdown.value > 0) return;
  
  try {
    loading.value = true;
    error.value = '';
    message.value = '';
    
    // Call API to resend OTP
    const response = await api.post('/api/auth/forgot-password', { email: email.value });
    
    // If OTP is available in the response (development mode), display it
    if (response.data.otp) {
      message.value = `Verification code resent. Your OTP is: ${response.data.otp}`;
    } else {
      message.value = 'Verification code resent to your email.';
    }
    
    startResendCountdown();
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to resend verification code. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Handle OTP verification
const handleVerifyOTP = async () => {
  try {
    loading.value = true;
    error.value = '';
    message.value = '';
    
    // Call API to verify OTP
    const response = await api.post('/api/auth/verify-otp', { 
      email: email.value,
      otp: otp.value 
    });
    
    step.value = 3;
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid verification code. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Handle password reset
const handleResetPassword = async () => {
  if (passwordsDoNotMatch.value) {
    error.value = 'Passwords do not match';
    return;
  }

  // Validate password strength
  if (newPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters long';
    return;
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!strongPasswordRegex.test(newPassword.value)) {
    error.value = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
    return;
  }
  
  try {
    loading.value = true;
    error.value = '';
    message.value = 'Resetting password...';
    
    // Call API to reset password
    const response = await api.post('/api/auth/reset-password', {
      email: email.value,
      otp: otp.value,
      password: newPassword.value
    });
    
    console.log('Password reset successful:', response.data);
    message.value = 'Password reset successful! You will be redirected to login.';
    step.value = 4;
    
    // Add a delay before redirecting to login
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  } catch (err) {
    console.error('Password reset error:', err.response?.data);
    
    // Check for specific error about same password
    if (err.response?.data?.message?.includes('same as your current password')) {
      error.value = 'You cannot use your current password. Please choose a different password.';
    } else {
      error.value = err.response?.data?.message || 'Failed to reset password. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add any additional custom styles here */
</style> 