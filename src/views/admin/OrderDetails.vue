<template>
  <div>
    <div class="flex items-center justify-between m-9">
      <h1 class="text-2xl font-bold">Order Details #{{ id }}</h1>
      <router-link to="/admin/orders" class="btn btn-outline flex items-center">
        <ArrowLeftIcon class="h-5 w-5 mr-2" />
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
      <router-link to="/admin/orders" class="btn btn-primary">
        View All Orders
      </router-link>
    </div>
    
    <div v-else>
      <!-- Order status card -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center">
          <div>
            <h2 class="text-lg font-medium text-gray-900">Order Status</h2>
            <p class="text-sm text-gray-600">Last updated: {{ formatDate(order.updatedAt || order.createdAt) }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <span :class="getStatusClass(order.status)" class="px-4 py-2 rounded-full text-sm font-medium">
              {{ formatStatus(order.status) }}
            </span>
            
            <!-- Status change dropdown -->
            <div class="relative" v-if="order.status !== 'delivered' && order.status !== 'cancelled'">
              <div>
                <button 
                  @click="isStatusDropdownOpen = !isStatusDropdownOpen" 
                  class="btn btn-outline text-sm flex items-center"
                >
                  Change Status
                  <ChevronDownIcon class="ml-2 h-4 w-4" />
                </button>
              </div>
              
              <div 
                v-if="isStatusDropdownOpen" 
                class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <div class="py-1">
                  <button 
                    v-for="status in availableStatuses" 
                    :key="status.value"
                    @click="updateOrderStatus(status.value)"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :disabled="updatingStatus"
                  >
                    {{ status.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Customer info and Delivery info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Customer info -->
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Customer Information</h2>
          </div>
          <div class="p-6">
            <p class="flex items-center mb-3">
              <UserIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-gray-700">Customer #{{ order.userId }}</span>
            </p>
            <p class="flex items-center mb-3">
              <MapPinIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-gray-700">{{ order.shippingAddress }}</span>
            </p>
            <p class="flex items-center">
              <PhoneIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-gray-700">{{ order.phoneNumber }}</span>
            </p>
          </div>
        </div>
        
        <!-- Delivery info -->
        <div v-if="order.delivery" class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Delivery Information</h2>
          </div>
          <div class="p-6">
            <p class="flex items-center mb-3">
              <UserIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-gray-700">{{ order.delivery.shipper.name }}</span>
            </p>
            <p class="flex items-center mb-3">
              <PhoneIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-gray-700">{{ order.delivery.shipper.phone }}</span>
            </p>
            <p class="flex items-center mb-3">
              <TruckIcon class="h-5 w-5 text-gray-400 mr-2" />
              <span class="text-gray-700">{{ order.delivery.shipper.vehicleType }} ({{ order.delivery.shipper.vehiclePlate }})</span>
            </p>
            <p class="flex items-center">
              <span :class="getDeliveryStatusClass(order.delivery.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ formatDeliveryStatus(order.delivery.status) }}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Order items -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Order Items</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in order.orderItems" :key="item.menuItemId">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">Menu Item #{{ item.menuItemId }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {{ formatPrice(item.unitPrice) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {{ item.quantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {{ formatPrice(item.totalPrice) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-6 border-t border-gray-200">
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Subtotal</span>
            <span>{{ formatPrice(order.subtotal) }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Delivery Fee</span>
            <span>{{ formatPrice(order.deliveryFee) }}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-gray-200">
            <span class="font-bold">Total</span>
            <span class="font-bold">{{ formatPrice(order.totalAmount) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Delivery map -->
      <div v-if="order.delivery && order.delivery.geometryLine" class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Delivery Route</h2>
        </div>
        <div id="deliveryMap" style="height: 512px; width: 100%;"></div> <!-- Using inline style for double height -->> <!-- Changed from h-64 to h-128 (twice the height) -->
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <div class="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span class="text-sm text-gray-700">Restaurant</span>
            </div>
            <div class="flex items-center">
              <div class="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
              <span class="text-sm text-gray-700">Delivery Address</span>
            </div>
          </div>
          <div class="text-sm text-gray-600">
            <div class="flex justify-between">
              <span>Distance: {{ (order.delivery.distance).toFixed(1) }} km</span>
              <span>Estimated time: {{ Math.round(order.delivery.duration) }} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { orderService } from '@/services/order.service';
import {
  ArrowLeftIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  TruckIcon,
  ExclamationCircleIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const route = useRoute();
const $toast = useToast();

const id = ref(route.params.id);
const order = ref(null);
const loading = ref(true);
const isStatusDropdownOpen = ref(false);
const updatingStatus = ref(false);

const availableStatuses = [
  { value: 'created', label: 'Order Placed' },
  { value: 'assigned', label: 'Preparing' },
  { value: 'delivering', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
];

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

const formatDeliveryStatus = (status) => {
  const statusMap = {
    'assigned': 'Assigned',
    'delivering': 'In Progress',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  
  return statusMap[status] || status;
};

const getDeliveryStatusClass = (status) => {
  const statusClassMap = {
    'assigned': 'bg-blue-100 text-blue-800',
    'delivering': 'bg-yellow-100 text-yellow-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  
  return statusClassMap[status] || 'bg-gray-100 text-gray-800';
};

const updateOrderStatus = async (status) => {
  if (updatingStatus.value) return;
  
  updatingStatus.value = true;
  isStatusDropdownOpen.value = false;
  
  try {
    await orderService.updateOrderStatus(order.value.id, { status });
    
    // Update the local order status
    order.value.status = status;
    
    // Show success message
    $toast.success(`Order status updated to ${formatStatus(status)}`);
  } catch (error) {
    $toast.error(error.message || 'Failed to update order status');
  } finally {
    updatingStatus.value = false;
  }
};

// Function to decode the polyline string
const decodePolyline = (str) => {
  const points = [];
  let index = 0, lat = 0, lng = 0;

  while (index < str.length) {
    let b, shift = 0, result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lat * 1e-5, lng * 1e-5]);
  }

  return points;
};

// Initialize delivery map
const initMap = () => {
  if (!order.value?.delivery?.geometryLine) return;
  
  // Remove existing map if any
  const container = L.DomUtil.get('deliveryMap');
  if (container != null) {
    container._leaflet_id = null;
  }

  // Get coordinates
  const fromCoords = order.value.delivery.fromCoords;
  const toCoords = order.value.delivery.toCoords;
  
  // Create map centered on midpoint between from and to
  const map = L.map('deliveryMap').setView([
    (fromCoords[1] + toCoords[1]) / 2,
    (fromCoords[0] + toCoords[0]) / 2
  ], 14);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Add markers for restaurant and delivery address
  const restaurantMarker = L.marker([fromCoords[1], fromCoords[0]], {
    icon: L.divIcon({
      html: `<div class="h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>`,
      className: 'custom-div-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  }).addTo(map);
  restaurantMarker.bindPopup('Restaurant');

  const deliveryMarker = L.marker([toCoords[1], toCoords[0]], {
    icon: L.divIcon({
      html: `<div class="h-4 w-4 rounded-full bg-red-500 border-2 border-white"></div>`,
      className: 'custom-div-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  }).addTo(map);
  deliveryMarker.bindPopup('Delivery Address');

  // Draw the route polyline
  try {
    // Decode the polyline string
    const routePoints = decodePolyline(order.value.delivery.geometryLine);
    
    // Flip coordinates to match [lat, lng] format required by Leaflet
    const leafletPoints = routePoints.map(point => [point[0], point[1]]);
    
    // Draw the route on the map
    L.polyline(leafletPoints, { color: '#4F46E5', weight: 5 }).addTo(map);
    
    // Fit the map to the bounds of the route
    map.fitBounds(L.latLngBounds(leafletPoints));
  } catch (error) {
    console.error('Error drawing route:', error);
    // Fallback: draw a straight line
    L.polyline([
      [fromCoords[1], fromCoords[0]],
      [toCoords[1], toCoords[0]]
    ], { color: '#4F46E5', weight: 5, dashArray: '5, 10' }).addTo(map);
  }
};

const fetchOrder = async () => {
  loading.value = true;
  
  try {
    const orderId = parseInt(id.value);
    // Use the appropriate service method for fetching admin order details
    const response = await orderService.getOrderById(orderId);
    order.value = response;
  } catch (error) {
    $toast.error(error.message || 'Failed to load order details');
    order.value = null;
  } finally {
    loading.value = false;
  }
};

// Watch for route parameter changes
watch(() => route.params.id, (newId) => {
  id.value = newId;
  fetchOrder();
});

onMounted(() => {
  fetchOrder().then(() => {
    // Initialize map after order data is loaded
    if (order.value?.delivery) {
      // Small timeout to ensure DOM is ready
      setTimeout(() => {
        initMap();
      }, 100);
    }
  });
});

// Make sure to handle click outside for status dropdown
const handleClickOutside = (event) => {
  if (isStatusDropdownOpen.value) {
    isStatusDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
