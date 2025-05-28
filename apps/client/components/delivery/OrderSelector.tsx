import React from 'react';
import { Order, OrderItem } from '../../types/order';

interface OrderSelectorProps {
    orders: Order[];
    selectedOrderId: number | null;
    onOrderSelect: (orderId: number) => void;
    className?: string;
}

export const OrderSelector: React.FC<OrderSelectorProps> = ({
    orders,
    selectedOrderId,
    onOrderSelect,
    className = ''
}) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'PREPARING':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'OUT_FOR_DELIVERY':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'OUT_FOR_DELIVERY':
                return 'Out for Delivery';
            case 'PENDING':
                return 'Pending';
            case 'CONFIRMED':
                return 'Confirmed';
            case 'PREPARING':
                return 'Preparing';
            case 'DELIVERED':
                return 'Delivered';
            case 'CANCELLED':
                return 'Cancelled';
            default:
                return status;
        }
    };

    if (orders.length === 0) {
        return (
            <div className={`bg-white rounded-lg shadow-md p-6 text-center ${className}`}>
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">No Active Orders</h3>
                <p className="text-gray-600 mb-4">You don't have any orders to track right now.</p>
                <a
                    href="/items"
                    className="inline-block bg-[#007bff] hover:bg-[#0056b3] text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                    Start Shopping
                </a>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
            <div className="p-4 bg-[#f8f9fa] border-b">
                <h3 className="text-xl font-bold text-[#2c3e50]">Select Order to Track</h3>
                <p className="text-gray-600 text-sm mt-1">Choose an order to view delivery details</p>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        onClick={() => onOrderSelect(order.id)}
                        className={`
              p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50
              ${selectedOrderId === order.id ? 'bg-blue-50 border-l-4 border-l-[#007bff]' : ''}
            `}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="text-lg font-semibold text-[#2c3e50]">
                                    Order #{order.id}
                                </div>
                                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium border
                  ${getStatusColor(order.status)}
                `}>
                                    {getStatusDisplay(order.status)}
                                </span>
                            </div>
                            <div className="text-lg font-bold text-[#ff6600]">
                                {formatPrice(order.totalAmount)}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Ordered:</span>
                                <div className="font-medium">
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </div>
                            </div>

                            {order.estimatedDeliveryTime && (
                                <div>
                                    <span className="text-gray-500">Est. Delivery:</span>
                                    <div className="font-medium text-[#007bff]">
                                        {new Date(order.estimatedDeliveryTime).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-3">
                            <div className="text-gray-500 text-sm mb-1">Items:</div>
                            <div className="text-sm">
                                {order.items.slice(0, 2).map((item: OrderItem, index: number) => (
                                    <span key={item.id}>
                                        {item.name}
                                        {item.quantity && item.quantity > 1 && ` (${item.quantity})`}
                                        {index < Math.min(order.items.length, 2) - 1 && ', '}
                                    </span>
                                ))}
                                {order.items.length > 2 && (
                                    <span className="text-gray-500">
                                        {' '}and {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        </div>

                        {order.deliveryLocation?.address && (
                            <div className="mt-3">
                                <div className="text-gray-500 text-sm mb-1">Delivery to:</div>
                                <div className="text-sm text-gray-700">
                                    📍 {order.deliveryLocation.address}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
