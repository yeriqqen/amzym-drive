import React from 'react';
import { Order } from '../../types/order';

interface OrderSelectorProps {
    orders: Order[];
    onOrderSelect: (order: Order) => void;
    className?: string;
}

export const OrderSelector: React.FC<OrderSelectorProps> = ({
    orders,
    onOrderSelect,
    className = ''
}) => {
    if (!orders || orders.length === 0) {
        return (
            <div className={`bg-white rounded-lg shadow-md p-8 text-center ${className}`}>
                <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Orders Found</h3>
                    <p className="text-gray-600">You don't have any orders to track at the moment.</p>
                </div>
            </div>
        );
    }

    const formatDate = (date: Date) => {
        if (!date) return 'N/A';

        // Handle both Date objects and string dates
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) return 'Invalid Date';

        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            case 'confirmed':
                return 'text-blue-600 bg-blue-100 border-blue-200';
            case 'preparing':
                return 'text-orange-600 bg-orange-100 border-orange-200';
            case 'ready_for_pickup':
                return 'text-purple-600 bg-purple-100 border-purple-200';
            case 'out_for_delivery':
                return 'text-indigo-600 bg-indigo-100 border-indigo-200';
            case 'delivered':
                return 'text-green-600 bg-green-100 border-green-200';
            case 'cancelled':
                return 'text-red-600 bg-red-100 border-red-200';
            default:
                return 'text-gray-600 bg-gray-100 border-gray-200';
        }
    };

    const getItemsPreview = (order: Order) => {
        if (!order.items || order.items.length === 0) {
            return 'No items';
        }

        const firstItem = order.items[0];
        const remainingCount = order.items.length - 1;

        let preview = firstItem.name || 'Unknown Item';
        if (remainingCount > 0) {
            preview += ` +${remainingCount} more`;
        }

        return preview;
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h3 className="text-xl font-bold text-gray-700 mb-6">Select Order to Track</h3>

            <div className="space-y-4">
                {orders.map((order) => (
                    <button
                        key={order.id}
                        onClick={() => onOrderSelect(order)}
                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-secondary hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-semibold text-gray-700">
                                Order #{order.id}
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status || 'pending')}`}>
                                {(order.status || 'pending').replace('_', ' ').toUpperCase()}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <p className="text-gray-600">
                                {getItemsPreview(order)}
                            </p>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">
                                    {formatDate(order.createdAt)}
                                </span>
                                <span className="font-semibold text-secondary">
                                    ${(order.totalAmount || 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
