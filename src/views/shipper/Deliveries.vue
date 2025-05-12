<template>
  <div class="min-h-screen bg-gray-50">
    <ShipperSidebar :active-section="'deliveries'" />
    
    <div class="lg:pl-64 flex flex-col flex-1">
      <main class="flex-1 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">My Deliveries</h1>
            <div class="flex items-center space-x-4">
              <div class="relative">
                <select
                  v-model="statusFilter"
                  class="form-input pl-3 pr-10 py-2 text-sm"
                  @change="loadDeliveries"
                >
                  <option value="">All Statuses</option>
                  <option value="assigned">Assigned</option>
                  <option value="delivering">Delivering</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                @click="loadDeliveries"
                class="btn btn-outline flex items-center"
              >
                <ArrowPathIcon class="h-5 w-5 mr-1" />
                Refresh
              </button>
            </div>
          </div>
          
          <div v-if="loading" class="flex justify-center py-10">
            <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else-if="deliveries.length === 0" class="bg-white shadow-md rounded-lg p-8 text-center">
            <TruckIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 class="text-xl font-medium text-gray-900 mb-2">No deliveries found</h2>
            <p class="text-gray-600">You don't have any deliveries with the selected status.</p>
          </div>
          
          <div v-else>
            <div class="space-y-6">
              <div v-for="delivery in deliveries" :key="delivery.deliveryId" class="bg-white shadow-md rounded-lg overflow-hidden">
                <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 class="text-lg font-medium text-gray-900">Order #{{ delivery.orderId }}</h2>
                    <p class="text-sm text-gray-600">Delivery #{{ delivery.deliveryId }}</p>
                  </div>
                  <span :class="getStatusClass(delivery.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ formatStatus(delivery.status) }}
                  </span>
                </div>
                
                <div class="p-6">
                  <!-- Order Information Section -->
                  
                  
                  <!-- Delivery Details -->
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                      <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Distance</h3>
                      <p class="text-gray-900 font-medium">{{ formatDistance(delivery.distance) }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Duration</h3>
                      <p class="text-gray-900 font-medium">{{ formatDuration(delivery.duration) }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Delivery Fee</h3>
                      <p class="text-gray-900 font-medium">{{ formatPrice(delivery.fee) }}</p>
                    </div>
                    <div>
                      <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Customer</h3>
                      <p class="text-gray-900 font-medium truncate">
                        {{ delivery.shipper?.name || 'Customer' }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Locations -->
                  <div class="mb-6">
                    <div class="flex items-start mb-3">
                      <div class="mt-1">
                        <div class="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-700">Restaurant</p>
                        <p class="text-sm text-gray-500">{{ getRestaurantAddress() }}</p>
                      </div>
                    </div>
                    <div class="w-0.5 h-6 bg-gray-300 ml-3"></div>
                    <div class="flex items-start">
                      <div class="mt-1">
                        <div class="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-700">Delivery Address</p>
                        <p class="text-sm text-gray-500 break-words">{{ getCustomerAddress(delivery) }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Actions -->
                  <div class="flex justify-between items-center">
                    <router-link 
                      :to="{
                        path: '/shipper/deliveries/detail',
                        query: { 
                          deliveryId: delivery.deliveryId,
                          orderId: delivery.orderId
                        }
                      }"
                      class="btn btn-outline flex items-center"
                    >
                      <EyeIcon class="h-4 w-4 mr-2" />
                      View Details
                    </router-link>
                    
                    <div v-if="canUpdateStatus(delivery)">
                      <button 
                        v-if="delivery.status === 'assigned'"
                        @click="updateDeliveryStatus(delivery.deliveryId, 'delivering')"
                        class="btn btn-primary"
                      >
                        Start Delivery
                      </button>
                      
                      <button 
                        v-if="delivery.status === 'delivering'"
                        @click="updateDeliveryStatus(delivery.deliveryId, 'completed')"
                        class="btn btn-primary"
                      >
                        Mark as Delivered
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useAuthStore } from '@/stores/auth';
import { deliveryService } from '@/services/delivery.service';
import { userService } from '@/services/user.service';
import { orderService } from '@/services/order.service';
import axios from 'axios';
import ShipperSidebar from '@/components/shipper/ShipperSidebar.vue';

// Import each icon individually to avoid the named export 'n' error
import { TruckIcon } from '@heroicons/vue/24/outline';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';
import { EyeIcon } from '@heroicons/vue/24/outline';
import { UserIcon, PhoneIcon } from '@heroicons/vue/24/outline';

const $toast = useToast();
const authStore = useAuthStore();
const loading = ref(true);
const deliveries = ref([]); // Initialize as empty array instead of null
const statusFilter = ref('');
const orderDetails = ref({}); // Store order details indexed by orderId

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
    'assigned': 'Assigned',
    'delivering': 'Delivering',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const statusClassMap = {
    'assigned': 'bg-yellow-100 text-yellow-800',
    'delivering': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  
  return statusClassMap[status] || 'bg-gray-100 text-gray-800';
};

const getRestaurantAddress = () => {
  return 'Chung cư Season Avenue'; // In a real app, get this from the restaurant info
};

const getCustomerAddress = (delivery) => {
  // In a real app, this would come from the order details
  return '22 Ao Sen, Mộ Lao, Hà Đông, Hà Nội';
};

const canUpdateStatus = (delivery) => {
  return ['assigned', 'delivering'].includes(delivery.status);
};

const loadDeliveries = async () => {
  loading.value = true;
  
  try {
    const user = await userService.getProfile();
    const shipperId = user.userId;
    if (!shipperId) {
      throw new Error('User ID not found');
    }
    
    const params = {};
    if (statusFilter.value) {
      params.status = statusFilter.value;
    }
    
    // Use the actual API endpoint
    await axios.get(`http://localhost:8000/delivery/shipper/${shipperId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      deliveries.value = response.data || []; // Ensure we always have an array
      
      // After loading deliveries, fetch order details for each delivery
      // fetchOrderDetails();
    })
    .catch(error => {
      throw new Error(error.response?.data?.message || 'Failed to load deliveries');
    });
  } catch (error) {
    $toast.error(error.message || 'Failed to load deliveries');
    deliveries.value = []; // Set to empty array on error
  } finally {
    loading.value = false;
  }
};

// Add this new function to fetch order details
const fetchOrderDetails = async () => {
  for (const delivery of deliveries.value) {
    if (delivery.orderId && !orderDetails.value[delivery.orderId]) {
      try {
        // await axios.get(`http://localhost:8000/orders/${delivery.orderId}`, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // })
        // .then(response => {
        //   orderDetails.value[delivery.orderId] = response.data;
        //   // Update delivery with additional order info
        //   delivery.orderAmount = response.data.totalAmount;
        //   delivery.itemCount = response.data.orderItems?.length || 0;
        //   delivery.customer = response.data.customer;
        //   delivery.paymentMethod = response.data.paymentMethod;
        //   delivery.specialInstructions = response.data.specialInstructions;
        // })
        // .catch(error => {
        //   console.error(`Failed to load order ${delivery.orderId}:`, error);
        // });
        const response = await orderService.getOrderById(delivery.orderId);
        // delivery.orderAmount = response.data.totalAmount;
        // delivery.itemCount = response.data.orderItems?.length || 0;
        // delivery.customer = response.data.user_id;
      } catch (error) {
        console.error(`Error fetching order ${delivery.orderId}:`, error);
      }
    }
  }
};

const updateDeliveryStatus = async (deliveryId, newStatus) => {
  try {
    if(newStatus === 'completed') {
      await orderService.updateOrderStatus(deliveryId, 'delivered');
    }
    // Call the API to update delivery status
    await deliveryService.updateDeliveryStatus(deliveryId, newStatus);
    
    // Update delivery in list
    const index = deliveries.value.findIndex(d => d.deliveryId === deliveryId);
    if (index !== -1) {
      deliveries.value[index].status = newStatus;
    }
    
    $toast.success(`Delivery status updated to ${formatStatus(newStatus)}`);
  } catch (error) {
    $toast.error(error.message || 'Failed to update delivery status');
  }
};

const formatOrderTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  loadDeliveries();
});
</script>
