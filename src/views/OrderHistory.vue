<template>
  <div class="py-10 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
      
      <div v-if="loading" class="flex justify-center py-10">
        <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="orders?.length === 0 || orders == null" class="bg-white shadow-md rounded-lg p-8 text-center">
        <ShoppingBagIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 class="text-xl font-medium text-gray-900 mb-2">No orders yet</h2>
        <p class="text-gray-600 mb-6">Start ordering delicious food today!</p>
        <router-link to="/menu" class="btn btn-primary">
          View Menu
        </router-link>
      </div>
      
      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 class="text-lg font-medium text-gray-900">Order #{{ order.id }}</h2>
              <p class="text-sm text-gray-600">Placed on {{ formatDate(order.createdAt || new Date()) }}</p>
            </div>
            <div>
              <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ formatStatus(order.status) }}
              </span>
            </div>
          </div>
          
          <div class="p-6">
            <div class="mb-4">
              <div class="flex items-center mb-3">
                <MapPinIcon class="h-5 w-5 text-gray-400 mr-2" />
                <span class="text-gray-700">{{ order.shippingAddress }}</span>
              </div>
              <div class="flex items-center">
                <PhoneIcon class="h-5 w-5 text-gray-400 mr-2" />
                <span class="text-gray-700">{{ order.phoneNumber }}</span>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">{{ formatPrice(order.subtotal) }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Delivery Fee:</span>
                <span class="font-medium">{{ formatPrice(order.deliveryFee) }}</span>
              </div>
              <div class="flex justify-between font-bold">
                <span>Total:</span>
                <span class="text-primary">{{ formatPrice(order.totalAmount) }}</span>
              </div>
            </div>
            
            <div class="mt-6 flex justify-between">
              <router-link :to="`/orders/${order.id}`" class="btn btn-outline inline-flex items-center">
                View Details
                <ArrowRightIcon class="ml-2 h-4 w-4" />
              </router-link>
              
              <router-link 
                v-if="['delivering', 'assigned'].includes(order.status)"
                :to="`/delivery/${order.id}`" 
                class="btn btn-primary inline-flex items-center"
              >
                Track Delivery
                <MapPinIcon class="ml-2 h-4 w-4" />
              </router-link>
              
              <button 
                v-if="order.status === 'created'" 
                @click="cancelOrder(order.id)"
                class="btn btn-outline text-red-600 border-red-600 hover:bg-red-50"
                :disabled="cancellingOrder"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import { orderService } from '@/services/order.service';
import { ShoppingBagIcon, MapPinIcon, PhoneIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

const $toast = useToast();
const loading = ref(true);
const orders = ref([]);
const cancellingOrder = ref(false);

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatStatus = (status) => {
  const statusMap = {
    'created': 'Order Placed',
    'assigned': 'Preparing',
    'delivering': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const statusClassMap = {
    'created': 'bg-blue-100 text-blue-800',
    'assigned': 'bg-yellow-100 text-yellow-800',
    'delivering': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  
  return statusClassMap[status] || 'bg-gray-100 text-gray-800';
};

const cancelOrder = async (orderId) => {
  if (cancellingOrder.value) return;
  
  if (!confirm('Are you sure you want to cancel this order?')) {
    return;
  }
  
  cancellingOrder.value = true;
  
  try {
    await orderService.updateOrderStatus(orderId, 'cancelled');
    
    // Update the order in the list
    const orderIndex = orders.value.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'cancelled';
    }
    
    $toast.success('Order cancelled successfully');
  } catch (error) {
    $toast.error(error.message || 'Failed to cancel order');
  } finally {
    cancellingOrder.value = false;
  }
};

const fetchOrders = async () => {
  loading.value = true;
  
  try {
    // Get orders for current user
    const response = await orderService.getOrders();
    orders.value = response;
  } catch (error) {
    $toast.error(error.message || 'Failed to load orders');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});
</script>
