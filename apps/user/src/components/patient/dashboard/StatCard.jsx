import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'brand', link = null }) => {
    const colorClasses = {
        brand:   'bg-brand-50   text-brand-600   dark:bg-brand-500/10   dark:text-brand-400',
        success: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400',
        warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400',
        info:    'bg-info-50    text-info-600    dark:bg-info-500/10    dark:text-info-400',
    };

    return (
        <div className='group relative rounded-none sm:rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm hover:shadow-theme-md transition-all duration-300 h-full flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3 sm:p-5'>
            {/* Icon */}
            <div className={`flex items-center justify-center w-9 h-9 sm:w-13 sm:h-13 rounded-lg sm:rounded-2xl shrink-0 transition-transform group-hover:scale-105 duration-300 ${colorClasses[color] || colorClasses.brand}`}>
                {Icon && <Icon size={18} className='sm:hidden' />}
                {Icon && <Icon size={24} className='hidden sm:block' />}
            </div>

            {/* Content */}
            <div className='flex-grow min-w-0 text-center sm:text-left w-full'>
                <div className='flex items-center justify-center sm:justify-between gap-1'>
                    <h4 className='text-base sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white font-outfit truncate leading-tight'>
                        {value}
                    </h4>
                    {link && (
                        <Link
                            to={link}
                            className='hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-white/5 text-[10px] font-bold text-gray-500 dark:text-gray-400 rounded-lg border border-gray-100 dark:border-gray-800 hover:text-brand-500 transition-colors shrink-0'
                        >
                            View <ArrowUpRight size={12} />
                        </Link>
                    )}
                </div>

                <div className='flex flex-col mt-0.5'>
                    <span className='text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
                        {title}
                    </span>
                    {subtitle && (
                        <p className='text-[10px] sm:text-xs text-brand-500 dark:text-brand-400 font-bold mt-1 flex items-center gap-1.5 flex-wrap'>
                            <span className='w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse shrink-0' />
                            <span className='truncate'>{subtitle}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Mobile tap overlay for linked cards */}
            {link && (
                <Link to={link} className='absolute inset-0 sm:hidden z-10' aria-label={`View ${title}`} />
            )}
        </div>
    );
};

export default StatCard;
