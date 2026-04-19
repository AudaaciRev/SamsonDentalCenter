import React from 'react';
import { Clock } from 'lucide-react';

const DoctorScheduleDetail = ({ doctor }) => {
    return (
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
            {/* Weekly Routine */}
            <div className='xl:col-span-2 p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03]'>
                <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-4'>
                    Weekly Routine
                </h4>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left'>
                        <thead>
                            <tr className='text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800'>
                                <th className='py-3 font-bold'>Day</th>
                                <th className='py-3 font-bold'>Hours</th>
                                <th className='py-3 font-bold'>Status</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-50 dark:divide-gray-800/50'>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                <tr key={day}>
                                    <td className='py-3 text-sm font-semibold text-gray-800 dark:text-white'>{day}</td>
                                    <td className='py-3'>
                                        {day === 'Sunday' ? (
                                            <span className='text-xs font-medium text-gray-400 italic'>Closed</span>
                                        ) : (
                                            <div className='flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400'>
                                                <Clock size={12} className='text-brand-500' /> 08:00 AM - 05:00 PM
                                            </div>
                                        )}
                                    </td>
                                    <td className='py-3'>
                                        {day === 'Sunday' ? (
                                            <span className='px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest'>Off</span>
                                        ) : (
                                            <span className='px-2 py-0.5 rounded bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400 text-[10px] font-bold uppercase tracking-widest'>Working</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Availability Blocks */}
            <div className='xl:col-span-1 p-6 border border-gray-200 rounded-xl dark:border-gray-800 lg:p-7 bg-white dark:bg-white/[0.03] flex flex-col'>
                <h4 className='text-[clamp(16px,2vw,18px)] font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mb-4'>
                    Time Off Blocks
                </h4>
                <div className='space-y-3 flex-grow'>
                    {[
                        { label: 'Annual Leave', dates: 'Apr 25 - Apr 28', type: 'vacation' },
                        { label: 'Conference', dates: 'May 12 - May 13', type: 'event' }
                    ].map((block, i) => (
                        <div 
                            key={i}
                            className='p-3 rounded-lg border-l-2 border-amber-500 bg-amber-50/[0.3] dark:bg-amber-500/[0.05] space-y-1'
                        >
                            <p className='text-[10px] font-bold uppercase tracking-widest text-amber-600/70 dark:text-amber-500/70'>Upcoming Block</p>
                            <h5 className='text-sm font-semibold text-gray-800 dark:text-white/90'>{block.label}</h5>
                            <p className='text-xs font-medium text-gray-500'>{block.dates}</p>
                        </div>
                    ))}
                </div>
                <button className='w-full mt-4 py-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-500 hover:border-brand-500 hover:text-brand-500 transition-colors bg-gray-50/50 dark:bg-transparent'>
                    Add Block
                </button>
            </div>
        </div>
    );
};

export default DoctorScheduleDetail;
