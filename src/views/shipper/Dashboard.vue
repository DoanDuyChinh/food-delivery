<template>
  <div class="min-h-screen bg-gray-50">
    <ShipperSidebar :active-section="'dashboard'" />
    
    <div class="lg:pl-64 flex flex-col flex-1">
      <main class="flex-1 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Shipper Dashboard</h1>
          
          <div v-if="loading" class="flex justify-center py-10">
            <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Status Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-6">
                <div class="flex items-center">
                  <div 
                    class="flex-shrink-0 rounded-md p-3"
                    :class="shipperData.status === 'available' ? 'bg-green-100' : 'bg-red-100'"
                  >
                    <CheckCircleIcon 
                      v-if="shipperData.status === 'available'"
                      class="h-6 w-6 text-green-600" 
                    />
                    <NoSymbolIcon 
                      v-else
                      class="h-6 w-6 text-red-600" 
                    />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Current Status</dt>
                      <dd class="flex items-baseline">
                        <div class="text-2xl font-semibold text-gray-900">
                          {{ formatStatus(shipperData.status) }}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                
                <div class="mt-6">
                  <button 
                    @click="toggleAvailability"
                    class="w-full btn"
                    :class="shipperData.status === 'available' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'"
                  >
                    {{ shipperData.status === 'available' ? 'Go Offline' : 'Go Online' }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Stats Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Your Stats</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="text-sm font-medium text-gray-500">Total Deliveries</div>
                    <div class="mt-1 text-3xl font-semibold text-gray-900">{{ shipperData.totalDeliveries }}</div>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="text-sm font-medium text-gray-500">Today's Deliveries</div>
                    <div class="mt-1 text-3xl font-semibold text-gray-900">{{ todayDeliveries }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Active Deliveries -->
            <div class="lg:col-span-2">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Current Deliveries</h2>
              
              <div v-if="currentDeliveries.length === 0" class="bg-white shadow rounded-lg p-6 text-center">
                <TruckIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">No active deliveries</h3>
                <p class="text-gray-600">You don't have any active deliveries at the moment.</p>
              </div>
              
              <div v-else class="bg-white shadow rounded-lg overflow-hidden">
                <ul class="divide-y divide-gray-200">
                  <li v-for="delivery in currentDeliveries" :key="delivery.deliveryId" class="p-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <span class="text-lg font-medium text-gray-900">Order #{{ delivery.orderId }}</span>
                        <span 
                          :class="getStatusClass(delivery.status)" 
                          class="ml-2 px-2 py-1 text-xs font-medium rounded-full"
                        >
                          {{ formatStatus(delivery.status) }}
                        </span>
                      </div>
                      <router-link 
                        :to="`/shipper/deliveries/${delivery.deliveryId}`"
                        class="btn btn-primary"
                      >
                        View Details
                      </router-link>
                    </div>
                    <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div class="text-sm font-medium text-gray-500">Distance</div>
                        <div class="mt-1 font-medium text-gray-900">{{ formatDistance(delivery.distance) }}</div>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-500">Duration</div>
                        <div class="mt-1 font-medium text-gray-900">{{ formatDuration(delivery.duration) }}</div>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-500">Delivery Fee</div>
                        <div class="mt-1 font-medium text-gray-900">{{ formatPrice(delivery.fee) }}</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useAuthStore } from '@/stores/auth';
import { deliveryService } from '@/services/delivery.service';
import ShipperSidebar from '@/components/shipper/ShipperSidebar.vue';
import { 
  TruckIcon,
  CheckCircleIcon, // Replace StatusOnlineIcon
  NoSymbolIcon // Fix: Added proper comment syntax
} from '@heroicons/vue/24/outline';

const $toast = useToast();
const authStore = useAuthStore();
const loading = ref(true);
const shipperData = ref({
  totalDeliveries: 0,
  status: 'unavailable'
});
const deliveries = ref([]); // Initialize as empty array
const todayDeliveries = ref(0);

const currentDeliveries = computed(() => {
  // Ensure deliveries.value is an array before filtering
  return Array.isArray(deliveries.value) 
    ? deliveries.value.filter(d => d.status === 'assigned' || d.status === 'delivering')
    : [];
});

const formatDistance = (distance) => {
  if (!distance) return 'Unknown';
  return `${distance.toFixed(2)} km`;
};

const formatDuration = (minutes) => {
  if (!minutes) return 'Unknown';
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours > 0) {
    return `${hours} hr ${mins} min`;
  }
  
  return `${mins} min`;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatStatus = (status) => {
  const statusMap = {
    'available': 'Available',
    'unavailable': 'Unavailable',
    'busy': 'Busy',
    'assigned': 'Assigned',
    'delivering': 'Delivering',
    'delivered': 'Delivered'
  };
  
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const statusClassMap = {
    'assigned': 'bg-yellow-100 text-yellow-800',
    'delivering': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'available': 'bg-green-100 text-green-800',
    'unavailable': 'bg-red-100 text-red-800',
    'busy': 'bg-orange-100 text-orange-800'
  };
  
  return statusClassMap[status] || 'bg-gray-100 text-gray-800';
};

const toggleAvailability = async () => {
  try {
    // Update shipper availability status
    const newStatus = shipperData.value.status === 'available' ? 'unavailable' : 'available';
    
    // In a real app, you would update this via an API
    // For now we're just updating the local state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    shipperData.value.status = newStatus;
    $toast.success(`You are now ${formatStatus(newStatus).toLowerCase()}`);
  } catch (error) {
    $toast.error(error.message || 'Failed to update availability');
  }
};

const fetchShipperData = async () => {
  loading.value = true;
  
  try {
    // Get shipper user data from auth store
    const user = authStore.user;
    
    if (user && user.role === 'shipper') {
      // Set basic shipper data
      shipperData.value = {
        totalDeliveries: user.totalDeliveries || 0,
        status: user.status || 'unavailable'
      };
      
      // Get active deliveries for the shipper
      const shipperId = user.userId;
      if (shipperId) {
        try {
          const response = await deliveryService.getDeliveriesByShipper(shipperId, {
            status: 'assigned' // Get only active deliveries: delivering
          });
          
          deliveries.value = response || []; // Ensure we always have an array
          
          // Calculate today's deliveries
          const today = new Date().toDateString();
          todayDeliveries.value = deliveries.value.filter(d => {
            return d.createdAt ? new Date(d.createdAt).toDateString() === today : false;
          }).length;
        } catch (error) {
          console.error('Error fetching deliveries:', error);
          deliveries.value = []; // Reset to empty array on error
        }
      }
    }
  } catch (error) {
    $toast.error(error.message || 'Failed to load shipper data');
    deliveries.value = []; // Reset to empty array on error
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchShipperData();
});
</script>
