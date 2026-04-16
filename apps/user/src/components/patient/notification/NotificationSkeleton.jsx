import React from 'react';

const NotificationSkeleton = ({ rows = 6 }) => {
    return (
        <div className="flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
            {[...Array(rows)].map((_, i) => (
                <div 
                    key={i} 
                    className="flex gap-4 p-5 border-b border-gray-100 dark:border-gray-800 animate-pulse"
                >
                    {/* Icon Skeleton */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800" />
                    
                    {/* Content Skeleton */}
                    <div className="flex-grow space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-1/3 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                            <div className="h-3 w-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg" />
                        </div>
                        <div className="h-3 w-3/4 bg-gray-50 dark:bg-gray-800/50 rounded-lg" />
                        <div className="h-2 w-24 bg-gray-50 dark:bg-gray-800/30 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationSkeleton;
