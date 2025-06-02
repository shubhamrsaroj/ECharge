<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-dark-300 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center">
          <div class="md:w-1/2 mb-8 md:mb-0 animate-fade-in-left">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              <span class="text-primary-400 text-shadow-neon animate-pulse">GREEN</span> CHARGE <span class="text-primary-400 text-shadow-neon animate-pulse">NOW</span>
            </h1>
            <p class="text-xl mb-6 animate-fade-in">
              Find and manage electric vehicle charging stations with ease. Join the sustainable mobility revolution.
            </p>
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up">
              <router-link to="/stations" class="btn btn-primary transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Find Stations
              </router-link>
              <router-link to="/map" class="btn btn-secondary transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                View Map
              </router-link>
            </div>
          </div>
          <div class="md:w-1/2 animate-fade-in-right">
            <img src="@/assets/images/hero-image.svg" alt="Electric Vehicle Charging" class="max-w-full h-auto animate-float" />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-dark-400">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-primary-400 animate-fade-in">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-dark-300 p-6 rounded-lg shadow-md border border-dark-200 transition-all hover:shadow-neon animate-fade-in-up" style="animation-delay: 0.1s">
            <div class="bg-dark-200 rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-primary-500 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Easily locate charging stations</h3>
            <p class="text-gray-300">
              Easily locate charging stations near you with our interactive map. Filter by connector type, power output, and availability.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-dark-300 p-6 rounded-lg shadow-md border border-dark-200 transition-all hover:shadow-neon animate-fade-in-up" style="animation-delay: 0.3s">
            <div class="bg-dark-200 rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-primary-500 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Manage your charging stations</h3>
            <p class="text-gray-300">
              Manage your charging stations securely with our platform. Add, update, or remove stations with ease.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-dark-300 p-6 rounded-lg shadow-md border border-dark-200 transition-all hover:shadow-neon animate-fade-in-up" style="animation-delay: 0.5s">
            <div class="bg-dark-200 rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-primary-500 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Real-time Updates</h3>
            <p class="text-gray-300">
              Get real-time updates on station availability and status. Never worry about finding an available charging point again.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-dark-500 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4 text-primary-400 animate-fade-in">Ready to Join the ECharge Network?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto text-gray-300 animate-fade-in" style="animation-delay: 0.2s">
          Register today to start managing your charging stations or find the perfect spot to charge your electric vehicle.
        </p>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-bounce-in" style="animation-delay: 0.4s">
          <router-link to="/register" class="btn btn-primary transform transition-all duration-300 hover:scale-110 hover:shadow-lg">
            Sign Up Now
          </router-link>
          <router-link to="/stations" class="btn btn-secondary transform transition-all duration-300 hover:scale-110 hover:shadow-lg">
            Browse Stations
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Component logic here if needed
</script>

<style scoped>
/* Animation keyframes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

/* Animation classes */
.animate-fade-in {
  animation: fadeIn 1s ease-in-out forwards;
}

.animate-fade-in-left {
  animation: fadeInLeft 1s ease-in-out forwards;
}

.animate-fade-in-right {
  animation: fadeInRight 1s ease-in-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-in-out forwards;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-bounce-in {
  animation: bounceIn 1s ease-in-out forwards;
}

/* Shadow effects for neon glow */
.text-shadow-neon {
  text-shadow: 0 0 5px rgba(74, 222, 128, 0.5), 0 0 10px rgba(74, 222, 128, 0.3);
}

.hover\:shadow-neon:hover {
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.3);
}

/* Button styles */
.btn {
  @apply py-2 px-6 rounded-md font-medium text-center;
}

.btn-primary {
  @apply bg-green-500 text-white hover:bg-green-600;
}

.btn-secondary {
  @apply bg-gray-700 text-green-400 hover:bg-gray-800 border border-green-500;
}
</style> 