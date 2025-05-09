import api from './api';
import { mockService } from './mock.service';

// Use mockService for development, real API for production
const service = import.meta.env.PROD ? api : mockService;

export const restaurantService = {
  async getRestaurantInfo() {
    return service.get('/restaurant');
  },
  
  async updateRestaurantInfo(restaurantData) {
    return service.patch('/restaurant', restaurantData);
  },
  
  async getMenu() {
    return service.get('/restaurant/menu');
  },
  
  async addMenuItem(menuItemData) {
    return service.post('/restaurant/menu/item', menuItemData);
  },
  
  async updateMenuItem(itemId, menuItemData) {
    return service.patch(`/restaurant/menu/item/${itemId}`, menuItemData);
  },
  
  async deleteMenuItem(itemId) {
    return service.delete(`/restaurant/menu/item/${itemId}`);
  }
};
