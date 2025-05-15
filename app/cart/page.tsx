'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart, formatPrice } from '@/context/cart-context';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageLayout } from '@/components/ui/PageLayout';

const CartPage = () => {
    const { items, removeItem, updateQuantity, subtotal } = useCart();

    if (items.length === 0) {
        return (
            <PageLayout className="flex items-center justify-center">
                <Card className="text-center p-8 max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-[#2c3e50] mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-6">Browse our items and add something delicious!</p>
                    <Link href="/items">
                        <Button>Browse Items</Button>
                    </Link>
                </Card>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-24 h-24 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-lg text-[#2c3e50]">{item.name}</h3>
                                        <p className="text-[#ff6600] font-bold">{formatPrice(item.price)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, -1)}
                                        >
                                            -
                                        </Button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 border-red-500 hover:bg-red-50"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-[#2c3e50] mb-4">Order Summary</h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-semibold">{formatPrice(3000)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-[#2c3e50]">Total</span>
                                        <span className="font-bold text-[#ff6600]">
                                            {formatPrice(subtotal + 3000)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full">
                                Proceed to Checkout
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CartPage;