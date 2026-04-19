import React from 'react';

const ProfileSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Meta Card Skeleton */}
            <div className="p-6 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-white/[0.03] space-y-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 dark:bg-gray-800" />
                    <div className="space-y-3">
                        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                        <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800/50 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Content Card Skeletons */}
            {[...Array(2)].map((_, i) => (
                <div key={i} className="p-6 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-white/[0.03] space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                        <div className="h-9 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, j) => (
                            <div key={j} className="space-y-2">
                                <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800/50 rounded-full" />
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfileSkeleton;
