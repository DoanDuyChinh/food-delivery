<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar :active-section="'orders'" />
    
    <div class="lg:pl-64 flex flex-col flex-1">
      <main class="flex-1 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Order Management</h1>
            <div class="flex items-center space-x-4">
              <div class="relative">
                <select
                  v-model="statusFilter"
                  class="form-input pl-3 pr-10 py-2 text-sm"
                  @change="loadOrders"
                >
                  <option value="">All Statuses</option>
                  <option value="created">Created</option>
                  <option value="assigned">Assigned</option>
                  <option value="delivering">Delivering</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                @click="loadOrders"
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
          
          <div v-else-if="orders.length === 0" class="bg-white shadow-md rounded-lg p-8 text-center">
            <ReceiptRefundIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 class="text-xl font-medium text-gray-900 mb-2">No orders found</h2>
            <p class="text-gray-600">Try changing the filters or check back later</p>
          </div>
          
          <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      #{{ order.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div>{{ getUserName(order.user_id) }}</div>
                      <div class="text-gray-500 text-xs mt-1">{{ truncateAddress(order.shippingAddress) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ formatStatus(order.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ getItemsCount(order) }} items
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ formatPrice(order.totalAmount) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex justify-end space-x-2">
                        <button 
                          @click="viewOrderDetails(order.id)" 
                          class="text-primary hover:text-primary-dark"
                        >
                          View
                        </button>
                        <button 
                          v-if="canUpdateStatus(order)"
                          @click="showStatusModal(order)" 
                          class="text-blue-600 hover:text-blue-900"
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Update Status Modal -->
          <div v-if="showUpdateStatusModal" class="fixed inset-0 overflow-y-auto z-50">
            <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 class="text-lg leading-6 font-medium text-gray-900">
                        Update Order Status
                      </h3>
                      <div class="mt-4">
                        <form @submit.prevent="updateOrderStatus">
                          <div>
                            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                            <select
                              id="status"
                              v-model="selectedStatus"
                              required
                              class="form-input mt-1"
                            >
                              <option v-for="status in availableStatuses" :key="status.value" :value="status.value">
                                {{ status.label }}
                              </option>
                            </select>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    @click="updateOrderStatus"
                    type="button"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                    :disabled="updating"
                  >
                    <span v-if="updating">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                    <span v-else>Update Status</span>
                  </button>
                  <button
                    @click="showUpdateStatusModal = false"
                    type="button"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
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
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { orderService } from '@/services/order.service';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import { ArrowPathIcon } from '@heroicons/vue/24/outline'; 
import { ReceiptRefundIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const $toast = useToast();

const loading = ref(true);
const updating = ref(false);
const orders = ref([]);
const statusFilter = ref('');
const showUpdateStatusModal = ref(false);
const selectedStatus = ref('');
const selectedOrderId = ref(null);
const userDetails = ref({}); // Store user details

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatStatus = (status) => {
  const statusMap = {
    'created': 'Created',
    'assigned': 'Assigned',
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

const getItemsCount = (order) => {
  if (!order.orderItems) return 0;
  return order.orderItems.reduce((total, item) => total + item.quantity, 0);
};

// Function to fetch user details
const fetchUserDetails = async () => {
  // Extract unique user IDs from orders
  console.log("orders.value", orders.value);
  
  const userIds = orders.value.map(order => order.user_id);
  
  // Fetch user details for each unique user ID
  for (const userId of userIds) {    
    if (!userDetails.value[userId]) {
      try {
        const response = await fetch(`http://localhost:8000/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          userDetails.value[userId] = userData;
        }
      } catch (error) {
        console.error(`Error fetching details for user ${userId}:`, error);
      }
    }
  }
};

const getUserName = (userId) => {
  if (userDetails.value[userId]) {
    return userDetails.value[userId].name || userDetails.value[userId].email || `User #${userId}`;
  }
  return `User #${userId}`;
};

const loadOrders = async () => {
  loading.value = true;
  
  try {
    const params = {};
    if (statusFilter.value) {
      params.status = statusFilter.value;
    }
    
    const data = await orderService.getOrders(params);
    orders.value = data;
    
    // Fetch user details for each order
    await fetchUserDetails();
  } catch (error) {
    $toast.error(error.message || 'Failed to load orders');
  } finally {
    loading.value = false;
  }
};

const canUpdateStatus = (order) => {
  // Admin can update status if it's not delivered or cancelled
  return !['delivered', 'cancelled'].includes(order.status);
};

const availableStatuses = computed(() => {
  const currentOrder = orders.value.find(o => o.id === selectedOrderId.value);
  if (!currentOrder) return [];
  
  const statuses = [];
  
  // Define allowed status transitions
  if (currentOrder.status === 'created') {
    statuses.push({ value: 'assigned', label: 'Assign to Shipper' });
    statuses.push({ value: 'cancelled', label: 'Cancel Order' });
  } else if (currentOrder.status === 'assigned') {
    statuses.push({ value: 'delivering', label: 'Start Delivery' });
    statuses.push({ value: 'cancelled', label: 'Cancel Order' });
  } else if (currentOrder.status === 'delivering') {
    statuses.push({ value: 'delivered', label: 'Mark as Delivered' });
    statuses.push({ value: 'cancelled', label: 'Cancel Order' });
  }
  
  return statuses;
});

const showStatusModal = (order) => {
  selectedOrderId.value = order.id;
  selectedStatus.value = availableStatuses.value.length > 0 ? availableStatuses.value[0].value : '';
  showUpdateStatusModal.value = true;
};

const updateOrderStatus = async () => {
  if (!selectedOrderId.value || !selectedStatus.value) return;
  
  updating.value = true;
  
  try {
    await orderService.updateOrderStatus(selectedOrderId.value, selectedStatus.value);
    
    // Update order in the list
    const orderIndex = orders.value.findIndex(o => o.id === selectedOrderId.value);
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = selectedStatus.value;
    }
    
    $toast.success('Order status updated successfully');
    showUpdateStatusModal.value = false;
  } catch (error) {
    $toast.error(error.message || 'Failed to update order status');
  } finally {
    updating.value = false;
  }
};

const viewOrderDetails = (orderId) => {
  router.push(`/admin/orders/${orderId}`);
};

onMounted(() => {
  loadOrders();
});
</script>