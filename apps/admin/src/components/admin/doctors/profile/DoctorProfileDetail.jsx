import React from 'react';
import { TrendingUp, ClipboardList, Star, CheckCircle2, AlertCircle } from 'lucide-react';

const DoctorProfileDetail = ({ doctor }) => {
    return (
        <div className='p-4 sm:p-6 lg:p-8 space-y-6'>
            {/* Dashboard Metrics (Mini Stats) */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-white/[0.03] space-y-2 flex flex-col'>
                    <TrendingUp size={20} className='text-brand-500 mb-1' />
                    <h4 className='text-2xl font-black text-gray-900 dark:text-white font-outfit'>{doctor.stats.total_appointments}</h4>
                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Total Appointments</p>
                </div>
                <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-white/[0.03] space-y-2 flex flex-col'>
                    <ClipboardList size={20} className='text-success-500 mb-1' />
                    <h4 className='text-2xl font-black text-gray-900 dark:text-white font-outfit'>{doctor.stats.treatment_count}</h4>
                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Treatments Logged</p>
                </div>
                <div className='p-6 border border-brand-200 rounded-xl dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/[0.02] space-y-2 flex flex-col'>
                    <div className='flex items-center gap-1.5 text-amber-500 mb-1'>
                        <Star size={20} fill='currentColor' />
                    </div>
                    <h4 className='text-2xl font-black text-gray-900 dark:text-white font-outfit'>{doctor.stats.rating} / 5.0</h4>
                    <p className='text-[10px] font-bold text-brand-600/70 dark:text-brand-400 uppercase tracking-widest'>Patient Rating</p>
                </div>
            </div>

            {/* Services & Skills Mapping */}
            <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-6'>
                    <div>
                        <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white'>
                            Services & Skills Mapping
                        </h4>
                        <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mt-1'>
                            {doctor.service_count} Authorized Tasks configuration for routing logic.
                        </p>
                    </div>
                    <button className='flex items-center justify-center rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-800 text-xs font-bold hover:border-brand-500 hover:text-brand-500 transition-colors bg-white dark:bg-transparent'>
                        Edit Services
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {['Dental Cleaning', 'Root Canal', 'Teeth Whitening', 'Orthodontic Consult', 'Oral Surgery', 'X-Ray Scan'].map((service, i) => (
                        <div 
                            key={i}
                            className='flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800/80 hover:border-brand-500/50 transition-colors group bg-gray-50/50 dark:bg-white/[0.01]'
                        >
                            <div className='flex items-center gap-3'>
                                <div className='w-5 h-5 rounded bg-brand-500 flex items-center justify-center text-white'>
                                    <CheckCircle2 size={12} strokeWidth={3} />
                                </div>
                                <div>
                                    <p className='text-sm font-semibold text-gray-800 dark:text-white/90'>{service}</p>
                                    <span className='text-[9px] font-bold uppercase tracking-widest text-brand-500/80'>
                                        {i % 2 === 0 ? 'General' : 'Specialized'}
                                    </span>
                                </div>
                            </div>
                            <button className='text-gray-400 hover:text-red-500 transition-colors'>
                                <AlertCircle size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfileDetail;
