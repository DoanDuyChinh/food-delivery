<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center">
              <img class="h-8 w-auto mr-2" src="@/assets/images/icon-food.png" alt="Food Delivery" />
              <span class="text-primary font-bold text-xl">Coastal Delivery</span>
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link to="/" class="nav-link" :class="{ 'active': $route.path === '/' }">
              Home
            </router-link>
            <router-link to="/menu" class="nav-link" :class="{ 'active': $route.path === '/menu' }">
              Menu
            </router-link>
            <template v-if="isLoggedIn">
              <router-link v-if="isCustomer" to="/orders" class="nav-link" :class="{ 'active': $route.path.startsWith('/orders') }">
                My Orders
              </router-link>
              <router-link v-if="isShipper" to="/shipper" class="nav-link" :class="{ 'active': $route.path.startsWith('/shipper') }">
                Deliveries
              </router-link>
              <router-link v-if="isAdmin" to="/admin" class="nav-link" :class="{ 'active': $route.path.startsWith('/admin') }">
                Dashboard
              </router-link>
            </template>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <div v-if="isLoggedIn" class="ml-3 relative flex items-center space-x-4">
            <div v-if="isCustomer" class="relative">
              <router-link to="/checkout" class="p-2 rounded-full text-gray-600 hover:text-primary focus:outline-none">
                <ShoppingCartIcon class="h-6 w-6" />
                <span v-if="cartItemCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                  {{ cartItemCount }}
                </span>
              </router-link>
            </div>
            <div class="relative" ref="profileMenuRef">
              <button @click="toggleProfileMenu" class="flex text-sm rounded-full focus:outline-none">
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-primary font-bold">
                  {{ profileInitials }}
                </div>
              </button>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="showProfileMenu" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div class="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    <div class="font-medium">{{ user?.name || 'User' }}</div>
                    <div class="text-gray-500">{{ user?.email || 'user@example.com' }}</div>
                  </div>
                  <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="showProfileMenu = false">
                    Your Profile
                  </router-link>
                  <button @click="logout" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </button>
                </div>
              </transition>
            </div>
          </div>
          <div v-else class="flex items-center space-x-4">
            <router-link to="/login" class="text-gray-700 hover:text-primary">
              Log In
            </router-link>
            <router-link to="/register" class="btn btn-primary">
              Sign Up
            </router-link>
          </div>
        </div>
        <div class="-mr-2 flex items-center sm:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!isMobileMenuOpen" class="block h-6 w-6" />
            <XMarkIcon v-else class="block h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link to="/" class="mobile-nav-link" :class="{ 'active': $route.path === '/' }" @click="isMobileMenuOpen = false">
          Home
        </router-link>
        <router-link to="/menu" class="mobile-nav-link" :class="{ 'active': $route.path === '/menu' }" @click="isMobileMenuOpen = false">
          Menu
        </router-link>
        <template v-if="isLoggedIn">
          <router-link v-if="isCustomer" to="/orders" class="mobile-nav-link" :class="{ 'active': $route.path.startsWith('/orders') }" @click="isMobileMenuOpen = false">
            My Orders
          </router-link>
          <router-link v-if="isShipper" to="/shipper" class="mobile-nav-link" :class="{ 'active': $route.path.startsWith('/shipper') }" @click="isMobileMenuOpen = false">
            Deliveries
          </router-link>
          <router-link v-if="isAdmin" to="/admin" class="mobile-nav-link" :class="{ 'active': $route.path.startsWith('/admin') }" @click="isMobileMenuOpen = false">
            Dashboard
          </router-link>
        </template>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div v-if="isLoggedIn" class="space-y-1">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-primary font-bold">
                {{ profileInitials }}
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ user?.name || 'User' }}</div>
              <div class="text-sm font-medium text-gray-500">{{ user?.email || 'user@example.com' }}</div>
            </div>
            <div v-if="isCustomer" class="ml-auto">
              <router-link to="/checkout" class="p-2 rounded-full text-gray-600 hover:text-primary focus:outline-none" @click="isMobileMenuOpen = false">
                <ShoppingCartIcon class="h-6 w-6" />
                <span v-if="cartItemCount > 0" class="absolute top-12 right-16 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-primary rounded-full">
                  {{ cartItemCount }}
                </span>
              </router-link>
            </div>
          </div>
          <router-link to="/profile" class="mobile-profile-link" @click="isMobileMenuOpen = false">
            Your Profile
          </router-link>
          <button @click="logout" class="w-full text-left mobile-profile-link">
            Sign out
          </button>
        </div>
        <div v-else class="mt-3 space-y-1">
          <router-link to="/login" class="mobile-profile-link" @click="isMobileMenuOpen = false">
            Log In
          </router-link>
          <router-link to="/register" class="mobile-profile-link" @click="isMobileMenuOpen = false">
            Sign Up
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const isMobileMenuOpen = ref(false);
const showProfileMenu = ref(false);
const profileMenuRef = ref(null);

const isLoggedIn = computed(() => authStore.isLoggedIn);
const isCustomer = computed(() => authStore.isCustomer);
const isShipper = computed(() => authStore.isShipper);
const isAdmin = computed(() => authStore.isAdmin);
const user = computed(() => authStore.user);
const cartItemCount = computed(() => cartStore.totalItems);

const profileInitials = computed(() => {
  if (!user.value || !user.value.name) return 'U';
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const logout = () => {
  authStore.logout();
  if (cartStore.clearCart) cartStore.clearCart();
  router.push('/');
  showProfileMenu.value = false;
  isMobileMenuOpen.value = false;
};

const handleClickOutside = (event) => {
  if (profileMenuRef.value && !profileMenuRef.value.contains(event.target)) {
    showProfileMenu.value = false;
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
.nav-link {
  @apply inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-primary hover:border-primary;
}

.nav-link.active {
  @apply border-primary text-primary;
}

.mobile-nav-link {
  @apply block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-primary hover:text-primary;
}

.mobile-nav-link.active {
  @apply border-primary text-primary bg-primary-50;
}

.mobile-profile-link {
  @apply block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-primary;
}
</style>
