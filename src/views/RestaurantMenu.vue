<template>
  <div class="py-10 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Restaurant Info Header -->
      <div v-if="restaurant" class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="relative h-60 bg-gradient-to-r from-primary-light to-primary">
          <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="text-3xl md:text-4xl font-bold text-white text-center">{{ restaurant.name }}</h1>
          </div>
        </div>
        <div class="p-6">
          <p class="text-gray-600">{{ restaurant.description }}</p>
          <div class="mt-4 flex flex-wrap gap-6">
            <div class="flex items-center">
              <MapPinIcon class="h-5 w-5 text-primary" />
              <span class="ml-2 text-gray-600">{{ restaurant.address }}</span>
            </div>
            <div class="flex items-center">
              <PhoneIcon class="h-5 w-5 text-primary" />
              <span class="ml-2 text-gray-600">{{ restaurant.phoneNumber }}</span>
            </div>
            <div class="flex items-center">
              <ClockIcon class="h-5 w-5 text-primary" />
              <span class="ml-2 text-gray-600">
                {{ formatTime(restaurant.openTime) }} - {{ formatTime(restaurant.closeTime) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Menu Items -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Our Menu</h2>
        
        <div v-if="loading" class="flex justify-center py-10">
          <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        
        <div v-else-if="menuItems.length === 0" class="py-10 text-center">
          <p class="text-gray-500 text-lg">No menu items available.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="item in menuItems" :key="item.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img :src="item.image" :alt="item.name" class="w-full h-48 object-cover" />
            <div class="p-6">
              <div class="flex justify-between">
                <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
                <span class="text-primary font-semibold">{{ formatPrice(item.price) }}</span>
              </div>
              <p class="mt-2 text-gray-600 text-sm">{{ item.description }}</p>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-sm text-gray-600 mr-2">Qty:</span>
                  <div class="flex items-center border border-gray-300 rounded-md">
                    <button 
                      @click="decrementQuantity(item)" 
                      class="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      :disabled="getItemQuantity(item.id) === 0"
                    >
                      <MinusIcon class="h-4 w-4" />
                    </button>
                    <span class="px-2 text-gray-800 min-w-[24px] text-center">{{ getItemQuantity(item.id) }}</span>
                    <button 
                      @click="incrementQuantity(item)" 
                      class="px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      <PlusIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button 
                  @click="addToCart(item)" 
                  class="ml-2 flex-shrink-0 p-2 text-white bg-primary rounded-full hover:bg-primary-dark"
                  title="Add to cart"
                >
                  <ShoppingCartIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Cart Summary -->
      <div v-if="!cartStore.isEmpty" class="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <ShoppingCartIcon class="h-6 w-6 text-primary mr-2" />
              <span class="font-medium">{{ cartStore.totalItems }} items | {{ formatPrice(cartStore.subtotal) }}</span>
            </div>
            <router-link 
              to="/checkout" 
              class="btn btn-primary inline-flex items-center"
              :class="{ 'opacity-50 cursor-not-allowed': !isLoggedIn }"
              @click.prevent="handleCheckout"
            >
              Proceed to Checkout
              <ArrowRightIcon class="ml-2 h-5 w-5" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { restaurantService } from '@/services/restaurant.service';
import { ShoppingCartIcon, ArrowRightIcon, MapPinIcon, PhoneIcon, ClockIcon, PlusIcon, MinusIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const $toast = useToast();

const loading = ref(true);
const menuItems = ref([]);
const restaurant = ref(null);

const isLoggedIn = computed(() => authStore.isLoggedIn);

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getItemQuantity = (itemId) => {
  const item = cartStore.items.find(i => i.id === itemId);
  return item ? item.quantity : 0;
};

const addToCart = (item) => {
  cartStore.addItem(item);
  $toast.success(`${item.name} added to cart!`);
};

const incrementQuantity = (item) => {
  cartStore.addItem(item);
};

const decrementQuantity = (item) => {
  if (getItemQuantity(item.id) > 0) {
    cartStore.updateQuantity(item.id, getItemQuantity(item.id) - 1);
  }
};

const handleCheckout = () => {
  if (!isLoggedIn.value) {
    $toast.info('Please log in to proceed to checkout');
    router.push({ name: 'Login', query: { redirect: '/checkout' } });
    return;
  }
  
  router.push('/checkout');
};

onMounted(async () => {
  try {
    // Load restaurant info
    const restaurantInfo = await restaurantService.getRestaurantInfo();
    restaurant.value = restaurantInfo;
    
    // Load menu items
    const menu = await restaurantService.getMenu();
    menuItems.value = menu;
  } catch (error) {
    $toast.error('Error loading menu: ' + error.message);
  } finally {
    loading.value = false;
  }
  
  // Initialize cart from localStorage
  cartStore.loadFromLocalStorage();
});
</script>
