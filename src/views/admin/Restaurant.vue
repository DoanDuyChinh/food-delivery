<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar :active-section="'restaurant'" />
    
    <div class="lg:pl-64 flex flex-col flex-1">
      <main class="flex-1 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Restaurant Management</h1>
          
          <div v-if="loading" class="flex justify-center py-10">
            <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">Restaurant Details</h2>
              <div class="flex items-center">
                <span class="mr-2 text-sm">Restaurant Status:</span>
                <button
                  @click="toggleRestaurantStatus"
                  :class="[
                    'relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 ease-in-out',
                    restaurant.isActive ? 'bg-primary' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'absolute inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out',
                      restaurant.isActive ? 'translate-x-6' : 'translate-x-1'
                    ]"
                  ></span>
                </button>
              </div>
            </div>
            
            <div class="p-6">
              <form @submit.prevent="updateRestaurant">
                <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div class="sm:col-span-6">
                    <label for="name" class="block text-sm font-medium text-gray-700">Restaurant Name</label>
                    <div class="mt-1">
                      <input
                        id="name"
                        v-model="form.name"
                        type="text"
                        required
                        class="form-input"
                      />
                    </div>
                  </div>
                  
                  <div class="sm:col-span-6">
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <div class="mt-1">
                      <textarea
                        id="description"
                        v-model="form.description"
                        rows="4"
                        class="form-input"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div class="sm:col-span-6">
                    <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                    <div class="mt-1">
                      <input
                        id="address"
                        v-model="form.address"
                        type="text"
                        required
                        class="form-input"
                      />
                    </div>
                  </div>
                  
                  <div class="sm:col-span-3">
                    <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div class="mt-1">
                      <input
                        id="phoneNumber"
                        v-model="form.phoneNumber"
                        type="tel"
                        required
                        class="form-input"
                      />
                    </div>
                  </div>
                  
                  <div class="sm:col-span-3">
                    <label for="openTime" class="block text-sm font-medium text-gray-700">Opening Time</label>
                    <div class="mt-1">
                      <input
                        id="openTime"
                        v-model="form.openTime"
                        type="time"
                        required
                        class="form-input"
                      />
                    </div>
                  </div>
                  
                  <div class="sm:col-span-3">
                    <label for="closeTime" class="block text-sm font-medium text-gray-700">Closing Time</label>
                    <div class="mt-1">
                      <input
                        id="closeTime"
                        v-model="form.closeTime"
                        type="time"
                        required
                        class="form-input"
                      />
                    </div>
                  </div>
                </div>
                
                <div class="mt-6 flex justify-end">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="updating"
                  >
                    <span v-if="updating">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                    <span v-else>Update Restaurant</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import { restaurantService } from '@/services/restaurant.service';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';

const $toast = useToast();
const loading = ref(true);
const updating = ref(false);
const restaurant = ref({});

const form = reactive({
  name: '',
  description: '',
  address: '',
  phoneNumber: '',
  isActive: true,
  openTime: '',
  closeTime: ''
});

const formatTimeForInput = (timeString) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toTimeString().substring(0, 5);
};

const formatTimeForAPI = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  return `0000-01-01T${hours}:${minutes}:00Z`;
};

const loadRestaurantData = async () => {
  loading.value = true;
  
  try {
    const data = await restaurantService.getRestaurantInfo();
    restaurant.value = data;
    
    // Populate form with restaurant data
    form.name = data.name || '';
    form.description = data.description || '';
    form.address = data.address || '';
    form.phoneNumber = data.phoneNumber || '';
    form.isActive = data.isActive;
    form.openTime = formatTimeForInput(data.openTime);
    form.closeTime = formatTimeForInput(data.closeTime);
  } catch (error) {
    $toast.error(error.message || 'Failed to load restaurant information');
  } finally {
    loading.value = false;
  }
};

const updateRestaurant = async () => {
  updating.value = true;
  
  try {
    // Prepare data according to API requirements
    const updatedRestaurant = {
      name: form.name,
      description: form.description,
      phoneNumber: form.phoneNumber,
      // Only include these fields if they're needed by your API
      address: form.address,
      // isActive: restaurant.value.isActive,
      // openTime: formatTimeForAPI(form.openTime),
      // closeTime: formatTimeForAPI(form.closeTime)
    };
    
    // Send update request to the API
    await restaurantService.updateRestaurantInfo(updatedRestaurant);
    
    // Update local state
    restaurant.value = { ...restaurant.value, ...updatedRestaurant };
    
    $toast.success('Restaurant information updated successfully!');
  } catch (error) {
    $toast.error(error.message || 'Failed to update restaurant information');
  } finally {
    updating.value = false;
  }
};

const toggleRestaurantStatus = async () => {
  try {
    const newStatus = !restaurant.value.isActive;
    await restaurantService.updateRestaurantInfo({ isActive: newStatus });
    restaurant.value.isActive = newStatus;
    
    $toast.success(`Restaurant is now ${newStatus ? 'active' : 'inactive'}`);
  } catch (error) {
    $toast.error(error.message || 'Failed to update restaurant status');
  }
};

onMounted(() => {
  loadRestaurantData();
});
</script>
