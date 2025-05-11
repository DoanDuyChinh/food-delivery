<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar :active-section="'shippers'" />
    
    <div class="lg:pl-64 flex flex-col flex-1">
      <main class="flex-1 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Shipper Management</h1>
            <button 
              @click="showAddModal = true"
              class="btn btn-primary flex items-center"
            >
              <PlusIcon class="h-5 w-5 mr-1" />
              Add Shipper
            </button>
          </div>
          
          <div v-if="loading" class="flex justify-center py-10">
            <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else-if="shippers?.length === 0 || shippers == null" class="bg-white shadow-md rounded-lg p-8 text-center">
            <TruckIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 class="text-xl font-medium text-gray-900 mb-2">No shippers found</h2>
            <p class="text-gray-600 mb-6">Start adding delivery personnel to your team</p>
            <button 
              @click="showAddModal = true"
              class="btn btn-primary flex items-center mx-auto"
            >
              <PlusIcon class="h-5 w-5 mr-1" />
              Add Shipper
            </button>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="shipper in shippers" :key="shipper.userId" class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {{ getInitials(shipper.name) }}
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-medium text-gray-900">{{ shipper.name }}</h3>
                    <p class="text-sm text-gray-500">{{ shipper.email }}</p>
                  </div>
                </div>
                <span 
                  :class="getStatusClass(shipper.status)" 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ formatStatus(shipper.status) }}
                </span>
              </div>
              <div class="p-6">
                <div class="space-y-3">
                  <div class="flex items-center">
                    <PhoneIcon class="h-5 w-5 text-gray-400 mr-2" />
                    <span class="text-gray-700">{{ shipper.phone }}</span>
                  </div>
                  <div class="flex items-center">
                    <TruckIcon class="h-5 w-5 text-gray-400 mr-2" />
                    <span class="text-gray-700">{{ shipper.vehicleType }} ({{ shipper.vehiclePlate }})</span>
                  </div>
                  <div class="flex items-center">
                    <TagIcon class="h-5 w-5 text-gray-400 mr-2" />
                    <span class="text-gray-700">Total Deliveries: {{ shipper.totalDeliveries }}</span>
                  </div>
                </div>
                
                <div class="mt-6 flex justify-end">
                  <button 
                    @click="toggleShipperStatus(shipper)"
                    class="btn btn-outline px-3 py-1"
                    :class="shipper.status === 'available' ? 'text-red-600 border-red-600 hover:bg-red-50' : 'text-green-600 border-green-600 hover:bg-green-50'"
                  >
                    {{ shipper.status === 'available' ? 'Set Unavailable' : 'Set Available' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Add Shipper Modal -->
          <div v-if="showAddModal" class="fixed inset-0 overflow-y-auto z-50">
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
                        Add New Shipper
                      </h3>
                      <div class="mt-4">
                        <form @submit.prevent="addShipper">
                          <div class="grid grid-cols-1 gap-y-6">
                            <div>
                              <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                              <input
                                id="name"
                                v-model="shipperForm.name"
                                type="text"
                                required
                                class="form-input mt-1"
                              />
                            </div>
                            
                            <div>
                              <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                              <input
                                id="email"
                                v-model="shipperForm.email"
                                type="email"
                                required
                                class="form-input mt-1"
                              />
                            </div>
                            
                            <div>
                              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                              <input
                                id="password"
                                v-model="shipperForm.password"
                                type="password"
                                required
                                class="form-input mt-1"
                              />
                            </div>
                            
                            <div>
                              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                              <input
                                id="phone"
                                v-model="shipperForm.phone"
                                type="tel"
                                required
                                class="form-input mt-1"
                              />
                            </div>
                            
                            <div>
                              <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                              <select
                                id="gender"
                                v-model="shipperForm.gender"
                                required
                                class="form-input mt-1"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            
                            <div>
                              <label for="vehicleType" class="block text-sm font-medium text-gray-700">Vehicle Type</label>
                              <select
                                id="vehicleType"
                                v-model="shipperForm.vehicleType"
                                required
                                class="form-input mt-1"
                              >
                                <option value="motorcycle">Motorcycle</option>
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                              </select>
                            </div>
                            
                            <div>
                              <label for="vehiclePlate" class="block text-sm font-medium text-gray-700">Vehicle Plate Number</label>
                              <input
                                id="vehiclePlate"
                                v-model="shipperForm.vehiclePlate"
                                type="text"
                                required
                                class="form-input mt-1"
                              />
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    @click="addShipper"
                    type="button"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                    :disabled="processing"
                  >
                    <span v-if="processing">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                    <span v-else>Add Shipper</span>
                  </button>
                  <button
                    @click="showAddModal = false"
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
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';
import { deliveryService } from '@/services/delivery.service';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import { 
  PlusIcon, 
  TruckIcon,
  PhoneIcon,
  TagIcon
} from '@heroicons/vue/24/outline';
import axios from 'axios';

const $toast = useToast();
const loading = ref(true);
const processing = ref(false);
const showAddModal = ref(false);
const shippers = ref([]);

const shipperForm = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  gender: 'male',
  vehicleType: 'motorcycle',
  vehiclePlate: ''
});

const getInitials = (name) => {
  if (!name) return 'SH';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatStatus = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getStatusClass = (status) => {
  return status === 'available' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

const loadShippers = async () => {
  loading.value = true;
  
  try {
    // const data = await deliveryService.getShippers();
    axios.get('http://localhost:8000/shippers',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
      .then(response => {
        const data = response.data;
        shippers.value = data;
      })
      .catch(error => {
        console.error('Error fetching shippers:', error);
        $toast.error('Failed to load shippers');
      });
    // shippers.value = data;
  } catch (error) {
    $toast.error(error.message || 'Failed to load shippers');
  } finally {
    loading.value = false;
  }
};

const addShipper = async () => {
  processing.value = true;
  
  try {
    // Add role to form data
    const newShipperData = {
      ...shipperForm,
      role: 'shipper'
    };
    
    // const newShipper = await deliveryService.createShipper(newShipperData);
    await axios.post('http://localhost:8000/shippers', newShipperData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        const newShipper = response.data;
        shippers.value.push(newShipper);
      })
      .catch(error => {
        console.error('Error adding shipper:', error);
        $toast.error('Failed to add shipper');
      });
    // shippers.value.push(newShipper);
    
    $toast.success('Shipper added successfully!');
    showAddModal.value = false;
    
    // Reset form
    shipperForm.name = '';
    shipperForm.email = '';
    shipperForm.password = '';
    shipperForm.phone = '';
    shipperForm.gender = 'male';
    shipperForm.vehicleType = 'motorcycle';
    shipperForm.vehiclePlate = '';
  } catch (error) {
    $toast.error(error.message || 'Failed to add shipper');
  } finally {
    processing.value = false;
  }
};

const toggleShipperStatus = async (shipper) => {
  try {
    // This is a simplified version since we don't have a specific API endpoint for this
    // In a real app, you would update the shipper's status through an API
    const newStatus = shipper.status === 'available' ? 'unavailable' : 'available';
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update shipper in the list
    const shipperIndex = shippers.value.findIndex(s => s.userId === shipper.userId);
    if (shipperIndex !== -1) {
      shippers.value[shipperIndex].status = newStatus;
    }
    
    $toast.success(`Shipper status updated to ${formatStatus(newStatus)}`);
  } catch (error) {
    $toast.error(error.message || 'Failed to update shipper status');
  }
};

onMounted(() => {
  loadShippers();
});
</script>
