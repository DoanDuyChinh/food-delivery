<template>
  <div class="py-10 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center mb-6">
        <router-link :to="`/orders/${orderId}`" class="text-primary hover:text-primary-dark flex items-center">
          <ArrowLeftIcon class="h-5 w-5 mr-1" />
          Back to Order Details
        </router-link>
      </div>
      
      <div v-if="loading" class="flex justify-center py-10">
        <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="!delivery" class="bg-white shadow-md rounded-lg p-8 text-center">
        <ExclamationCircleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-medium text-gray-900 mb-2">Delivery Not Found</h2>
        <p class="text-gray-600 mb-6">The delivery you're looking for doesn't exist or is not yet assigned.</p>
        <router-link :to="`/orders/${orderId}`" class="btn btn-primary">
          View Order Details
        </router-link>
      </div>
      
      <div v-else>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Delivery Tracking</h2>
              </div>
              <div class="p-6">
                <!-- Map Container -->
                <div class="h-[400px] bg-gray-100 rounded-lg mb-4 relative">
                  <!-- This would be replaced with a real map like Leaflet in a full implementation -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <p class="text-gray-500">Map visualization would go here with restaurant at {{ formatCoords(delivery.fromCoords) }} and delivery address at {{ formatCoords(delivery.toCoords) }}</p>
                  </div>
                </div>
                
                <!-- Delivery Progress -->
                <div class="mt-6">
                  <div class="relative">
                    <!-- Progress Bar -->
                    <div class="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-primary transition-all duration-500" 
                        :style="{ width: `${deliveryProgress}%` }"
                      ></div>
                    </div>
                    
                    <!-- Progress Steps -->
                    <div class="flex justify-between mt-2">
                      <div class="flex flex-col items-center">
                        <div :class="isStepComplete('assigned') ? 'bg-primary' : 'bg-gray-200'" class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs">
                          <CheckIcon v-if="isStepComplete('assigned')" class="h-4 w-4" />
                          <span v-else>1</span>
                        </div>
                        <span class="text-xs mt-1 text-gray-600">Assigned</span>
                      </div>
                      
                      <div class="flex flex-col items-center">
                        <div :class="isStepComplete('preparing') ? 'bg-primary' : 'bg-gray-200'" class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs">
                          <CheckIcon v-if="isStepComplete('preparing')" class="h-4 w-4" />
                          <span v-else>2</span>
                        </div>
                        <span class="text-xs mt-1 text-gray-600">Preparing</span>
                      </div>
                      
                      <div class="flex flex-col items-center">
                        <div :class="isStepComplete('delivering') ? 'bg-primary' : 'bg-gray-200'" class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs">
                          <CheckIcon v-if="isStepComplete('delivering')" class="h-4 w-4" />
                          <span v-else>3</span>
                        </div>
                        <span class="text-xs mt-1 text-gray-600">On the way</span>
                      </div>
                      
                      <div class="flex flex-col items-center">
                        <div :class="isStepComplete('delivered') ? 'bg-primary' : 'bg-gray-200'" class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs">
                          <CheckIcon v-if="isStepComplete('delivered')" class="h-4 w-4" />
                          <span v-else>4</span>
                        </div>
                        <span class="text-xs mt-1 text-gray-600">Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Delivery ETA -->
                <div class="mt-6 bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center mb-2">
                    <ClockIcon class="h-5 w-5 text-gray-500 mr-2" />
                    <span class="font-medium">Estimated Delivery Time</span>
                  </div>
                  <p class="text-gray-700">
                    Your order will arrive in approximately {{ formatDuration(delivery.duration) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="lg:col-span-1">
            <div class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Delivery Details</h2>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div>
                    <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Status</h3>
                    <span :class="getStatusClass(delivery.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                      {{ formatStatus(delivery.status) }}
                    </span>
                  </div>
                  
                  <div>
                    <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Shipper</h3>
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-primary font-bold">
                        {{ getInitials(delivery.shipper.name) }}
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{{ delivery.shipper.name }}</p>
                        <p class="text-xs text-gray-500">{{ delivery.shipper.vehicleType }} ({{ delivery.shipper.vehiclePlate }})</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Contact</h3>
                    <div class="flex items-center">
                      <PhoneIcon class="h-5 w-5 text-gray-400 mr-2" />
                      <a :href="`tel:${delivery.shipper.phone}`" class="text-primary">{{ delivery.shipper.phone }}</a>
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Pickup Location</h3>
                    <div class="flex items-start">
                      <MapPinIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <span class="text-gray-700">{{ restaurantAddress }}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Delivery Address</h3>
                    <div class="flex items-start">
                      <HomeIcon class="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <span class="text-gray-700">{{ shippingAddress }}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Distance</h3>
                    <div class="flex items-center">
                      <TruckIcon class="h-5 w-5 text-gray-400 mr-2" />
                      <span class="text-gray-700">{{ formatDistance(delivery.distance) }}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Delivery Fee</h3>
                    <div class="flex items-center">
                      <CurrencyDollarIcon class="h-5 w-5 text-gray-400 mr-2" />
                      <span class="text-gray-700">{{ formatPrice(delivery.fee) }}</span>
                    </div>
                  </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { orderService } from '@/services/order.service';
import { restaurantService } from '@/services/restaurant.service';
import { 
  ArrowLeftIcon, 
  CheckIcon, 
  ClockIcon, 
  PhoneIcon, 
  MapPinIcon, 
  HomeIcon, 
  TruckIcon, 
  CurrencyDollarIcon,
  ExclamationCircleIcon 
} from '@heroicons/vue/24/outline';

const route = useRoute();
const $toast = useToast();

const loading = ref(true);
const delivery = ref(null);
const restaurant = ref(null);
const order = ref(null);
const orderId = computed(() => parseInt(route.params.id));
const restaurantAddress = ref('');
const shippingAddress = ref('');
let refreshInterval = null;

const deliveryProgress = computed(() => {
  if (!delivery.value) return 0;
  
  const statusProgress = {
    'assigned': 25,
    'preparing': 50,
    'delivering': 75,
    'delivered': 100,
    'cancelled': 0
  };
  
  return statusProgress[delivery.value.status] || 0;
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatCoords = (coords) => {
  if (!coords || !Array.isArray(coords) || coords.length < 2) return 'Unknown';
  return `${coords[0]}, ${coords[1]}`;
};

const formatDuration = (minutes) => {
  if (!minutes) return 'calculating...';
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
  }
  
  return `${mins} minute${mins !== 1 ? 's' : ''}`;
};

const formatDistance = (distance) => {
  if (!distance) return 'Unknown';
  return `${distance.toFixed(2)} km`;
};

const getInitials = (name) => {
  if (!name) return 'UN';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const formatStatus = (status) => {
  const statusMap = {
    'assigned': 'Assigned',
    'preparing': 'Preparing',
    'delivering': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const statusClassMap = {
    'assigned': 'bg-blue-100 text-blue-800',
    'preparing': 'bg-yellow-100 text-yellow-800',
    'delivering': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  
  return statusClassMap[status] || 'bg-gray-100 text-gray-800';
};

const isStepComplete = (step) => {
  if (!delivery.value) return false;
  
  const steps = ['assigned', 'preparing', 'delivering', 'delivered'];
  const currentStepIndex = steps.indexOf(delivery.value.status);
  const targetStepIndex = steps.indexOf(step);
  
  // Special case: if the status is 'cancelled', no step is complete
  if (delivery.value.status === 'cancelled') return false;
  
  return targetStepIndex <= currentStepIndex;
};

const fetchDeliveryData = async () => {
  loading.value = true;
  
  try {
    // Get order data
    order.value = await orderService.getOrderById(orderId.value);
    shippingAddress.value = order.value.shippingAddress;
    
    // Get delivery data for the order
    delivery.value = await orderService.getDeliveryByOrderId(orderId.value);
    
    // Get restaurant data
    restaurant.value = await restaurantService.getRestaurantInfo();
    restaurantAddress.value = restaurant.value.address;
  } catch (error) {
    $toast.error(error.message || 'Failed to load delivery information');
    delivery.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDeliveryData();
  
  // Refresh delivery status every 30 seconds
  refreshInterval = setInterval(() => {
    if (delivery.value && ['assigned', 'preparing', 'delivering'].includes(delivery.value.status)) {
      fetchDeliveryData();
    }
  }, 30000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
