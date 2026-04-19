import React from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import ProfileBriefView from '../../components/admin/profile/ProfileBriefView';

const AdminProfile = () => {
    return (
        <div className='flex flex-col h-full'>
            <PageBreadcrumb pageTitle='Profile' className='mb-4' />
            
            <div className='flex flex-col grow'>
                <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                    <ProfileBriefView />
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
