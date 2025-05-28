import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export const Card = ({ children, className, hover = false }: CardProps) => {
    return (
        <div
            className={twMerge(
                'bg-white rounded-xl border-2 border-[#ff6600]/20 shadow-lg p-6',
                hover && 'transition-transform duration-300 hover:scale-[1.02] cursor-pointer',
                className
            )}
        >
            {children}
        </div>
    );
};
