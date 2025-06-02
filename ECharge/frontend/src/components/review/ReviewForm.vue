<template>
  <div class="bg-dark-400 p-6 rounded-lg border border-dark-200 mb-6">
    <h3 class="text-lg font-semibold mb-4 text-primary-400">{{ isEditing ? 'Update Your Review' : 'Write a Review' }}</h3>
    
    <form @submit.prevent="submitReview" class="space-y-4">
      <div>
        <label class="form-label text-gray-300">Rating <span class="text-primary-400">*</span></label>
        <div class="flex space-x-2 mt-1">
          <button 
            v-for="star in 5" 
            :key="star" 
            type="button"
            @click="form.rating = star"
            class="text-2xl focus:outline-none"
            :class="star <= form.rating ? 'text-primary-400' : 'text-gray-500'"
          >
            ★
          </button>
        </div>
      </div>
      
      <div>
        <label for="comment" class="form-label text-gray-300">Comment</label>
        <textarea 
          id="comment" 
          v-model="form.comment" 
          rows="4" 
          class="form-input bg-dark-300 border-dark-200 text-gray-300 focus:border-primary-400 focus:ring focus:ring-primary-400/20 w-full" 
          placeholder="Share your experience with this charging station..."
        ></textarea>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button 
          v-if="isEditing" 
          type="button" 
          @click="$emit('cancel')" 
          class="btn btn-secondary"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn btn-primary" 
          :disabled="loading || form.rating === 0"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ submitButtonText }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  initialRating: {
    type: Number,
    default: 0
  },
  initialComment: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel']);

const form = ref({
  rating: props.initialRating,
  comment: props.initialComment
});

// Watch for prop changes to update form
watch(() => props.initialRating, (newVal) => {
  form.value.rating = newVal;
});

watch(() => props.initialComment, (newVal) => {
  form.value.comment = newVal;
});

const submitButtonText = computed(() => {
  if (props.loading) {
    return props.isEditing ? 'Updating...' : 'Submitting...';
  }
  return props.isEditing ? 'Update Review' : 'Submit Review';
});

const submitReview = () => {
  if (form.value.rating === 0) return;
  
  emit('submit', {
    rating: form.value.rating,
    comment: form.value.comment
  });
};
</script> 