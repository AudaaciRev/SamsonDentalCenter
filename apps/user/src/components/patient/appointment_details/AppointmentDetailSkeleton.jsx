import React from 'react';

const Skeleton = ({ className = '' }) => (
    <div className={`bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse ${className}`} />
);

const AppointmentDetailSkeleton = () => {
    return (
        <div className='flex-grow flex flex-col bg-white dark:bg-gray-900 sm:rounded-xl border-t sm:border border-gray-100 dark:border-gray-800 overflow-hidden animate-[fadeIn_0.2s_ease-out]'>
            {/* Action Bar Skeleton */}
            <div className='px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
                <Skeleton className='h-8 w-24' />
                <div className='flex gap-2'>
                    <Skeleton className='h-8 w-8 rounded-lg' />
                    <Skeleton className='h-8 w-8 rounded-lg' />
                </div>
            </div>

            {/* Content Area Skeleton */}
            <div className='px-0 py-6 sm:p-8 md:p-10 overflow-y-auto grow no-scrollbar bg-white/50 dark:bg-transparent pb-28 sm:pb-8 md:pb-10'>
                <div className='max-w-4xl mx-auto space-y-3 sm:space-y-8'>
                    
                    {/* Header Section Skeleton */}
                    <div className='bg-transparent sm:bg-white dark:sm:bg-gray-800/40 border-0 sm:border border-gray-100/80 dark:border-white/5 rounded-none sm:rounded-xl px-4 pb-4 pt-0 sm:p-8 shadow-none'>
                        <div className='flex flex-row items-center justify-between gap-4'>
                            <div className='space-y-3 flex-1'>
                                <Skeleton className='h-8 sm:h-10 w-2/3 max-w-[300px]' /> {/* Service Name */}
                                <Skeleton className='h-4 w-1/3 max-w-[150px]' /> {/* Appointment ID */}
                            </div>
                            <Skeleton className='h-8 sm:h-10 w-24 sm:w-28 rounded-lg' /> {/* Status Badge */}
                        </div>
                    </div>

                    {/* Timeline Section Skeleton */}
                    <div className='bg-transparent sm:bg-white dark:sm:bg-gray-800/40 border-0 sm:border border-gray-100/80 dark:border-white/5 rounded-none sm:rounded-xl p-4 sm:p-8 shadow-none'>
                        <div className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <Skeleton className='h-4 w-32' />
                                <Skeleton className='h-4 w-24' />
                            </div>
                            <div className='grid grid-cols-3 gap-4'>
                                <Skeleton className='h-1.5 w-full rounded-lg' />
                                <Skeleton className='h-1.5 w-full rounded-lg' />
                                <Skeleton className='h-1.5 w-full rounded-lg' />
                            </div>
                            <div className='space-y-3'>
                                <Skeleton className='h-4 w-full' />
                                <Skeleton className='h-4 w-5/6' />
                            </div>
                        </div>
                    </div>

                    {/* Combined Overview Skeleton */}
                    <div className='bg-transparent sm:bg-white dark:sm:bg-gray-800/40 border-0 sm:border border-gray-100/80 dark:border-white/5 rounded-none sm:rounded-xl p-4 sm:p-8 shadow-none'>
                        <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className='space-y-3'>
                                    <Skeleton className='h-3 w-12' /> {/* Label */}
                                    <div className='flex items-center gap-3'>
                                        <Skeleton className='h-10 w-10 shrink-0 rounded-lg' /> {/* Icon */}
                                        <div className='space-y-2 flex-grow'>
                                            <Skeleton className='h-4 w-full' />
                                            <Skeleton className='h-3 w-1/2' />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tabs Section Skeleton */}
                    <div className='bg-transparent sm:bg-white dark:sm:bg-gray-800/40 border-0 sm:border border-gray-100/80 dark:border-white/5 rounded-none sm:rounded-xl p-4 sm:p-8 shadow-none'>
                        <div className='space-y-6'>
                            <div className='flex gap-8 border-b border-gray-100 dark:border-gray-800 pb-3'>
                                <Skeleton className='h-4 w-16' />
                                <Skeleton className='h-4 w-24' />
                                <Skeleton className='h-4 w-16' />
                            </div>
                            <div className='space-y-4'>
                                <Skeleton className='h-4 w-full' />
                                <Skeleton className='h-4 w-full' />
                                <Skeleton className='h-4 w-2/3' />
                            </div>
                            <div className='pt-8 border-t border-gray-100 dark:border-gray-800 space-y-2'>
                                <Skeleton className='h-4 w-32' />
                                <Skeleton className='h-4 w-24' />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer Skeleton */}
            <div className='fixed sm:absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex gap-3 z-30'>
                <Skeleton className='h-14 flex-1 rounded-lg' />
                <Skeleton className='h-14 flex-1 rounded-lg' />
            </div>
        </div>
    );
};

export default AppointmentDetailSkeleton;
