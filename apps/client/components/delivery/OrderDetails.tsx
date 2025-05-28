import React from 'react';
import { Order, OrderItem } from '../../types/order';

interface OrderDetailsProps {
    order: Order;
    className?: string;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, className = '' }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(price);
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-[#2c3e50]">Order Details</h3>
                <div className="text-right">
                    <div className="text-sm text-gray-500">Order #{order.id}</div>
                    <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
                {order.items.map((item: OrderItem) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        {item.image && (
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                        )}
                        <div className="flex-1">
                            <h4 className="font-semibold text-[#2c3e50]">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            {item.quantity && item.quantity > 1 && (
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-[#2c3e50]">
                                {formatPrice(item.price * (item.quantity || 1))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-[#2c3e50]">Total</span>
                    <span className="text-xl font-bold text-[#ff6600]">
                        {formatPrice(order.totalAmount)}
                    </span>
                </div>
            </div>

            {/* Delivery Info */}
            {order.deliveryLocation && (
                <div className="mt-6 pt-4 border-t">
                    <h4 className="font-semibold text-[#2c3e50] mb-2">Delivery Address</h4>
                    <p className="text-gray-600">{order.deliveryLocation.address}</p>
                    {order.deliveryLocation.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                            Note: {order.deliveryLocation.notes}
                        </p>
                    )}
                </div>
            )}

            {/* Estimated Delivery Time */}
            {order.estimatedDeliveryTime && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">⏰</span>
                        <div>
                            <div className="font-semibold text-[#007bff]">Estimated Delivery</div>
                            <div className="text-sm text-gray-600">
                                {new Date(order.estimatedDeliveryTime).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
