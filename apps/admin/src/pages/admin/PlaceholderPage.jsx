import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';

const PlaceholderPage = ({ title }) => {
    return (
        <>
            <PageBreadcrumb pageTitle={title} />
            <div className='rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm'>
                <h2 className='text-lg font-bold text-gray-800 dark:text-white/90 mb-4'>
                    {title} Content
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                    This page ([{title}]) is currently under development. Please check back later for actual functionality.
                </p>
            </div>
        </>
    );
};

export default PlaceholderPage;




