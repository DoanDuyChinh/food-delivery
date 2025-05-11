<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar :active-section="'menu'" />
    
    <div class="lg:pl-64 flex flex-col flex-1">
      <main class="flex-1 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-gray-900">Menu Management</h1>
            <button 
              @click="showAddModal = true" 
              class="btn btn-primary flex items-center"
            >
              <PlusIcon class="h-5 w-5 mr-1" />
              Add Menu Item
            </button>
          </div>
          
          <div v-if="loading" class="flex justify-center py-10">
            <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          
          <div v-else-if="menuItems.length === 0" class="bg-white shadow-md rounded-lg p-8 text-center">
            <ExclamationCircleIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 class="text-xl font-medium text-gray-900 mb-2">No menu items found</h2>
            <p class="text-gray-600 mb-6">Start adding items to your restaurant menu</p>
            <button 
              @click="showAddModal = true" 
              class="btn btn-primary flex items-center mx-auto"
            >
              <PlusIcon class="h-5 w-5 mr-1" />
              Add Menu Item
            </button>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="item in menuItems" :key="item.id" class="bg-white shadow-md rounded-lg overflow-hidden">
              <div class="h-48 bg-gray-200 relative">
                <img :src="item.imageUrl || 'https://via.placeholder.com/300x200'" :alt="item.name" class="w-full h-full object-cover" />
                <span 
                  :class="item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ item.isAvailable ? 'Available' : 'Unavailable' }}
                </span>
              </div>
              <div class="p-4">
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
                  <span class="text-primary font-semibold">{{ formatPrice(item.price) }}</span>
                </div>
                <p class="mt-2 text-gray-600 text-sm line-clamp-2">{{ item.description }}</p>
                <div class="mt-4 flex justify-between">
                  <button 
                    @click="editItem(item)" 
                    class="btn btn-outline px-3 py-1 flex items-center"
                  >
                    <PencilIcon class="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button 
                    @click="toggleAvailability(item)" 
                    class="btn btn-outline px-3 py-1 flex items-center"
                    :class="item.isAvailable ? 'text-red-600 border-red-600 hover:bg-red-50' : 'text-green-600 border-green-600 hover:bg-green-50'"
                  >
                    <span v-if="item.isAvailable">
                      <XMarkIcon class="h-4 w-4 mr-1" />
                      Mark Unavailable
                    </span>
                    <span v-else>
                      <CheckIcon class="h-4 w-4 mr-1" />
                      Mark Available
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Add/Edit Menu Item Modal -->
          <div v-if="showAddModal || showEditModal" class="fixed inset-0 overflow-y-auto z-50">
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
                        {{ showEditModal ? 'Edit Menu Item' : 'Add Menu Item' }}
                      </h3>
                      <div class="mt-4">
                        <form @submit.prevent="showEditModal ? updateMenuItem() : addMenuItem()">
                          <div class="grid grid-cols-1 gap-y-6">
                            <div>
                              <label for="name" class="block text-sm font-medium text-gray-700">Item Name</label>
                              <input
                                id="name"
                                v-model="itemForm.name"
                                type="text"
                                required
                                class="form-input mt-1"
                              />
                            </div>
                            
                            <div>
                              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                              <textarea
                                id="description"
                                v-model="itemForm.description"
                                rows="3"
                                required
                                class="form-input mt-1"
                              ></textarea>
                            </div>
                            
                            <div>
                              <label for="price" class="block text-sm font-medium text-gray-700">Price (VND)</label>
                              <input
                                id="price"
                                v-model.number="itemForm.price"
                                type="number"
                                min="0"
                                step="1000"
                                required
                                class="form-input mt-1"
                              />
                            </div>
                            
                            <div>
                              <label for="image" class="block text-sm font-medium text-gray-700">Image URL</label>
                              <input
                                id="image"
                                v-model="itemForm.imageUrl"
                                type="url"
                                class="form-input mt-1"
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                            
                            <div class="flex items-center">
                              <input
                                id="isAvailable"
                                v-model="itemForm.isAvailable"
                                type="checkbox"
                                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                              />
                              <label for="isAvailable" class="ml-2 block text-sm text-gray-900">
                                Item is available for ordering
                              </label>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    @click="showEditModal ? updateMenuItem() : addMenuItem()"
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
                    <span v-else>{{ showEditModal ? 'Update' : 'Add' }}</span>
                  </button>
                  <button
                    @click="closeModal"
                    type="button"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    v-if="showEditModal"
                    @click="confirmDelete"
                    type="button"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Delete Confirmation Modal -->
          <div v-if="showDeleteModal" class="fixed inset-0 overflow-y-auto z-50">
            <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 class="text-lg leading-6 font-medium text-gray-900">
                        Delete Menu Item
                      </h3>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">
                          Are you sure you want to delete this menu item? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    @click="deleteMenuItem"
                    type="button"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    :disabled="processing"
                  >
                    <span v-if="processing">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                    <span v-else>Delete</span>
                  </button>
                  <button
                    @click="showDeleteModal = false"
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
import { restaurantService } from '@/services/restaurant.service';
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import { 
  PlusIcon, 
  PencilIcon, 
  XMarkIcon, 
  CheckIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon  // Changed from ExclamationIcon to ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

const $toast = useToast();
const loading = ref(true);
const processing = ref(false);
const menuItems = ref([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const currentItemId = ref(null);

const itemForm = reactive({
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  isAvailable: true
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const loadMenu = async () => {
  loading.value = true;
  
  try {
    const data = await restaurantService.getMenu();
    menuItems.value = data;
  } catch (error) {
    $toast.error(error.message || 'Failed to load menu items');
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  itemForm.name = '';
  itemForm.description = '';
  itemForm.price = 0;
  itemForm.imageUrl = '';
  itemForm.isAvailable = true;
  currentItemId.value = null;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const editItem = (item) => {
  currentItemId.value = item.id;
  itemForm.name = item.name;
  itemForm.description = item.description;
  itemForm.price = item.price;
  itemForm.imageUrl = item.imageUrl || '';
  itemForm.isAvailable = item.isAvailable;
  showEditModal.value = true;
};

const addMenuItem = async () => {
  processing.value = true;
  
  try {
    await restaurantService.addMenuItem(itemForm);
    await loadMenu();
    
    $toast.success('Menu item added successfully!');
    closeModal();
  } catch (error) {
    $toast.error(error.message || 'Failed to add menu item');
  } finally {
    processing.value = false;
  }
};

const updateMenuItem = async () => {
  if (!currentItemId.value) return;
  
  processing.value = true;
  
  try {
    await restaurantService.updateMenuItem(currentItemId.value, itemForm);
    
    // Update item in the list
    const index = menuItems.value.findIndex(item => item.id === currentItemId.value);
    if (index !== -1) {
      menuItems.value[index] = { 
        ...menuItems.value[index],
        ...itemForm
      };
    }
    
    $toast.success('Menu item updated successfully!');
    closeModal();
  } catch (error) {
    $toast.error(error.message || 'Failed to update menu item');
  } finally {
    processing.value = false;
  }
};

const toggleAvailability = async (item) => {
  try {
    const updatedItem = { ...item, isAvailable: !item.isAvailable };
    await restaurantService.updateMenuItem(item.id, { isAvailable: !item.isAvailable });
    
    // Update item in the list
    const index = menuItems.value.findIndex(i => i.id === item.id);
    if (index !== -1) {
      menuItems.value[index].isAvailable = !item.isAvailable;
    }
    
    $toast.success(`Menu item marked as ${updatedItem.isAvailable ? 'available' : 'unavailable'}`);
  } catch (error) {
    $toast.error(error.message || 'Failed to update menu item availability');
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteMenuItem = async () => {
  if (!currentItemId.value) return;
  
  processing.value = true;
  
  try {
    await restaurantService.deleteMenuItem(currentItemId.value);
    
    // Remove item from the list
    menuItems.value = menuItems.value.filter(item => item.id !== currentItemId.value);
    
    $toast.success('Menu item deleted successfully!');
    showDeleteModal.value = false;
    closeModal();
  } catch (error) {
    $toast.error(error.message || 'Failed to delete menu item');
  } finally {
    processing.value = false;
  }
};

onMounted(() => {
  loadMenu();
});
</script>
