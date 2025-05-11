import api from './api';

export const restaurantService = {
  // Public endpoints (no auth required)
  
  // Get restaurant information - public endpoint
  async getRestaurantInfo() {
    return api.get('/restaurant');
  },
  
  // Get restaurant menu - public endpoint
  async getMenu() {
    return api.get('/restaurant/menu');
  },
  
  // Protected endpoints (auth required)
  
  // Update restaurant information (admin only)
  async updateRestaurantInfo(restaurantData) {
    // Ensure we're using PATCH method to the correct endpoint
    return api.patch('/restaurant', restaurantData);
  },
  
  // Add new menu item (admin only)
  async addMenuItem(menuItemData) {
    return api.post('/restaurant/menu/item', menuItemData);
  },
  
  // Update menu item (admin only)
  async updateMenuItem(itemId, menuItemData) {
    return api.patch(`/restaurant/menu/item/${itemId}`, menuItemData);
  },
  
  // Delete menu item (admin only)
  async deleteMenuItem(itemId) {
    return api.delete(`/restaurant/menu/item/${itemId}`);
  }
};
