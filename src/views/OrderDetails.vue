<template>
  <div class="py-10 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center mb-6">
        <router-link to="/orders" class="text-primary hover:text-primary-dark flex items-center">
          <ArrowLeftIcon class="h-5 w-5 mr-1" />
          Back to Orders
        </router-link>
      </div>
      
      <div v-if="loading" class="flex justify-center py-10">
        <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else-if="!order" class="bg-white shadow-md rounded-lg p-8 text-center">
        <ExclamationCircleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-medium text-gray-900 mb-2">Order Not Found</h2>
        <p class="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <router-link to="/orders" class="btn btn-primary">
          View All Orders
        </router-link>
      </div>
      
      <div v-else>
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Order #{{ order.id }}</h1>
              <p class="text-sm text-gray-600">Placed on {{ formatDate(order.createdAt || new Date()) }}</p>
            </div>
            <div>
              <span :class="getStatusClass(order.status)" class="px-4 py-2 rounded-full text-sm font-medium">
                {{ formatStatus(order.status) }}
              </span>
            </div>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 class="text-lg font-medium text-gray-900 mb-3">Delivery Information</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center mb-3">
                    <MapPinIcon class="h-5 w-5 text-gray-400 mr-2" />
                    <span class="text-gray-700">{{ order.shippingAddress }}</span>
                  </div>
                  <div class="flex items-center">
                    <PhoneIcon class="h-5 w-5 text-gray-400 mr-2" />
                    <span class="text-gray-700">{{ order.phoneNumber }}</span>
                  </div>
                </div>
              </div>
              
              <div v-if="order.delivery && order.delivery.shipper">
                <h2 class="text-lg font-medium text-gray-900 mb-3">Delivery Details</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center mb-3">
                    <UserIcon class="h-5 w-5 text-gray-400 mr-2" />
                    <span class="text-gray-700">{{ order.delivery.shipper.name }}</span>
                  </div>
                  <div class="flex items-center mb-3">
                    <PhoneIcon class="h-5 w-5 text-gray-400 mr-2" />
                    <span class="text-gray-700">{{ order.delivery.shipper.phone }}</span>
                  </div>
                  <div class="flex items-center">
                    <TruckIcon class="h-5 w-5 text-gray-400 mr-2" />
                    <span class="text-gray-700">{{ order.delivery.shipper.vehicleType }} ({{ order.delivery.shipper.vehiclePlate }})</span>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 class="text-lg font-medium text-gray-900 mb-3">Order Items</h2>
            <div class="bg-gray-50 rounded-lg overflow-hidden mb-6">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in order.orderItems" :key="item.menuItemId">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span class="text-gray-500 text-xs">Item</span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">Menu Item #{{ item.menuItemId }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {{ formatPrice(item.unitPrice) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {{ formatPrice(item.totalPrice) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="border-t border-gray-200 pt-6">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">{{ formatPrice(order.subtotal) }}</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">Delivery Fee</span>
                <span class="font-medium">{{ formatPrice(order.deliveryFee) }}</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-gray-200">
                <span class="text-lg font-bold">Total</span>
                <span class="text-lg font-bold text-primary">{{ formatPrice(order.totalAmount) }}</span>
              </div>
            </div>
            
            <div class="mt-6 flex flex-wrap gap-4">
              <router-link 
                v-if="['delivering', 'assigned'].includes(order.status)"
                :to="`/delivery/${order.id}`" 
                class="btn btn-primary inline-flex items-center"
              >
                Track Delivery
                <MapPinIcon class="ml-2 h-5 w-5" />
              </router-link>
              
              <button 
                v-if="order.status === 'created'" 
                @click="cancelOrder"
                class="btn btn-outline text-red-600 border-red-600 hover:bg-red-50"
                :disabled="cancellingOrder"
              >
                <span v-if="cancellingOrder">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cancelling...
                </span>
                <span v-else>Cancel Order</span>
              </button>
              
              <button
                v-if="order.status === 'delivered'"
                class="btn btn-outline"
                @click="reorderItems"
              >
                Order Again
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
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { useCartStore } from '@/stores/cart';
import { orderService } from '@/services/order.service';
import { restaurantService } from '@/services/restaurant.service';
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  PhoneIcon, 
  UserIcon, 
  TruckIcon, 
  ExclamationCircleIcon 
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const $toast = useToast();

const loading = ref(true);
const order = ref(null);
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

const cancelOrder = async () => {
  if (cancellingOrder.value) return;
  
  if (!confirm('Are you sure you want to cancel this order?')) {
    return;
  }
  
  cancellingOrder.value = true;
  
  try {
    await orderService.updateOrderStatus(order.value.id, 'cancelled');
    order.value.status = 'cancelled';
    $toast.success('Order cancelled successfully');
  } catch (error) {
    $toast.error(error.message || 'Failed to cancel order');
  } finally {
    cancellingOrder.value = false;
  }
};

const reorderItems = async () => {
  try {
    // Clear current cart
    cartStore.clearCart();
    
    // Get the menu to find the items
    const menu = await restaurantService.getMenu();
    
    // Add each item to cart
    order.value.orderItems.forEach(orderItem => {
      const menuItem = menu.find(item => item.id === orderItem.menuItemId);
      
      if (menuItem) {
        // Add item to cart multiple times based on quantity
        for (let i = 0; i < orderItem.quantity; i++) {
          cartStore.addItem(menuItem);
        }
      }
    });
    
    $toast.success('Items added to cart');
    router.push('/checkout');
  } catch (error) {
    $toast.error(error.message || 'Failed to add items to cart');
  }
};

const fetchOrder = async () => {
  loading.value = true;
  
  try {
    const orderId = parseInt(route.params.id);
    const response = await orderService.getOrderById(orderId);
    order.value = response;
  } catch (error) {
    $toast.error(error.message || 'Failed to load order details');
    order.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrder();
});
</script>
