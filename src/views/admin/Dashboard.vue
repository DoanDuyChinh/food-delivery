<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar :active-section="'dashboard'" />
    
    <div class="lg:pl-64 flex flex-col flex-1">
      <main class="flex-1 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
          
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Total Orders Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-primary-light rounded-md p-3">
                    <ShoppingBagIcon class="h-6 w-6 text-primary" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                      <dd class="flex items-baseline">
                        <div class="text-2xl font-semibold text-gray-900">{{ orderCount }}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                  <router-link to="/admin/orders" class="font-medium text-primary hover:text-primary-dark">View all orders</router-link>
                </div>
              </div>
            </div>
            
            <!-- Total Revenue Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <CurrencyDollarIcon class="h-6 w-6 text-green-600" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd class="flex items-baseline">
                        <div class="text-2xl font-semibold text-gray-900">{{ formatPrice(totalRevenue) }}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                  <router-link to="/admin/orders" class="font-medium text-primary hover:text-primary-dark">View details</router-link>
                </div>
              </div>
            </div>
            
            <!-- Active Shippers Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <TruckIcon class="h-6 w-6 text-blue-600" />
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">Active Shippers</dt>
                      <dd class="flex items-baseline">
                        <div class="text-2xl font-semibold text-gray-900">{{ activeShippersCount }}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-5 py-3">
                <div class="text-sm">
                  <router-link to="/admin/shippers" class="font-medium text-primary hover:text-primary-dark">View all shippers</router-link>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Recent Orders -->
          <div class="mt-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
            <div class="bg-white shadow overflow-hidden sm:rounded-md">
              <ul class="divide-y divide-gray-200">
                <li v-for="order in recentOrders" :key="order.id">
                  <div class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <p class="text-sm font-medium text-primary truncate">Order #{{ order.id }}</p>
                        <div class="ml-2">
                          <span :class="getStatusClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                            {{ formatStatus(order.status) }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-2 flex-shrink-0 flex">
                        <p class="text-sm text-gray-500">{{ formatPrice(order.totalAmount) }}</p>
                      </div>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                      <div class="sm:flex">
                        <p class="flex items-center text-sm text-gray-500">
                          <UserIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          Customer #{{ order.userId }}
                        </p>
                        <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <MapPinIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {{ truncateAddress(order.shippingAddress) }}
                        </p>
                      </div>
                      <router-link :to="`/admin/orders/${order.id}`" class="mt-2 flex items-center text-sm text-primary sm:mt-0">
                        View details
                        <ArrowRightIcon class="ml-1 h-4 w-4" />
                      </router-link>
                    </div>
                  </div>
                </li>
              </ul>
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
import { orderService } from '@/services/order.service';
import { deliveryService } from '@/services/delivery.service';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import { 
  ShoppingBagIcon, 
  CurrencyDollarIcon, 
  TruckIcon, 
  UserIcon, 
  MapPinIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline';

const $toast = useToast();
const loading = ref(true);
const orders = ref([]);
const shippers = ref([]);

const orderCount = computed(() => orders.value.length);
const recentOrders = computed(() => orders.value.slice(0, 5));

const totalRevenue = computed(() => {
  return orders.value.reduce((total, order) => {
    if (order.status === 'delivered') {
      return total + order.totalAmount;
    }
    return total;
  }, 0);
});

const activeShippersCount = computed(() => {
  return shippers.value.filter(shipper => shipper.status === 'available').length;
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatStatus = (status) => {
  const statusMap = {
    'created': 'Placed',
    'assigned': 'Preparing',
    'delivering': 'Delivering',
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

const truncateAddress = (address) => {
  if (!address) return '';
  return address.length > 30 ? address.substring(0, 30) + '...' : address;
};

const fetchData = async () => {
  loading.value = true;
  
  try {
    // Get all orders
    const ordersData = await orderService.getOrders();
    orders.value = ordersData;
    
    // Get all shippers
    const shippersData = await deliveryService.getShippers();
    shippers.value = shippersData;
  } catch (error) {
    $toast.error(error.message || 'Failed to load dashboard data');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
