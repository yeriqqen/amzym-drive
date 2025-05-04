'use client';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

interface Item {
    id: number;
    name: string;
    image: string;
    category: 'food' | 'goods';
}

const Items: NextPage = () => {
    const [cart, setCart] = useState<number[]>([]);

    const items: Item[] = [
        { id: 1, name: 'Pizza', image: '/images/pizza.jpg', category: 'food' },
        { id: 2, name: 'Burger', image: '/images/burger.jpg', category: 'food' },
        { id: 3, name: 'Sushi', image: '/images/sushi.jpg', category: 'food' },
        { id: 4, name: 'Salad', image: '/images/salad.jpg', category: 'food' },
        { id: 5, name: 'Bottled Water', image: '/images/water.jpg', category: 'goods' },
        { id: 6, name: 'Snacks', image: '/images/snacks.jpg', category: 'goods' },
        { id: 7, name: 'Toiletries', image: '/images/toiletries.jpg', category: 'goods' },
        { id: 8, name: 'Stationery', image: '/images/stationery.jpg', category: 'goods' },
    ];

    const addToCart = (itemId: number) => {
        setCart([...cart, itemId]);
    };

    return (
        <div className="min-h-screen bg-[#fff8f0]">
            <Head>
                <title>Food & Goods Delivery - Gallery</title>
                <meta name="description" content="Choose your favorite items" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff9900] to-[#ff3300]">
                            Choose Your Favorite Items
                        </h1>
                        <p className="text-xl text-[#2c3e50] mt-2">
                            Select your delicious food and daily goods easily!
                        </p>
                    </div>
                    <Link href="/map">
                        <button
                            className="px-5 py-3 bg-[#007bff] hover:bg-[#0056b3] text-white font-bold rounded-lg transform transition-transform hover:scale-105 flex items-center shadow-md"
                            disabled={cart.length === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Checkout ({cart.length})
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#fff8f0] border-[3px] border-[#ff6600] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="h-48 w-full bg-gray-300 relative">
                                {/* In production, use actual images */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                    {item.name} Image
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="text-xl font-bold text-[#2c3e50] mb-2">{item.name}</h4>
                                <button
                                    onClick={() => addToCart(item.id)}
                                    className="w-full px-4 py-2 bg-[#007bff] hover:bg-[#0056b3] text-white font-bold rounded-lg transform transition-transform hover:scale-105 shadow"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Items;