import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import HomeView from '@/views/HomeView.vue'
import StationsView from '@/views/StationsView.vue'
import StationDetailsView from '@/views/StationDetailsView.vue'
import AddStationView from '@/views/AddStationView.vue'
import EditStationView from '@/views/EditStationView.vue'
import MapView from '@/views/MapView.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import BookmarksView from '@/views/BookmarksView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { guestOnly: true },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView,
    meta: { guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/stations',
    name: 'Stations',
    component: StationsView,
  },
  {
    path: '/stations/:id',
    name: 'StationDetails',
    component: StationDetailsView,
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView,
  },
  {
    path: '/stations/add',
    name: 'AddStation',
    component: AddStationView,
    meta: { requiresAuth: true },
  },
  {
    path: '/stations/edit/:id',
    name: 'EditStation',
    component: EditStationView,
    meta: { requiresAuth: true },
  },
  {
    path: '/bookmarks',
    name: 'bookmarks',
    component: BookmarksView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Always scroll to top
    return { top: 0 };
  },
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;

  // Routes that require authentication
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }

  // Routes that are for guests only (login, register)
  if (to.meta.guestOnly && isLoggedIn) {
    next({ name: 'Dashboard' });
    return;
  }

  next();
});

export default router; 