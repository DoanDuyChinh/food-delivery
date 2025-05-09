<template>
  <div class="py-10 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
      
      <div v-if="cartStore.isEmpty" class="bg-white shadow-md rounded-lg p-8 text-center">
        <ShoppingCartIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 class="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
        <p class="text-gray-600 mb-6">Add items to your cart to proceed with checkout</p>
        <router-link to="/menu" class="btn btn-primary">
          View Menu
        </router-link>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Order Summary -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Order Summary</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div v-for="item in cartStore.items" :key="item.id" class="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-16 h-16 bg-gray-200 rounded overflow-hidden">
                      <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                      <p class="text-sm text-gray-600">{{ formatPrice(item.price) }} x {{ item.quantity }}</p>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <p class="font-medium text-gray-900">{{ formatPrice(item.price * item.quantity) }}</p>
                    <button 
                      @click="cartStore.removeItem(item.id)"
                      class="ml-4 text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Delivery Address -->
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Delivery Information</h2>
            </div>
            <div class="p-6">
              <form @submit.prevent="placeOrder">
                <div class="grid grid-cols-1 gap-6">
                  <div>
                    <label for="shippingAddress" class="block text-sm font-medium text-gray-700">Shipping Address</label>
                    <textarea
                      id="shippingAddress"
                      v-model="shippingAddress"
                      rows="3"
                      required
                      class="form-input mt-1"
                      placeholder="Enter your complete address"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      id="phoneNumber"
                      v-model="phoneNumber"
                      type="tel"
                      required
                      class="form-input mt-1"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label for="specialInstructions" class="block text-sm font-medium text-gray-700">Special Instructions (Optional)</label>
                    <textarea
                      id="specialInstructions"
                      v-model="specialInstructions"
                      rows="3"
                      class="form-input mt-1"
                      placeholder="Any specific delivery instructions or food preferences"
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Order Total -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow-md rounded-lg overflow-hidden sticky top-6">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Order Total</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-medium">{{ formatPrice(cartStore.subtotal) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Delivery Fee</span>
                  <span class="font-medium">{{ formatPrice(deliveryFee) }}</span>
                </div>
                <div class="border-t border-gray-200 pt-4 flex justify-between">
                  <span class="text-lg font-medium">Total</span>
                  <span class="text-lg font-bold text-primary">{{ formatPrice(cartStore.subtotal + deliveryFee) }}</span>
                </div>
                
                <div class="mt-6">
                  <button
                    @click="placeOrder"
                    class="w-full btn btn-primary"
                    :disabled="isSubmitting || !shippingAddress || !phoneNumber"
                  >
                    <span v-if="isSubmitting">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                    <span v-else>Place Order</span>
                  </button>
                </div>
                
                <div class="mt-4">
                  <p class="text-sm text-gray-500">
                    By placing your order, you agree to our <a href="#" class="text-primary">Terms of Service</a> and <a href="#" class="text-primary">Privacy Policy</a>.
                  </p>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { orderService } from '@/services/order.service';
import { ShoppingCartIcon, TrashIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const $toast = useToast();

const deliveryFee = ref(7054); // Fixed delivery fee from mock data
const shippingAddress = ref('');
const phoneNumber = ref('');
const specialInstructions = ref('');
const isSubmitting = ref(false);

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const placeOrder = async () => {
  if (!shippingAddress.value || !phoneNumber.value) {
    $toast.error('Please fill in all required fields');
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    const orderData = {
      shippingAddress: shippingAddress.value,
      phoneNumber: phoneNumber.value,
      orderItems: cartStore.cartItems
    };
    
    const response = await orderService.createOrder(orderData);
    
    $toast.success('Order placed successfully!');
    
    // Clear cart after successful order
    cartStore.clearCart();
    
    // Redirect to order details page
    router.push(`/orders/${response.id}`);
  } catch (error) {
    $toast.error(error.message || 'Failed to place order. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  // Load user data if available
  if (authStore.user) {
    phoneNumber.value = authStore.user.phone || '';
  }
  
  // Initialize cart from localStorage
  cartStore.loadFromLocalStorage();
});
</script>
