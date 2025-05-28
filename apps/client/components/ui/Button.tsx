'use client';

import { forwardRef, type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { LoadingDots } from './LoadingDots';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: 'default' | 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children?: ReactNode;
}

const buttonVariants = {
    default: 'bg-gradient-to-r from-[#ff6600] to-[#ff3300] text-white hover:opacity-90',
    primary: 'bg-gradient-to-r from-[#ff6600] to-[#ff3300] text-white hover:opacity-90',
    secondary: 'bg-white text-[#2c3e50] border-2 border-[#ff6600] hover:bg-[#fff8f0]',
    outline: 'border-2 border-[#ff6600] text-[#ff6600] hover:bg-[#fff8f0]',
} as const;

const buttonSizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
} as const;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'primary',
    size = 'md',
    children,
    className,
    isLoading,
    disabled,
    onClick,
    ...props
}, ref) => {
    const classes = twMerge(
        'font-medium rounded-lg transition-all duration-200 flex items-center justify-center',
        buttonVariants[variant],
        buttonSizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
    );

    return (
        <motion.button
            ref={ref}
            className={classes}
            disabled={disabled || isLoading}
            onClick={onClick}
            whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined}
            whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <LoadingDots />
                    <span>Loading...</span>
                </div>
            ) : children}
        </motion.button>
    );
});

Button.displayName = 'Button';

export default Button;
