<template>
  <div>
    <div v-if="loading" class="flex justify-center py-6">
      <svg class="animate-spin h-8 w-8 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="reviews.length === 0" class="text-center py-6">
      <p class="text-gray-400">No reviews yet. Be the first to share your experience!</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="review in reviews" :key="review._id" class="bg-dark-300 p-4 rounded-lg border border-dark-200">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center">
              <div class="text-primary-400 text-lg">
                <span v-for="i in 5" :key="i" :class="i <= review.rating ? 'text-primary-400' : 'text-gray-500'">★</span>
              </div>
              <span class="ml-2 text-white font-medium">{{ review.rating }}/5</span>
            </div>
            <p class="text-gray-400 text-sm mt-1">
              {{ formatDate(review.createdAt) }}
              <span v-if="review.updatedAt !== review.createdAt"> (edited)</span>
            </p>
          </div>
          
          <div v-if="isCurrentUserReview(review)" class="flex space-x-2">
            <button 
              @click="$emit('edit', review)" 
              class="text-primary-400 hover:text-primary-300"
              title="Edit review"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              @click="$emit('delete', review._id)" 
              class="text-red-400 hover:text-red-300"
              title="Delete review"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="mt-3">
          <div class="flex items-center">
            <div class="text-primary-300 font-medium">{{ review.user?.name || 'Anonymous User' }}</div>
          </div>
          <p v-if="review.comment" class="mt-2 text-gray-300">{{ review.comment }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/store/auth';

const props = defineProps({
  reviews: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit', 'delete']);
const authStore = useAuthStore();

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const isCurrentUserReview = (review) => {
  return authStore.isLoggedIn && authStore.user && review.user && review.user._id === authStore.user.id;
};
</script> 