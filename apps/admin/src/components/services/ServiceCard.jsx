import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhilippinePeso, Clock, ChevronRight } from 'lucide-react';

const ServiceCard = ({ service }) => {
    const navigate = useNavigate();

    const handleNavigate = (e) => {
        e.stopPropagation();
        navigate(`/services/${service.id}`);
    };

    return (
        <div 
            onClick={handleNavigate}
            className='group relative flex flex-col bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 cursor-pointer'
        >
            {/* Image Container */}
            <div className='relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800'>
                {service.image_url ? (
                    <img
                        src={service.image_url}
                        alt={service.name}
                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out flex'
                    />
                ) : (
                    <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/[0.02]'>
                        <span className='text-gray-300 dark:text-gray-700 font-black uppercase tracking-widest text-[10px]'>
                            No Image
                        </span>
                    </div>
                )}
                
                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
            </div>

            {/* Content Container */}
            <div className='p-6 flex flex-col grow bg-white dark:bg-gray-900'>
                <div className='flex items-start justify-between mb-4'>
                    <div className='flex flex-col'>
                        <span className='text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1.5'>
                            {service.tier}
                        </span>
                        <h4 className='text-lg font-black text-gray-900 dark:text-white font-outfit leading-tight group-hover:text-brand-500 transition-colors uppercase tracking-tight'>
                            {service.name}
                        </h4>
                    </div>
                </div>

                {/* Meta details */}
                <div className='mt-auto pt-5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between'>
                    <div className='flex items-center gap-1.5'>
                        <PhilippinePeso size={16} className='text-brand-600 dark:text-brand-400' />
                        <span className='text-xl font-black text-gray-900 dark:text-white font-outfit'>
                            {Number(service.cost).toLocaleString()}
                        </span>
                    </div>
                    <div className='flex items-center gap-1.5 text-gray-400'>
                        <Clock size={14} />
                        <span className='text-xs font-bold'>
                            {service.duration}
                        </span>
                    </div>
                </div>
                
                <div className='mt-4 flex items-center justify-end text-[10px] font-black uppercase tracking-widest text-brand-500 hover:text-brand-600 transition-colors'>
                    View Detail <ChevronRight size={14} />
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
