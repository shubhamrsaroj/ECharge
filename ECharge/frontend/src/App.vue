<template>
  <div class="min-h-screen flex flex-col bg-black">
    <AppHeader />
    <main class="flex-grow">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import { onMounted } from 'vue';

// No need for dark mode toggle since we're using a permanent dark theme
</script>

<style>
/* Apply neon glow to focused elements */
input:focus, button:focus, a:focus {
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.5);
  outline: none;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #111111;
}

::-webkit-scrollbar-thumb {
  background: #4ade80;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #22c55e;
}
</style> 