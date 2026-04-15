import React from 'react';

const PageLoader = ({ message = 'Loading' }) => {
    return (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white dark:bg-gray-900">
            <div className="flex flex-col items-center gap-6">
                {/* Minimal Animating Spinner */}
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-2 border-gray-100 dark:border-gray-800" />
                    <div className="absolute inset-0 rounded-full border-2 border-t-brand-500 animate-spin" />
                </div>

                {/* Animating Text */}
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">
                        {message}
                    </span>
                    <div className="flex gap-1 mb-1">
                        <div className="w-1 h-1 rounded-full bg-brand-500 animate-[bounce_1s_infinite_0ms]" />
                        <div className="w-1 h-1 rounded-full bg-brand-500 animate-[bounce_1s_infinite_200ms]" />
                        <div className="w-1 h-1 rounded-full bg-brand-500 animate-[bounce_1s_infinite_400ms]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageLoader;
