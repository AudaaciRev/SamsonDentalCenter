import React from 'react';
import { cn } from '@/lib/utils';

/**
 * @typedef {Object} InputProps
 * @property {string} [label]
 * @property {string} [error]
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 */

export const Input = React.forwardRef(({ className, label, error, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
        <div className='space-y-2'>
            {label && (
                <label
                    htmlFor={inputId}
                    className='block text-sm font-medium text-slate-700'
                >
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                className={cn(
                    // Base
                    'block w-full transition-[border-color,box-shadow] duration-200 ease-in-out',
                    // Radius Level 3
                    'rounded-lg',
                    // Colors & Borders
                    'border border-slate-200/60 bg-white text-slate-900 placeholder:text-slate-400',
                    // Focus
                    'focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none',
                    // Spacing
                    'px-4 py-3 text-sm',
                    // Error state
                    error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
                    className,
                )}
                {...props}
            />
            {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
    );
});
Input.displayName = 'Input';
