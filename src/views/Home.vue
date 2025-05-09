<template>
  <div>
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-primary-light to-primary h-[500px] lg:h-[600px]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-white leading-tight">
              Delicious Food Delivered to Your Doorstep
            </h1>
            <p class="mt-4 text-xl text-white opacity-90">
              Enjoy the finest cuisine from Coastal Breeze Bistro, delivered hot and fresh right to your home.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <router-link to="/menu" class="btn inline-flex justify-center items-center px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition">
                View Our Menu
                <ArrowRightIcon class="ml-2 h-5 w-5" />
              </router-link>
              <router-link v-if="!isLoggedIn" to="/register" class="btn inline-flex justify-center items-center px-6 py-3 border border-white text-white font-medium rounded-md hover:bg-white hover:bg-opacity-10 transition">
                Sign Up Now
              </router-link>
            </div>
          </div>
          <div class="hidden lg:block">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Delicious Food" class="rounded-lg shadow-xl transform -rotate-3" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- How It Works Section -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">How It Works</h2>
          <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Get your favorite meals in just a few simple steps
          </p>
        </div>
        
        <div class="mt-16">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <div class="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Browse Our Menu</h3>
              <p class="mt-2 text-center text-gray-600">
                Choose from our wide selection of delicious dishes with detailed descriptions and photos.
              </p>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <div class="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Place Your Order</h3>
              <p class="mt-2 text-center text-gray-600">
                Add items to your cart, provide delivery details, and confirm your order with secure payment.
              </p>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
              <div class="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Enjoy Your Food</h3>
              <p class="mt-2 text-center text-gray-600">
                Track your delivery in real-time and enjoy your freshly prepared meal at your convenience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Featured Menu Items -->
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">Our Popular Dishes</h2>
          <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Explore our customer favorites for a taste of excellence
          </p>
        </div>
        
        <div class="mt-12">
          <div v-if="loading" class="flex justify-center">
            <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="item in featuredMenuItems" :key="item.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img :src="item.image" :alt="item.name" class="w-full h-48 object-cover" />
              <div class="p-6">
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
                  <span class="bg-primary-light text-white px-2 py-1 rounded-full text-xs font-bold">{{ formatPrice(item.price) }}</span>
                </div>
                <p class="mt-2 text-gray-600 text-sm line-clamp-2">{{ item.description }}</p>
                <button 
                  @click="addToCart(item)" 
                  class="mt-4 w-full btn btn-primary flex items-center justify-center"
                >
                  <ShoppingCartIcon class="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          
          <div class="mt-10 text-center">
            <router-link to="/menu" class="btn btn-outline py-3 px-6 inline-flex items-center">
              View Full Menu
              <ArrowRightIcon class="ml-2 h-5 w-5" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- About Restaurant Section -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 class="text-3xl font-extrabold text-gray-900">About Coastal Breeze Bistro</h2>
            <p class="mt-4 text-lg text-gray-600">
              {{ restaurant.description }}
            </p>
            <div class="mt-6 space-y-4">
              <div class="flex items-center">
                <MapPinIcon class="h-6 w-6 text-primary flex-shrink-0" />
                <span class="ml-3 text-gray-600">{{ restaurant.address }}</span>
              </div>
              <div class="flex items-center">
                <PhoneIcon class="h-6 w-6 text-primary flex-shrink-0" />
                <span class="ml-3 text-gray-600">{{ restaurant.phoneNumber }}</span>
              </div>
              <div class="flex items-center">
                <ClockIcon class="h-6 w-6 text-primary flex-shrink-0" />
                <span class="ml-3 text-gray-600">
                  {{ formatTime(restaurant.openTime) }} - {{ formatTime(restaurant.closeTime) }}
                </span>
              </div>
            </div>
          </div>
          <div class="mt-12 lg:mt-0">
            <img src="https://images.unsplash.com/photo-1560624052-44df263f8dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Restaurant Interior" class="rounded-lg shadow-xl" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Testimonials -->
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">What Our Customers Say</h2>
          <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Real reviews from satisfied food lovers
          </p>
        </div>
        
        <div class="mt-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div class="flex text-primary">
                  <StarIcon v-for="i in 5" :key="i" class="h-5 w-5 fill-current" />
                </div>
              </div>
              <p class="mt-4 text-gray-600 italic">
                "The food arrived hot and exactly as described. The flavors were outstanding and the delivery was surprisingly fast. Highly recommend!"
              </p>
              <div class="mt-4 flex items-center">
                <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-primary font-bold">
                  SK
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Sarah K.</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div class="flex text-primary">
                  <StarIcon v-for="i in 5" :key="i" class="h-5 w-5 fill-current" />
                </div>
              </div>
              <p class="mt-4 text-gray-600 italic">
                "I've ordered multiple times now and the quality and service are consistently excellent. The Pan-Seared Salmon is my absolute favorite!"
              </p>
              <div class="mt-4 flex items-center">
                <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-primary font-bold">
                  MT
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Michael T.</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
              <div class="flex items-center">
                <div class="flex text-primary">
                  <StarIcon v-for="i in 5" :key="i" class="h-5 w-5 fill-current" />
                </div>
              </div>
              <p class="mt-4 text-gray-600 italic">
                "The app makes ordering so easy, and I love being able to track my delivery in real-time. The food quality exceeds expectations every time."
              </p>
              <div class="mt-4 flex items-center">
                <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-primary font-bold">
                  JL
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Jennifer L.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { restaurantService } from '@/services/restaurant.service';
import { ArrowRightIcon, ShoppingCartIcon, MapPinIcon, PhoneIcon, ClockIcon, StarIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const cartStore = useCartStore();
const $toast = useToast();

const loading = ref(true);
const menuItems = ref([]);
const restaurant = ref({
  name: 'Coastal Breeze Bistro',
  description: 'A charming seaside restaurant offering fresh seafood and Mediterranean-inspired dishes in a relaxed atmosphere with ocean views.',
  address: 'Chung cư Season Avenue',
  phoneNumber: '+1-415-555-8723',
  isActive: true,
  openTime: '0000-01-01T11:00:00Z',
  closeTime: '0000-01-01T23:00:00Z'
});

const isLoggedIn = computed(() => authStore.isLoggedIn);

const featuredMenuItems = computed(() => {
  if (menuItems.value.length === 0) return [];
  return menuItems.value.slice(0, 3);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const addToCart = (item) => {
  cartStore.addItem(item);
  $toast.success(`${item.name} added to cart!`);
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
    $toast.error('Error loading data: ' + error.message);
  } finally {
    loading.value = false;
  }
  
  // Initialize cart from localStorage
  cartStore.loadFromLocalStorage();
});
</script>
