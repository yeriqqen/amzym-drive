'use client';

import { motion } from 'framer-motion';

interface LoadingDotsProps {
    className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
    return (
        <div className="flex space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
            <div
                className="w-2 h-2 bg-current rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
            />
            <div
                className="w-2 h-2 bg-current rounded-full animate-bounce"
                style={{ animationDelay: '0.4s' }}
            />
        </div>
    );
}
