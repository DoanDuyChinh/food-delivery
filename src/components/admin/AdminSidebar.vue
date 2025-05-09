<template>
  <div>
    <!-- Mobile sidebar -->
    <div class="md:hidden">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 flex z-40"
      >
        <!-- Sidebar backdrop -->
        <div
          @click="sidebarOpen = false"
          class="fixed inset-0 bg-gray-600 bg-opacity-75"
          aria-hidden="true"
        ></div>
        
        <!-- Sidebar panel -->
        <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button
              @click="sidebarOpen = false"
              class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span class="sr-only">Close sidebar</span>
              <XMarkIcon class="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div class="flex-shrink-0 flex items-center px-4">
              <img class="h-8 w-auto mr-2" src="@/assets/images/logo.svg" alt="Food Delivery" />
              <span class="text-primary font-bold text-xl">Admin</span>
            </div>
            <nav class="mt-5 px-2 space-y-1">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.to"
                :class="[
                  activeSection === item.id
                    ? 'bg-primary-light bg-opacity-10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                ]"
              >
                <component
                  :is="item.icon"
                  :class="[
                    activeSection === item.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-4 flex-shrink-0 h-6 w-6'
                  ]"
                />
                {{ item.name }}
              </router-link>
            </nav>
          </div>
          
          <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div class="flex-shrink-0 group block">
              <div class="flex items-center">
                <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {{ userInitials }}
                </div>
                <div class="ml-3">
                  <p class="text-base font-medium text-gray-700">{{ user?.name || 'Admin User' }}</p>
                  <button
                    @click="logout"
                    class="text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Desktop sidebar -->
    <div class="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div class="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
        <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div class="flex items-center flex-shrink-0 px-4">
            <img class="h-8 w-auto mr-2" src="@/assets/images/logo.svg" alt="Food Delivery" />
            <span class="text-primary font-bold text-xl">Admin</span>
          </div>
          <nav class="mt-5 flex-1 px-2 bg-white space-y-1">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              :class="[
                activeSection === item.id
                  ? 'bg-primary-light bg-opacity-10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              ]"
            >
              <component
                :is="item.icon"
                :class="[
                  activeSection === item.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 flex-shrink-0 h-6 w-6'
                ]"
              />
              {{ item.name }}
            </router-link>
          </nav>
        </div>
        
        <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div class="flex-shrink-0 w-full group block">
            <div class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {{ userInitials }}
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-700">{{ user?.name || 'Admin User' }}</p>
                <button
                  @click="logout"
                  class="text-xs font-medium text-primary hover:text-primary-dark"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile top bar -->
    <div class="sticky top-0 z-10 lg:hidden bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 flex">
      <button
        @click="sidebarOpen = true"
        class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
      >
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="h-6 w-6" />
      </button>
      <div class="flex items-center ml-2">
        <img class="h-8 w-auto mr-2" src="@/assets/images/logo.svg" alt="Food Delivery" />
        <span class="text-primary font-bold">Admin Dashboard</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
  HomeIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  QueueListIcon,
  TruckIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const props = defineProps({
  activeSection: {
    type: String,
    required: true
  }
});

const router = useRouter();
const authStore = useAuthStore();
const sidebarOpen = ref(false);

const user = computed(() => authStore.user);

const userInitials = computed(() => {
  if (!user.value || !user.value.name) return 'A';
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const navigation = [
  { id: 'dashboard', name: 'Dashboard', to: '/admin', icon: HomeIcon },
  { id: 'restaurant', name: 'Restaurant', to: '/admin/restaurant', icon: BuildingStorefrontIcon },
  { id: 'menu', name: 'Menu', to: '/admin/menu', icon: QueueListIcon },
  { id: 'orders', name: 'Orders', to: '/admin/orders', icon: ShoppingBagIcon },
  { id: 'shippers', name: 'Shippers', to: '/admin/shippers', icon: TruckIcon },
];

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
