<template>
  <div class="min-h-screen bg-gray-50">
    <ShipperSidebar :active-section="'deliveries'" />
    
    <div class="lg:pl-64 flex flex-col flex-1">
      <main class="flex-1 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Delivery #{{ id }}</h1>
            <router-link to="/shipper/deliveries" class="btn btn-outline flex items-center">
              <ArrowLeftIcon class="h-5 w-5 mr-2" />
              Back to Deliveries
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
            <p class="text-gray-600 mb-6">The delivery you're looking for doesn't exist or you don't have permission to view it.</p>
            <router-link to="/shipper/deliveries" class="btn btn-primary">
              View All Deliveries
            </router-link>
          </div>
          
          <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Delivery details -->
            <div class="lg:col-span-2">
              <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 class="text-lg font-medium text-gray-900">
                      Order #{{ delivery.orderId }}
                      <span v-if="order" class="text-sm text-gray-600 ml-2">({{ formatPrice(order.totalAmount) }})</span>
                    </h2>
                    <p class="text-sm text-gray-600">
                      Delivery #{{ delivery.deliveryId }}
                      <span v-if="order">- {{ order.items?.length || 0 }} items</span>
                    </p>
                  </div>
                  <span :class="getStatusClass(delivery.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ formatStatus(delivery.status) }}
                  </span>
                </div>
                
                <div class="p-6">
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
                      <h3 class="text-sm text-gray-500 uppercase tracking-wider mb-1">Created At</h3>
                      <p class="text-gray-900 font-medium">{{ formatDate(delivery.createdAt) }}</p>
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
                        <p class="text-sm text-gray-500">{{ delivery.restaurantAddress || 'Chung cư Season Avenue' }}</p>
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
                        <p class="text-sm text-gray-500 break-words">{{ delivery.shippingAddress || '22 Ao Sen, Mộ Lao, Hà Đông, Hà Nội' }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Delivery Status Actions -->
                  <div v-if="canUpdateStatus(delivery)" class="flex justify-between items-center border-t border-gray-200 pt-6">
                    <div class="text-sm text-gray-600">
                      <span v-if="delivery.status === 'assigned'">
                        Ready to start delivery? Click "Start Delivery" to let the customer know you're on your way.
                      </span>
                      <span v-else-if="delivery.status === 'delivering'">
                        Delivered the order? Click "Complete Delivery" to mark this delivery as complete.
                      </span>
                    </div>
                    
                    <div>
                      <button 
                        v-if="delivery.status === 'assigned'"
                        @click="updateDeliveryStatus(delivery.deliveryId, 'delivering')"
                        class="btn btn-primary"
                        :disabled="updating"
                      >
                        <span v-if="updating">Updating...</span>
                        <span v-else>Start Delivery</span>
                      </button>
                      
                      <button 
                        v-if="delivery.status === 'delivering'"
                        @click="updateDeliveryStatus(delivery.deliveryId, 'delivered')"
                        class="btn btn-primary"
                        :disabled="updating"
                      >
                        <span v-if="updating">Updating...</span>
                        <span v-else>Complete Delivery</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Order Items -->
            <div class="lg:col-span-1">
              <!-- Order Information Card -->
              <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 class="text-lg font-medium text-gray-900">Order Information</h2>
                </div>
                <div class="p-6">
                  <div v-if="order" class="space-y-4">
                    <!-- Order Status -->
                    <div>
                      <span class="text-sm text-gray-500 block mb-1">Order Status:</span>
                      <span :class="getOrderStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                        {{ formatOrderStatus(order.status) }}
                      </span>
                    </div>
                    
                    <!-- Order Time and ID -->
                    <div>
                      <span class="text-sm text-gray-500 block mb-1">Order Placed:</span>
                      <span class="text-sm font-medium">{{ formatDate(order.createdAt) }}</span>
                    </div>
                    
                    <!-- Customer Information -->
                    <div class="border-t border-gray-200 pt-4 mt-4">
                      <h3 class="text-sm font-medium text-gray-900 mb-3">Customer Details</h3>
                      <div class="flex items-center mb-2">
                        <UserIcon class="h-4 w-4 text-gray-400 mr-2" />
                        <span class="text-sm">{{ order.customer?.name || 'Customer Name' }}</span>
                      </div>
                      <div class="flex items-center mb-2">
                        <PhoneIcon class="h-4 w-4 text-gray-400 mr-2" />
                        <span class="text-sm">{{ order.phoneNumber || 'N/A' }}</span>
                      </div>
                    </div>
                    
                    <!-- Payment Information -->
                    <div class="border-t border-gray-200 pt-4 mt-4">
                      <h3 class="text-sm font-medium text-gray-900 mb-3">Payment Details</h3>
                      <div class="flex justify-between mb-2">
                        <span class="text-sm text-gray-500">Method:</span>
                        <span class="text-sm font-medium">{{ order.paymentMethod || 'Cash on Delivery' }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-sm text-gray-500">Status:</span>
                        <span :class="getPaymentStatusClass(order.paymentStatus)" class="text-sm font-medium">
                          {{ formatPaymentStatus(order.paymentStatus) }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Special Instructions -->
                    <div v-if="order.specialInstructions" class="border-t border-gray-200 pt-4 mt-4">
                      <h3 class="text-sm font-medium text-gray-900 mb-2">Special Instructions</h3>
                      <p class="text-sm text-gray-600 italic">{{ order.specialInstructions }}</p>
                    </div>
                  </div>
                  
                  <div v-else class="text-center py-4">
                    <p class="text-gray-500">Order information not available</p>
                    <button 
                      @click="fetchOrderData" 
                      class="mt-2 text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      Retry loading order
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Order Items Card -->
              <div class="bg-white shadow-md rounded-lg overflow-hidden">
                <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 class="text-lg font-medium text-gray-900">Order Items</h2>
                </div>
                <div class="p-6">
                  <div v-if="!order || !order.orderItems || order.orderItems.length === 0" class="text-center py-4">
                    <p class="text-gray-500">No items information available</p>
                  </div>
                  <ul v-else class="divide-y divide-gray-200">
                    <li v-for="item in order.orderItems" :key="item.menuItemId" class="py-4 flex">
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">{{ item.name || `Item #${item.menuItemId}` }}</p>
                        <p class="text-sm text-gray-500">
                          {{ item.quantity }} × {{ formatPrice(item.unitPrice) }}
                        </p>
                      </div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ formatPrice(item.totalPrice) }}
                      </div>
                    </li>
                  </ul>
                  
                  <div v-if="order" class="border-t border-gray-200 mt-4 pt-4">
                    <div class="flex justify-between items-center">
                      <span class="text-sm text-gray-500">Subtotal</span>
                      <span class="text-sm font-medium text-gray-900">{{ formatPrice(order.subtotal || 0) }}</span>
                    </div>
                    <div class="flex justify-between items-center mt-2">
                      <span class="text-sm text-gray-500">Delivery Fee</span>
                      <span class="text-sm font-medium text-gray-900">{{ formatPrice(order.deliveryFee || delivery.fee || 0) }}</span>
                    </div>
                    <div class="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
                      <span class="text-base font-medium text-gray-900">Total</span>
                      <span class="text-base font-medium text-gray-900">{{ formatPrice(order.totalAmount || 0) }}</span>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { useAuthStore } from '@/stores/auth';
import { deliveryService } from '@/services/delivery.service';
import { orderService } from '@/services/order.service';
import ShipperSidebar from '@/components/shipper/ShipperSidebar.vue';
import { 
  ArrowLeftIcon,
  ExclamationCircleIcon,
  UserIcon,
  PhoneIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline';
import axios from 'axios';

const route = useRoute();
const $toast = useToast();
const authStore = useAuthStore();

const id = ref(route.query.deliveryId);
const loading = ref(true);
const updating = ref(false);
const delivery = ref(null);
const order = ref(null);
const orderId = ref(route.query.orderId);

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
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
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

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString();
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

const canUpdateStatus = (delivery) => {
  if (!delivery) return false;
  return ['assigned', 'delivering'].includes(delivery.status);
};

const fetchDeliveryData = async () => {
  console.log('Fetching delivery data...');
  console.log(orderId.value);
  
  loading.value = true;
  try {
    // Fetch delivery data
    const response = await axios.get(`http://localhost:8000/delivery/order/${route.query.orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      }
    });
    
    delivery.value = response.data;
    
    // After successfully fetching delivery data, fetch order details
    if (delivery.value && delivery.value.orderId) {
      await fetchOrderData();
    }
  } catch (error) {
    console.error('Error fetching delivery data:', error);
    $toast.error('Failed to fetch delivery data');
  } finally {
    loading.value = false;
  }
};

const updateDeliveryStatus = async (deliveryId, newStatus) => {
  updating.value = true;
  
  try {
    await deliveryService.updateDeliveryStatus(deliveryId, newStatus);
    
    // Update delivery in local state
    delivery.value.status = newStatus;
    
    $toast.success(`Delivery status updated to ${formatStatus(newStatus)}`);
  } catch (error) {
    $toast.error(error.message || 'Failed to update delivery status');
  } finally {
    updating.value = false;
  }
};

const getOrderStatusClass = (status) => {
  const statusClassMap = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'preparing': 'bg-purple-100 text-purple-800',
    'ready': 'bg-green-100 text-green-800',
    'completed': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  
  return statusClassMap[status] || 'bg-gray-100 text-gray-800';
};

const formatOrderStatus = (status) => {
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'preparing': 'Preparing',
    'ready': 'Ready for Pickup',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status] || status;
};

const getPaymentStatusClass = (status) => {
  const statusClassMap = {
    'unpaid': 'text-red-500',
    'paid': 'text-green-500'
  };
  
  return statusClassMap[status] || 'text-gray-500';
};

const formatPaymentStatus = (status) => {
  const statusMap = {
    'unpaid': 'Unpaid',
    'paid': 'Paid'
  };
  
  return statusMap[status] || status;
};

const fetchOrderData = async () => {
  try {
    const orderResponse = await axios.get(`http://localhost:8000/orders/${delivery.value.orderId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      }
    });
    order.value = orderResponse.data;
  } catch (orderError) {
    console.error('Error fetching order details:', orderError);
    $toast.warning('Could not load order details');
  }
};

onMounted(() => {
  fetchDeliveryData();
});
</script>
