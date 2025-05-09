<template>
  <div class="min-h-screen bg-gray-50">
    <ShipperSidebar :active-section="'profile'" />
    
    <div class="lg:pl-64 flex flex-col flex-1">
      <main class="flex-1 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
          
          <div v-if="loading" class="flex justify-center py-10">
            <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <!-- Profile Summary Card -->
            <div class="lg:col-span-1">
              <div class="bg-white shadow-md rounded-lg overflow-hidden">
                <div class="p-6">
                  <div class="flex flex-col items-center">
                    <div class="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                      {{ userInitials }}
                    </div>
                    <h2 class="mt-4 text-xl font-bold text-gray-900">{{ shipperData.name }}</h2>
                    <p class="text-gray-600">{{ shipperData.email }}</p>
                    <div class="mt-2">
                      <span :class="getStatusClass(shipperData.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                        {{ formatStatus(shipperData.status) }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="mt-6 border-t border-gray-200 pt-6">
                    <div class="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p class="text-2xl font-bold text-gray-900">{{ shipperData.totalDeliveries }}</p>
                        <p class="text-sm text-gray-600">Total Deliveries</p>
                      </div>
                      <div>
                        <p class="text-2xl font-bold text-gray-900">
                          {{ formatRating(shipperData.rating) }}
                        </p>
                        <p class="text-sm text-gray-600">Rating</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-6 border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-3">Vehicle Information</h3>
                    <div class="space-y-3">
                      <div class="flex items-center">
                        <TruckIcon class="h-5 w-5 text-gray-400 mr-2" />
                        <span class="text-gray-700">{{ capitalizeFirstLetter(shipperData.vehicleType) }}</span>
                      </div>
                      <div class="flex items-center">
                        <TagIcon class="h-5 w-5 text-gray-400 mr-2" />
                        <span class="text-gray-700">{{ shipperData.vehiclePlate }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Edit Profile Form -->
            <div class="lg:col-span-2">
              <div class="bg-white shadow-md rounded-lg overflow-hidden">
                <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 class="text-lg font-medium text-gray-900">Edit Profile</h2>
                </div>
                <div class="p-6">
                  <form @submit.prevent="updateProfile">
                    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div class="sm:col-span-3">
                        <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                        <div class="mt-1">
                          <input
                            id="name"
                            v-model="profileForm.name"
                            type="text"
                            required
                            class="form-input"
                          />
                        </div>
                      </div>
                      
                      <div class="sm:col-span-3">
                        <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                        <div class="mt-1">
                          <input
                            id="email"
                            v-model="profileForm.email"
                            type="email"
                            required
                            class="form-input"
                          />
                        </div>
                      </div>
                      
                      <div class="sm:col-span-3">
                        <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                        <div class="mt-1">
                          <input
                            id="phone"
                            v-model="profileForm.phone"
                            type="tel"
                            required
                            class="form-input"
                          />
                        </div>
                      </div>
                      
                      <div class="sm:col-span-3">
                        <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                        <div class="mt-1">
                          <select
                            id="gender"
                            v-model="profileForm.gender"
                            required
                            class="form-input"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <div class="sm:col-span-3">
                        <label for="vehicleType" class="block text-sm font-medium text-gray-700">Vehicle Type</label>
                        <div class="mt-1">
                          <select
                            id="vehicleType"
                            v-model="profileForm.vehicleType"
                            required
                            class="form-input"
                          >
                            <option value="motorcycle">Motorcycle</option>
                            <option value="car">Car</option>
                            <option value="bike">Bike</option>
                          </select>
                        </div>
                      </div>
                      
                      <div class="sm:col-span-3">
                        <label for="vehiclePlate" class="block text-sm font-medium text-gray-700">Vehicle Plate</label>
                        <div class="mt-1">
                          <input
                            id="vehiclePlate"
                            v-model="profileForm.vehiclePlate"
                            type="text"
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
                        <span v-else>Update Profile</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              <!-- Change Password Form -->
              <div class="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
                <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h2 class="text-lg font-medium text-gray-900">Change Password</h2>
                </div>
                <div class="p-6">
                  <form @submit.prevent="changePassword">
                    <div class="space-y-6">
                      <div>
                        <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
                        <div class="mt-1">
                          <input
                            id="currentPassword"
                            v-model="passwordForm.currentPassword"
                            type="password"
                            required
                            class="form-input"
                            :class="{ 'border-red-500': passwordErrors.currentPassword }"
                          />
                          <p v-if="passwordErrors.currentPassword" class="mt-1 text-sm text-red-600">{{ passwordErrors.currentPassword }}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                        <div class="mt-1">
                          <input
                            id="newPassword"
                            v-model="passwordForm.newPassword"
                            type="password"
                            required
                            class="form-input"
                            :class="{ 'border-red-500': passwordErrors.newPassword }"
                          />
                          <p v-if="passwordErrors.newPassword" class="mt-1 text-sm text-red-600">{{ passwordErrors.newPassword }}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <div class="mt-1">
                          <input
                            id="confirmPassword"
                            v-model="passwordForm.confirmPassword"
                            type="password"
                            required
                            class="form-input"
                            :class="{ 'border-red-500': passwordErrors.confirmPassword }"
                          />
                          <p v-if="passwordErrors.confirmPassword" class="mt-1 text-sm text-red-600">{{ passwordErrors.confirmPassword }}</p>
                        </div>
                      </div>
                      
                      <div class="flex justify-end">
                        <button
                          type="submit"
                          class="btn btn-primary"
                          :disabled="changingPassword"
                        >
                          <span v-if="changingPassword">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </span>
                          <span v-else>Change Password</span>
                        </button>
                      </div>
                    </div>
                  </form>
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useAuthStore } from '@/stores/auth';
import { userService } from '@/services/user.service';
import ShipperSidebar from '@/components/shipper/ShipperSidebar.vue';
import { 
  TruckIcon,
  TagIcon
} from '@heroicons/vue/24/outline';

const $toast = useToast();
const authStore = useAuthStore();
const loading = ref(true);
const updating = ref(false);
const changingPassword = ref(false);
const shipperData = ref({
  name: '',
  email: '',
  phone: '',
  gender: 'male',
  vehicleType: 'motorcycle',
  vehiclePlate: '',
  totalDeliveries: 0,
  status: 'available',
  rating: 4.7
});

const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  gender: 'male',
  vehicleType: 'motorcycle',
  vehiclePlate: ''
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const userInitials = computed(() => {
  if (!shipperData.value || !shipperData.value.name) return 'SH';
  return shipperData.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const formatStatus = (status) => {
  const statusMap = {
    'available': 'Available',
    'unavailable': 'Unavailable',
    'busy': 'Busy'
  };
  
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const statusClassMap = {
    'available': 'bg-green-100 text-green-800',
    'unavailable': 'bg-red-100 text-red-800',
    'busy': 'bg-orange-100 text-orange-800'
  };
  
  return statusClassMap[status] || 'bg-gray-100 text-gray-800';
};

const formatRating = (rating) => {
  return rating ? rating.toFixed(1) : 'N/A';
};

const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const loadShipperData = async () => {
  loading.value = true;
  
  try {
    // In a real app, this would fetch data from the API
    // For this demo, use the auth store or mock data
    if (authStore.user) {
      // Create sample data
      shipperData.value = {
        userId: authStore.user.userId || '3',
        name: authStore.user.name || 'Shipper User',
        email: authStore.user.email || 'shipper@example.com',
        phone: authStore.user.phone || '5555555555',
        gender: authStore.user.gender || 'male',
        vehicleType: authStore.user.vehicleType || 'car',
        vehiclePlate: authStore.user.vehiclePlate || '30K-999.99',
        totalDeliveries: authStore.user.totalDeliveries || 42,
        status: authStore.user.status || 'available',
        rating: 4.7
      };
      
      // Populate form
      profileForm.name = shipperData.value.name;
      profileForm.email = shipperData.value.email;
      profileForm.phone = shipperData.value.phone;
      profileForm.gender = shipperData.value.gender;
      profileForm.vehicleType = shipperData.value.vehicleType;
      profileForm.vehiclePlate = shipperData.value.vehiclePlate;
    }
  } catch (error) {
    $toast.error(error.message || 'Failed to load shipper data');
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  updating.value = true;
  
  try {
    // In a real app, this would call the API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update local data
    shipperData.value = {
      ...shipperData.value,
      ...profileForm
    };
    
    // Update auth store
    authStore.setUser({
      ...authStore.user,
      ...profileForm
    });
    
    $toast.success('Profile updated successfully');
  } catch (error) {
    $toast.error(error.message || 'Failed to update profile');
  } finally {
    updating.value = false;
  }
};

const validatePasswordForm = () => {
  let isValid = true;
  passwordErrors.currentPassword = '';
  passwordErrors.newPassword = '';
  passwordErrors.confirmPassword = '';
  
  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = 'Current password is required';
    isValid = false;
  }
  
  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = 'New password is required';
    isValid = false;
  } else if (passwordForm.newPassword.length < 8) {
    passwordErrors.newPassword = 'Password must be at least 8 characters';
    isValid = false;
  }
  
  if (!passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Please confirm your new password';
    isValid = false;
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }
  
  return isValid;
};

const changePassword = async () => {
  if (!validatePasswordForm()) {
    return;
  }
  
  changingPassword.value = true;
  
  try {
    await userService.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
    
    $toast.success('Password changed successfully');
    
    // Reset form
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (error) {
    $toast.error(error.message || 'Failed to change password');
    if (error.message?.includes('incorrect')) {
      passwordErrors.currentPassword = 'Current password is incorrect';
    }
  } finally {
    changingPassword.value = false;
  }
};

onMounted(() => {
  loadShipperData();
});
</script>
