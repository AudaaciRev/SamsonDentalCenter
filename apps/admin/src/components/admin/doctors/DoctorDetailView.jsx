import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar } from 'lucide-react';
import DoctorProfileDetail from './profile/DoctorProfileDetail';
import DoctorScheduleDetail from './schedule/DoctorScheduleDetail';
import DoctorHistoryDetail from './history/DoctorHistoryDetail';

const DoctorDetailView = ({ doctor, onBack, activeTab }) => {
    if (!doctor) return null;

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const tierBadge = {
        general: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
        specialized: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-100 dark:border-purple-500/20',
        both: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 border-brand-100 dark:border-brand-500/20'
    };

    return (
        <div className='flex flex-col grow min-h-0 bg-white dark:bg-white/[0.03] sm:rounded-xl border-t sm:border border-gray-100 dark:border-gray-800 overflow-hidden no-scrollbar'>
            {/* Top Navigation */}
            <div className='sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <button 
                        onClick={onBack}
                        className='p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 transition-colors'
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h3 className='text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight font-outfit'>
                            {doctor.full_name}
                        </h3>
                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1'>
                            Detail Profile
                        </p>
                    </div>
                </div>
            </div>

            <div className='grow overflow-y-auto no-scrollbar'>
                <div className='p-4 sm:p-6 lg:p-8 space-y-6'>
                    {/* A. Header / Profile Section (Matches UserMetaCard style) */}
                    <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                        <div className='flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between'>
                            <div className='flex flex-col items-center w-full gap-6 xl:flex-row xl:items-center'>
                                <div className='relative shrink-0'>
                                    <div className='w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 flex items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold text-2xl shadow-inner'>
                                        {doctor.photo_url ? (
                                            <img src={doctor.photo_url} alt={doctor.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                            doctor.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 ${doctor.is_active ? 'bg-success-500' : 'bg-gray-400'}`} title={doctor.is_active ? 'Active' : 'Inactive'} />
                                </div>
                                <div className='order-3 xl:order-2 text-center xl:text-left'>
                                    <h4 className='mb-2 text-[clamp(18px,2vw,20px)] font-bold text-gray-900 dark:text-white font-outfit flex items-center justify-center xl:justify-start gap-3'>
                                        {doctor.full_name}
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${tierBadge[doctor.tier]}`}>
                                            {doctor.tier}
                                        </span>
                                    </h4>
                                    <div className='flex flex-col items-center gap-2 text-center xl:flex-row xl:gap-3 xl:text-left'>
                                        <p className='text-[clamp(13px,1.2vw,14px)] text-brand-600 dark:text-brand-400 font-bold'>
                                            {doctor.specialization}
                                        </p>
                                        <div className='hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block'></div>
                                        <p className='text-[clamp(13px,1.2vw,14px)] text-gray-500 dark:text-gray-400 font-medium'>
                                            License: {doctor.license_number}
                                        </p>
                                        <div className='hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block'></div>
                                        <p className='text-[clamp(13px,1.2vw,14px)] text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1 justify-center xl:justify-start'>
                                            <Calendar size={14} /> Joined {formatDate(doctor.created_at)}
                                        </p>
                                    </div>
                                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-2xl font-medium leading-relaxed'>
                                        {doctor.bio}
                                    </p>
                                </div>
                            </div>
                            <div className='flex flex-col sm:flex-row xl:flex-col gap-2 shrink-0'>
                                <button className='flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-800 text-sm font-bold xl:w-auto hover:border-brand-500 hover:text-brand-500 transition-colors bg-white dark:bg-transparent'>
                                    Edit Profile
                                </button>
                                <button className='flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 bg-brand-500 text-white text-sm font-bold xl:w-auto hover:bg-brand-600 transition-colors'>
                                    Manage Schedule
                                </button>
                            </div>
                        </div>

                        {/* Contact & Meta footer within Header Card */}
                        <div className='mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-6'>
                            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium'>
                                <Mail size={16} className='text-gray-400' /> {doctor.email}
                            </div>
                            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium'>
                                <Phone size={16} className='text-gray-400' /> {doctor.phone}
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Child Content */}
                    {(!activeTab || activeTab === 'profile') && <DoctorProfileDetail doctor={doctor} />}
                    {activeTab === 'schedule' && <DoctorScheduleDetail doctor={doctor} />}
                    {activeTab === 'history' && <DoctorHistoryDetail doctor={doctor} />}

                </div>
            </div>
        </div>
    );
};

export default DoctorDetailView;
