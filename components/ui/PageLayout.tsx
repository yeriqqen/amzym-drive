'use client';

import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageLayoutProps {
    children: ReactNode;
    className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
    return (
        <div className={twMerge("min-h-screen bg-[#fff8f0] pt-24 pb-20", className)}>
            {children}
        </div>
    );
}
