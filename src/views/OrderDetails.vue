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
            
            <!-- Delivery Map -->
            <div v-if="order.delivery && order.delivery.geometryLine" class="mb-6">
              <h2 class="text-lg font-medium text-gray-900 mb-3">Delivery Route</h2>
              <div class="bg-gray-50 rounded-lg overflow-hidden">
                <div id="deliveryMap" class="h-64 w-full"></div>
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
                        <div v-if="menuItems[item.menuItemId]?.imageUrl" class="flex-shrink-0 h-10 w-10 rounded-full mr-4 overflow-hidden">
                          <img class="h-10 w-10 object-cover" :src="menuItems[item.menuItemId].imageUrl" alt="" />
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ menuItems[item.menuItemId]?.name || `Menu Item #${item.menuItemId}` }}
                          </div>
                          <div v-if="menuItems[item.menuItemId]?.description" class="text-sm text-gray-500 truncate max-w-xs">
                            {{ menuItems[item.menuItemId].description }}
                          </div>
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
// Import Leaflet library for mapping
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
const router = useRouter();
const cartStore = useCartStore();
const $toast = useToast();

const loading = ref(true);
const order = ref(null);
const cancellingOrder = ref(false);
const menuItems = ref({});

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

const fetchMenuItems = async () => {
  if (!order.value || !order.value.orderItems) return;
  
  try {
    // Get menu from restaurant service
    const menu = await restaurantService.getMenu();
    
    // Create a lookup object for quick access
    menuItems.value = menu.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching menu items:', error);
  }
};

const fetchOrder = async () => {
  loading.value = true;
  
  try {
    const orderId = parseInt(route.params.id);
    const response = await orderService.getOrderById(orderId);
    order.value = response;
    
    // Fetch menu details
    await fetchMenuItems();
  } catch (error) {
    $toast.error(error.message || 'Failed to load order details');
    order.value = null;
  } finally {
    loading.value = false;
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

  // Get coordinates from the API response
  const fromCoords = order.value.delivery.fromCoords;
  const toCoords = order.value.delivery.toCoords;
  
  // Create map centered on midpoint between from and to
  const map = L.map('deliveryMap').setView([
    (fromCoords[1] + toCoords[1]) / 2, // Latitude
    (fromCoords[0] + toCoords[0]) / 2  // Longitude
  ], 14);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Add markers for restaurant and delivery address
  // Note: The API provides [longitude, latitude] but Leaflet needs [latitude, longitude]
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

  // Draw the route polyline using the geometryLine from the API
  try {
    // Decode the polyline string from the API
    const routePoints = decodePolyline(order.value.delivery.geometryLine);
    
    // Flip coordinates to match [lat, lng] format required by Leaflet
    const leafletPoints = routePoints.map(point => [point[0], point[1]]);
    
    // Draw the route on the map
    L.polyline(leafletPoints, { color: '#4F46E5', weight: 5 }).addTo(map);
    
    // Fit the map to the bounds of the route
    map.fitBounds(L.latLngBounds(leafletPoints));
  } catch (error) {
    console.error('Error drawing route:', error);
    // Fallback: draw a straight line between the two points
    L.polyline([
      [fromCoords[1], fromCoords[0]],
      [toCoords[1], toCoords[0]]
    ], { color: '#4F46E5', weight: 5, dashArray: '5, 10' }).addTo(map);
  }
};

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
</script>