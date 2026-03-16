import React from 'react';
import { cn } from '@/lib/utils';

/**
 * @typedef {Object} ButtonProps
 * @property {'primary' | 'secondary' | 'outline' | 'ghost'} [variant='primary']
 * @property {'sm' | 'md' | 'lg'} [size='md']
 * @property {boolean} [isLoading=false]
 * @property {React.ReactNode} [children]
 * @extends {React.ButtonHTMLAttributes<HTMLButtonElement>}
 */

export const Button = React.forwardRef(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            disabled,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    // Base styles
                    'inline-flex items-center justify-center font-semibold tracking-wide transition-[background-color,border-color,transform,box-shadow] duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:translate-y-0',

                    // Radius Level 3
                    'rounded-lg',

                    // Variants
                    variant === 'primary' &&
                        'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 border border-transparent',
                    variant === 'secondary' &&
                        'bg-slate-100 text-slate-900 hover:bg-slate-200 hover:shadow-sm hover:-translate-y-0.5 border border-transparent',
                    variant === 'outline' &&
                        'bg-white text-slate-700 border border-slate-200/60 hover:border-blue-200/50 hover:bg-slate-50 hover:shadow-sm hover:-translate-y-0.5',
                    variant === 'ghost' &&
                        'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',

                    // Sizes
                    size === 'sm' && 'h-9 px-4 text-xs',
                    size === 'md' && 'h-11 px-6 text-sm',
                    size === 'lg' && 'h-14 px-8 text-base',

                    className,
                )}
                {...props}
            >
                {isLoading && (
                    <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                    >
                        <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                        ></circle>
                        <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                    </svg>
                )}
                {children}
            </button>
        );
    },
);
Button.displayName = 'Button';
