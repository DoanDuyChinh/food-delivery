# Food Delivery App

A full-featured food delivery platform with customer, admin, and shipper interfaces. This application allows customers to order food from restaurants, restaurant owners to manage their menu and orders, and delivery personnel to handle deliveries.

## Features

### Customer Features
- Browse restaurant menu
- Add items to cart
- Place and track orders
- View order history
- Track delivery in real-time
- Reorder previous orders

### Admin Features
- Manage restaurant information
- Update menu items (add, edit, delete)
- Process and manage orders
- View and update order status
- View customer information
- Monitor delivery personnel

### Shipper Features
- Accept delivery assignments
- View delivery details
- Get navigation assistance
- Update delivery status
- Track completed deliveries

## Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **UI Framework**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Maps Integration**: Leaflet
- **HTTP Client**: Axios
- **Authentication**: JWT

## Project Setup

### Prerequisites
- Node.js (version 16 or higher)
- NPM or Yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/food-delivery-app.git
cd food-delivery-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
