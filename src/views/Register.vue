<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-12 w-auto" src="@/assets/images/logo.svg" alt="Coastal Delivery" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <router-link to="/login" class="font-medium text-primary hover:text-primary-dark">
          sign in to your existing account
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <div class="mt-1">
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.phone }"
              />
              <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
            </div>
          </div>

          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
            <div class="mt-1">
              <select
                id="gender"
                v-model="form.gender"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.gender }"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
              </select>
              <p v-if="errors.gender" class="mt-1 text-sm text-red-600">{{ errors.gender }}</p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.password }"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.confirmPassword }"
              />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.termsAccepted"
              type="checkbox"
              required
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              :class="{ 'border-red-500': errors.termsAccepted }"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              I agree to the
              <a href="#" class="text-primary hover:text-primary-dark">Terms of Service</a>
              and
              <a href="#" class="text-primary hover:text-primary-dark">Privacy Policy</a>
            </label>
          </div>
          <p v-if="errors.termsAccepted" class="mt-1 text-sm text-red-600">{{ errors.termsAccepted }}</p>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              :disabled="loading"
            >
              <span v-if="loading">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing up...
              </span>
              <span v-else>Sign up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const $toast = useToast();

const loading = ref(false);
const form = reactive({
  name: '',
  email: '',
  phone: '',
  gender: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
  role: 'customer'  // Default role
});

const errors = reactive({});

const validate = () => {
  errors.name = '';
  errors.email = '';
  errors.phone = '';
  errors.gender = '';
  errors.password = '';
  errors.confirmPassword = '';
  errors.termsAccepted = '';
  
  let isValid = true;
  
  if (!form.name) {
    errors.name = 'Name is required';
    isValid = false;
  }
  
  if (!form.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  if (!form.phone) {
    errors.phone = 'Phone number is required';
    isValid = false;
  } else if (!/^\d{10,15}$/.test(form.phone.replace(/\D/g, ''))) {
    errors.phone = 'Please enter a valid phone number';
    isValid = false;
  }
  
  if (!form.gender) {
    errors.gender = 'Please select your gender';
    isValid = false;
  }
  
  if (!form.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
    isValid = false;
  }
  
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }
  
  if (!form.termsAccepted) {
    errors.termsAccepted = 'You must accept the terms and conditions';
    isValid = false;
  }
  
  return isValid;
};

const handleSubmit = async () => {
  if (!validate()) {
    return;
  }
  
  loading.value = true;
  
  try {
    // Remove confirmPassword and termsAccepted from data to be sent
    const { confirmPassword, termsAccepted, ...userData } = form;
    
    // Make sure the data format matches what your API expects
    await authStore.register(userData);
    
    $toast.success('Registration successful! Please log in.');
    router.push('/login');
  } catch (error) {
    $toast.error(error.message || 'Registration failed. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>
