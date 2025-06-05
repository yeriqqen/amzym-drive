'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { PageLayout } from '@/components/ui/PageLayout';
import { useCart } from '@/context/cart-context';

interface Item {
    id: number;
    name: string;
    image: string;
    category: 'food' | 'goods';
    price: number;
    description: string;
    preparation?: string;
    rating: number;
}

const ItemsPage = () => {
    const { items: cartItems, addItem, total: cartTotal } = useCart();
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'goods'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch items from backend
    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3001/items');
                if (!response.ok) throw new Error('Failed to fetch items');
                const itemsData = await response.json();

                // Transform backend data to match frontend interface
                const transformedItems = itemsData.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    category: item.category as 'food' | 'goods',
                    price: item.price,
                    description: item.description,
                    preparation: item.category === 'food' ? '15-25 minutes' : undefined,
                    rating: 4.5 + (Math.random() * 0.4) // Random rating between 4.5-4.9
                }));

                setItems(transformedItems);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load items');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <span className="ml-4 text-lg">Loading items...</span>
                </div>
            </PageLayout>
        );
    }

    if (error) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Items</h2>
                        <p className="text-gray-600">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </PageLayout>
        );
    }

    // Helper function to format prices in KRW
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0
        }).format(price);
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <PageLayout>
            <header className="fixed top-16 left-0 right-0 bg-white/80 backdrop-blur-md z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">
                                Browse Items
                            </h1>
                            <div className="flex space-x-2">
                                {(['all', 'food', 'goods'] as const).map(category => (
                                    <Button
                                        key={category}
                                        variant={selectedCategory === category ? 'primary' : 'outline'}
                                        onClick={() => setSelectedCategory(category)}
                                        className="capitalize"
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <input
                                type="search"
                                placeholder="Search items..."
                                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff6600] focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Link href="/cart" className="relative">
                                <Button variant="outline" className="relative">
                                    <span className="mr-2">🛒</span>
                                    {formatPrice(cartTotal)}
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                            <Link href="/map">
                                <Button>Track Orders</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36">
                <AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item, index) => (
                            <AnimateIn key={item.id} delay={index * 0.1}>
                                <Card className="overflow-hidden group">
                                    <div className="relative h-48">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {item.category === 'food' && item.preparation && (
                                            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                                                ⏱️ {item.preparation}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg text-[#2c3e50]">
                                                {item.name}
                                            </h3>
                                            <span className="text-[#ff6600] font-bold">
                                                {formatPrice(item.price)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">
                                            {item.description}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center text-sm text-yellow-500">
                                                {'⭐'.repeat(Math.floor(item.rating))}
                                                <span className="ml-1 text-gray-600">
                                                    ({item.rating.toFixed(1)})
                                                </span>
                                            </div>
                                            <Button
                                                onClick={() => addItem({
                                                    id: item.id,
                                                    name: item.name,
                                                    image: item.image,
                                                    category: item.category,
                                                    price: item.price,
                                                    preparation: item.preparation
                                                })}
                                                className="group-hover:bg-[#ff6600] group-hover:text-white"
                                            >
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </AnimateIn>
                        ))}
                    </div>
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-semibold text-gray-600">
                            No items found
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </main>
        </PageLayout>
    );
};

export default ItemsPage;
