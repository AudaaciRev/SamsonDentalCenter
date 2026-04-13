import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';

const SecretaryDashboard = () => {
    return (
        <>
            <PageBreadcrumb pageTitle='Secretary Dashboard' />
            
            <div className='space-y-6'>
                {/* Welcome Section */}
                <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm'>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-white/90 font-outfit'>
                        Welcome to the Secretary Portal
                    </h2>
                    <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                        This is your starting point. You can begin adding secretary-specific widgets and summaries here.
                    </p>
                </div>

                {/* Blank State for Future Content */}
                <div className='min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl dark:border-gray-800'>
                    <div className='text-center'>
                        <h3 className='text-gray-400 font-medium'>No content yet</h3>
                        <p className='text-gray-400 text-sm'>Dashboard is ready for implementation.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SecretaryDashboard;

