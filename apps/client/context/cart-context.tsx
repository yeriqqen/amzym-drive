'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';

// Helper function to format prices in KRW
export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
        maximumFractionDigits: 0
    }).format(price);
};

interface CartItem {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    category: 'food' | 'goods';
    preparation?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (itemId: number) => void;
    updateQuantity: (itemId: number, delta: number) => void;
    clearCart: () => void;
    subtotal: number;
    total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hasHydrated, setHasHydrated] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('cart');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setItems(parsed.items || []);
            } catch (e) {
                localStorage.removeItem('cart');
            }
        }
        setHasHydrated(true);
    }, []);

    // Save cart to localStorage whenever items change
    useEffect(() => {
        if (hasHydrated) {
            localStorage.setItem('cart', JSON.stringify({ items }));
        }
    }, [items, hasHydrated]);

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existingItem = prev.find(i => i.id === item.id);
            if (existingItem) {
                return prev.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (itemId: number) => {
        setItems(prev => prev.filter(i => i.id !== itemId));
    };

    const updateQuantity = (itemId: number, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(Boolean) as CartItem[]);
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('cart');
    };

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = items.length > 0 ? 3000 : 0; // 3,000 KRW delivery fee
    const tax = Math.floor(subtotal * 0.1); // 10% tax, rounded down to nearest KRW
    const total = subtotal + deliveryFee + tax;

    const value: CartContextType = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        total,
    };

    return (
        <CartContext.Provider value={value}>
            {hasHydrated ? children : null}
        </CartContext.Provider>
    );
};

const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export { useCart };
