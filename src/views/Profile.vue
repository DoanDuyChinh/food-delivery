<template>
  <div class="py-10 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
      
      <div v-if="loading" class="flex justify-center py-10">
        <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Sidebar Navigation -->
        <div class="md:col-span-1">
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div class="flex items-center">
                <div class="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                  {{ userInitials }}
                </div>
                <div class="ml-3">
                  <h2 class="text-lg font-medium text-gray-900">{{ user.name }}</h2>
                  <p class="text-sm text-gray-500">{{ user.role }}</p>
                </div>
              </div>
            </div>
            <nav class="py-2">
              <button
                @click="activeTab = 'profile'"
                :class="[
                  'w-full text-left px-6 py-3',
                  activeTab === 'profile' 
                    ? 'bg-primary-light bg-opacity-10 text-primary border-l-4 border-primary' 
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                <span class="flex items-center">
                  <UserIcon class="h-5 w-5 mr-2" />
                  Profile Information
                </span>
              </button>
              <button
                @click="activeTab = 'password'"
                :class="[
                  'w-full text-left px-6 py-3',
                  activeTab === 'password' 
                    ? 'bg-primary-light bg-opacity-10 text-primary border-l-4 border-primary' 
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
              >
                <span class="flex items-center">
                  <LockClosedIcon class="h-5 w-5 mr-2" />
                  Change Password
                </span>
              </button>
              <router-link 
                to="/orders"
                class="block w-full text-left px-6 py-3 text-gray-600 hover:bg-gray-50"
              >
                <span class="flex items-center">
                  <ShoppingBagIcon class="h-5 w-5 mr-2" />
                  Order History
                </span>
              </router-link>
            </nav>
          </div>
        </div>
        
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="md:col-span-3">
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Profile Information</h2>
            </div>
            <div class="p-6">
              <form @submit.prevent="updateProfile">
                <div class="space-y-6">
                  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        id="name"
                        v-model="profileForm.name"
                        type="text"
                        required
                        class="form-input mt-1"
                      />
                    </div>
                    
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        id="email"
                        v-model="profileForm.email"
                        type="email"
                        required
                        class="form-input mt-1"
                      />
                    </div>
                    
                    <div>
                      <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        id="phone"
                        v-model="profileForm.phone"
                        type="tel"
                        required
                        class="form-input mt-1"
                      />
                    </div>
                    
                    <div>
                      <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        id="gender"
                        v-model="profileForm.gender"
                        required
                        class="form-input mt-1"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="flex justify-end">
                    <button
                      type="submit"
                      class="btn btn-primary"
                      :disabled="updatingProfile"
                    >
                      <span v-if="updatingProfile">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                      <span v-else>Update Profile</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Password Tab -->
        <div v-if="activeTab === 'password'" class="md:col-span-3">
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Change Password</h2>
            </div>
            <div class="p-6">
              <form @submit.prevent="updatePassword">
                <div class="space-y-6">
                  <div>
                    <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      id="currentPassword"
                      v-model="passwordForm.currentPassword"
                      type="password"
                      required
                      class="form-input mt-1"
                      :class="{ 'border-red-500': passwordErrors.currentPassword }"
                    />
                    <p v-if="passwordErrors.currentPassword" class="mt-1 text-sm text-red-600">{{ passwordErrors.currentPassword }}</p>
                  </div>
                  
                  <div>
                    <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      id="newPassword"
                      v-model="passwordForm.newPassword"
                      type="password"
                      required
                      class="form-input mt-1"
                      :class="{ 'border-red-500': passwordErrors.newPassword }"
                    />
                    <p v-if="passwordErrors.newPassword" class="mt-1 text-sm text-red-600">{{ passwordErrors.newPassword }}</p>
                  </div>
                  
                  <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      id="confirmPassword"
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      required
                      class="form-input mt-1"
                      :class="{ 'border-red-500': passwordErrors.confirmPassword }"
                    />
                    <p v-if="passwordErrors.confirmPassword" class="mt-1 text-sm text-red-600">{{ passwordErrors.confirmPassword }}</p>
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
                      <span v-else>Update Password</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import { useAuthStore } from '@/stores/auth';
import { userService } from '@/services/user.service';
import { 
  UserIcon, 
  LockClosedIcon, 
  ShoppingBagIcon 
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const $toast = useToast();

const loading = ref(true);
const activeTab = ref('profile');
const updatingProfile = ref(false);
const changingPassword = ref(false);

const user = computed(() => authStore.user || {});

const userInitials = computed(() => {
  if (!user.value || !user.value.name) return 'U';
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const profileForm = reactive({
  name: '',
  email: '',
  phone: '',
  gender: ''
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

const updateProfile = async () => {
  updatingProfile.value = true;
  
  try {
    const response = await userService.updateProfile(profileForm);
    authStore.setUser({ ...authStore.user, ...response });
    $toast.success('Profile updated successfully!');
  } catch (error) {
    $toast.error(error.message || 'Failed to update profile');
  } finally {
    updatingProfile.value = false;
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

const updatePassword = async () => {
  if (!validatePasswordForm()) {
    return;
  }
  
  changingPassword.value = true;
  
  try {
    await userService.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
    
    $toast.success('Password updated successfully!');
    
    // Reset form
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (error) {
    $toast.error(error.message || 'Failed to update password');
    if (error.message?.includes('incorrect')) {
      passwordErrors.currentPassword = 'Current password is incorrect';
    }
  } finally {
    changingPassword.value = false;
  }
};

const loadUserData = () => {
  if (user.value) {
    profileForm.name = user.value.name || '';
    profileForm.email = user.value.email || '';
    profileForm.phone = user.value.phone || '';
    profileForm.gender = user.value.gender || '';
    loading.value = false;
  }
};

onMounted(async () => {
  if (!authStore.user) {
    try {
      await authStore.fetchUserProfile();
    } catch (error) {
      $toast.error('Failed to load user profile');
    }
  }
  
  loadUserData();
});
</script>
