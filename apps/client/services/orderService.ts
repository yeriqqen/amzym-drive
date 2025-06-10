import { Order, DeliveryTracking } from '../types/order';

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
    // TODO: Replace with real API call when endpoint is available
    return null;
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
