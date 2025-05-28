import { InputHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <input
                    className={twMerge(
                        'w-full px-4 py-3 rounded-lg border-2 bg-white focus:outline-none focus:ring-2',
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'border-[#ff6600]/20 focus:border-[#ff6600] focus:ring-[#ff6600]/20',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                )}
            </div>
        );
    }
);
