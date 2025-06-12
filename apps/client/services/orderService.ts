import { Order, DeliveryTracking } from '../types/order';
import { gpsService } from './gpsService';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amzym-drive.onrender.com';

export const orderService = {
  // Get all orders for a user
  async getOrders(userId?: number): Promise<Order[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Error in getOrders:', error);
      return [];
    }
  },

  // Get a specific order by ID
  async getOrder(orderId: number): Promise<Order | null> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) throw new Error('Failed to fetch order');
      return await response.json();
    } catch (error) {
      console.error('Error in getOrder:', error);
      return null;
    }
  },

  // Get delivery tracking information for an order
  async getDeliveryTracking(orderId: number): Promise<DeliveryTracking | null> {
    try {
      // Get GPS data from AWS API for this order
      const gpsData = await gpsService.getLatestCoordinates(orderId.toString());
      
      if (!gpsData) {
        return null;
      }

      // Create a mock delivery tracking object with real GPS data
      const tracking: DeliveryTracking = {
        orderId,
        status: 'OUT_FOR_DELIVERY',
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        currentLocation: {
          lat: gpsData.latitude,
          lng: gpsData.longitude,
        },
        destination: {
          lat: 35.2290, // Default destination
          lng: 126.8435,
        },
        managerInfo: {
          name: 'Kim Min-jun',
          phone: '+82-10-1234-5678',
          department: 'Delivery Operations',
          role: 'Delivery Manager',
        },
        updates: [
          {
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            status: 'Order confirmed and preparing',
            location: 'Restaurant Kitchen',
          },
          {
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            status: 'Out for delivery',
            location: 'En route to destination',
          },
        ],
      };

      return tracking;
    } catch (error) {
      console.error('Error getting delivery tracking:', error);
      return null;
    }
  },

  // Create a new order
  async createOrder(orderData: any, token?: string) {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  },

  // Update order status (not implemented)
  async updateOrderStatus(orderId: number, status: string): Promise<Order | null> {
    // TODO: Implement with real API if needed
    return null;
  },

  // Cancel an order (not implemented)
  async cancelOrder(orderId: number): Promise<boolean> {
    // TODO: Implement with real API if needed
    return false;
  },

  // Delete an order
  async deleteOrder(orderId: number, token?: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) throw new Error('Failed to delete order');
    return await response.json();
  },

  // Get order status options (static)
  getOrderStatuses(): string[] {
    return [
      'pending',
      'confirmed',
      'preparing',
      'ready_for_pickup',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];
  },

  // Search orders by status (not implemented)
  async getOrdersByStatus(status: string, userId?: number): Promise<Order[]> {
    // TODO: Implement with real API if needed
    return [];
  },
};

export default orderService;
