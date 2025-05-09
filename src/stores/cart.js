import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    
    subtotal: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    
    cartItems: (state) => state.items.map(item => ({
      menuItemId: item.id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
      totalPrice: item.price * item.quantity
    })),
    
    isEmpty: (state) => state.items.length === 0,
  },
  
  actions: {
    addItem(item) {
      const existingItem = this.items.find(i => i.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ ...item, quantity: 1 });
      }
      
      this.saveToLocalStorage();
    },
    
    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId);
      this.saveToLocalStorage();
    },
    
    updateQuantity(itemId, quantity) {
      const item = this.items.find(i => i.id === itemId);
      if (item) {
        item.quantity = quantity;
        
        if (item.quantity <= 0) {
          this.removeItem(itemId);
        }
      }
      this.saveToLocalStorage();
    },
    
    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },
    
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    loadFromLocalStorage() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    }
  }
});
