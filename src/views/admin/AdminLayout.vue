<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-primary font-bold text-xl">
                Food Delivery Admin
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                to="/admin" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-primary text-primary': $route.path === '/admin' }"
              >
                Dashboard
              </router-link>
              <router-link 
                to="/admin/orders" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-primary text-primary': $route.path.includes('/admin/orders') }"
              >
                Orders
              </router-link>
              <router-link 
                to="/admin/restaurant" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-primary text-primary': $route.path === '/admin/restaurant' }"
              >
                Restaurant
              </router-link>
              <router-link 
                to="/admin/menu" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-primary text-primary': $route.path === '/admin/menu' }"
              >
                Menu
              </router-link>
              <router-link 
                to="/admin/shippers" 
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="{ 'border-primary text-primary': $route.path.includes('/admin/shippers') }"
              >
                Shippers
              </router-link>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <div class="ml-3 relative">
              <div>
                <button 
                  @click="showProfileMenu = !showProfileMenu"
                  class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <span class="sr-only">Open user menu</span>
                  <span class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                    {{ userInitials }}
                  </span>
                </button>
              </div>
              
              <div 
                v-if="showProfileMenu"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</router-link>
                <a href="#" @click.prevent="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
              </div>
            </div>
          </div>
          
          <!-- Mobile menu button -->
          <div class="-mr-2 flex items-center sm:hidden">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span class="sr-only">Open main menu</span>
              <svg 
                class="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
                :class="{ 'hidden': mobileMenuOpen, 'block': !mobileMenuOpen }"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                class="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
                :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div 
        v-if="mobileMenuOpen"
        class="sm:hidden"
      >
        <div class="pt-2 pb-3 space-y-1">
          <router-link 
            to="/admin" 
            class="bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
            :class="{ 'bg-primary-50 border-primary text-primary': $route.path === '/admin' }"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/admin/orders" 
            class="bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
            :class="{ 'bg-primary-50 border-primary text-primary': $route.path.includes('/admin/orders') }"
          >
            Orders
          </router-link>
          <router-link 
            to="/admin/restaurant" 
            class="bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
            :class="{ 'bg-primary-50 border-primary text-primary': $route.path === '/admin/restaurant' }"
          >
            Restaurant
          </router-link>
          <router-link 
            to="/admin/menu" 
            class="bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
            :class="{ 'bg-primary-50 border-primary text-primary': $route.path === '/admin/menu' }"
          >
            Menu
          </router-link>
          <router-link 
            to="/admin/shippers" 
            class="bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium"
            :class="{ 'bg-primary-50 border-primary text-primary': $route.path.includes('/admin/shippers') }"
          >
            Shippers
          </router-link>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <span class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                {{ userInitials }}
              </span>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ authStore.user?.name }}</div>
              <div class="text-sm font-medium text-gray-500">{{ authStore.user?.email }}</div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <router-link to="/profile" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
              Your Profile
            </router-link>
            <a href="#" @click.prevent="logout" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
              Sign out
            </a>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Page content -->
    <main class="py-10">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const mobileMenuOpen = ref(false);
const showProfileMenu = ref(false);

// Get user initials for avatar
const userInitials = computed(() => {
  if (!authStore.user?.name) return 'A';
  
  const nameParts = authStore.user.name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
});

// Logout function
const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
