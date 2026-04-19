import React from 'react';

const DoctorHistoryDetail = ({ doctor }) => {
    return (
        <div className='space-y-6'>
            <div className='p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                <div className='flex items-center justify-between mb-6'>
                    <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white'>
                        Clinical History
                    </h4>
                    <span className='px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest'>
                        Last 10 Appointments
                    </span>
                </div>
                <div className='overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800'>
                    <div className='divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-transparent'>
                        {[
                            { patient: 'Alice Freeman', service: 'Teeth Whitening', date: 'Oct 20, 2:30 PM', status: 'Completed' },
                            { patient: 'Robert Fox', service: 'Dental Cleaning', date: 'Oct 19, 10:00 AM', status: 'Completed' },
                            { patient: 'Jenny Wilson', service: 'Root Canal', date: 'Oct 19, 09:00 AM', status: 'Completed' }
                        ].map((appt, i) => (
                            <div key={i} className='px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors'>
                                <div className='flex items-center gap-3'>
                                    <div className='hidden sm:flex w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center font-bold text-xs text-gray-500'>
                                        {appt.patient.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className='text-sm font-semibold text-gray-900 dark:text-white/90'>{appt.patient}</p>
                                        <p className='text-[11px] font-medium text-gray-500'>{appt.service}</p>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between sm:flex-col sm:items-end gap-1'>
                                    <p className='text-xs font-semibold text-gray-700 dark:text-gray-300'>{appt.date}</p>
                                    <span className='text-[9px] font-bold uppercase tracking-widest text-success-500'>{appt.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button className='w-full mt-4 py-3 rounded-lg text-xs font-bold text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors'>
                    View Full Registry
                </button>
            </div>
        </div>
    );
};

export default DoctorHistoryDetail;
