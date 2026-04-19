import React from 'react';

const WaitlistSkeleton = ({ rows = 4 }) => {
    return (
        <div className="flex flex-col p-4 sm:p-6 gap-4">
            {[...Array(rows)].map((_, i) => (
                <div 
                    key={i} 
                    className="flex items-center gap-4 p-5 rounded-xl bg-gray-50/50 dark:bg-white/[0.01] animate-pulse border border-gray-100 dark:border-white/[0.05]"
                >
                    {/* Icon Skeleton */}
                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 shrink-0" />
                    
                    {/* Content Skeleton */}
                    <div className="flex-grow space-y-3">
                        <div className="flex items-center justify-between gap-4">
                            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded-full" />
                            <div className="h-4 w-16 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800/60 rounded-full" />
                            <div className="h-3 w-24 bg-gray-100/50 dark:bg-gray-800/40 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WaitlistSkeleton;
