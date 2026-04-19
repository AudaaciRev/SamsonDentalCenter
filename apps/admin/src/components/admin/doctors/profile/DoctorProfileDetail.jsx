import React, { useState, useMemo } from 'react';
import { TrendingUp, ClipboardList, Star, CheckCircle2, AlertCircle, Save, X, Info } from 'lucide-react';
import Button from '../../../ui/Button';
import { useToast } from '../../../../context/ToastContext.jsx';

const DoctorProfileDetail = ({ doctor }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedServices, setSelectedServices] = useState(doctor.services || []);
    const { showToast } = useToast();

    const categorizedServices = useMemo(() => {
        const defaultServices = [
            { name: 'Dental Cleaning', category: 'General' },
            { name: 'Root Canal', category: 'Specialized' },
            { name: 'Teeth Whitening', category: 'General' },
            { name: 'Orthodontic Consult', category: 'Specialized' },
            { name: 'Oral Surgery', category: 'Specialized' },
            { name: 'X-Ray Scan', category: 'General' },
            { name: 'Filling', category: 'General' },
            { name: 'Extraction', category: 'General' },
            { name: 'Braces Adjustment', category: 'Specialized' },
            { name: 'Invisalign Check', category: 'Specialized' },
            { name: 'Fluoride Treatment', category: 'General' },
            { name: 'Sealants', category: 'General' }
        ];
        
        return {
            authorized: defaultServices.filter(s => selectedServices.includes(s.name)),
            general: defaultServices.filter(s => !selectedServices.includes(s.name) && s.category?.toLowerCase() === 'general'),
            specialized: defaultServices.filter(s => !selectedServices.includes(s.name) && s.category?.toLowerCase() === 'specialized')
        };
    }, [selectedServices]);

    const renderServiceCheckbox = (service) => {
        const isChecked = selectedServices.includes(service.name);
        return (
            <label 
                key={service.name}
                className={`h-full flex items-center justify-between p-2.5 sm:p-3 rounded-lg border transition-all cursor-pointer group ${
                    isChecked 
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10' 
                        : 'border-gray-100 dark:border-gray-800/80 hover:border-brand-500/50 hover:bg-white dark:hover:bg-white/[0.03] bg-gray-50/30 dark:bg-white/[0.01]'
                }`}
            >
                <div className='flex items-center gap-2 sm:gap-3'>
                    <input 
                        type="checkbox"
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900"
                        checked={isChecked}
                        onChange={() => toggleService(service.name)}
                    />
                    <div className="min-w-0">
                        <p className={`text-[clamp(11px,2.5vw,14px)] font-semibold text-gray-800 dark:text-white/90 truncate`}>{service.name}</p>
                        <span className={`text-[clamp(8px,2vw,9px)] font-bold uppercase tracking-widest transition-colors ${isChecked ? 'text-brand-500/70' : 'text-gray-400 group-hover:text-brand-500/70'}`}>
                            {service.category || 'Clinical'}
                        </span>
                    </div>
                </div>
            </label>
        );
    };

    const toggleService = (serviceName) => {
        setSelectedServices(prev => 
            prev.includes(serviceName) 
                ? prev.filter(s => s !== serviceName) 
                : [...prev, serviceName]
        );
    };

    const handleSave = () => {
        // In a real app, this would be an API call
        showToast('Authorized services updated successfully!');
        console.log('Saving services for doctor:', doctor.id, selectedServices);
        doctor.services = selectedServices; // Update local mock data
        doctor.service_count = selectedServices.length;
        setIsEditing(false);
    };

    const handleCancel = () => {
        setSelectedServices(doctor.services || []);
        setIsEditing(false);
    };

    return (
        <div className='space-y-6'>
            {/* Dashboard Metrics (Mini Stats) */}
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className='p-[clamp(1rem,4vw,1.5rem)] border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-white/[0.03] space-y-2 flex flex-col'>
                    <TrendingUp size={20} className='text-brand-500 mb-1' />
                    <h4 className='text-[clamp(1.25rem,4.5vw,1.5rem)] font-black text-gray-900 dark:text-white font-outfit leading-tight'>{doctor.stats.total_appointments}</h4>
                    <p className='text-[clamp(9px,2vw,10px)] font-bold text-gray-400 uppercase tracking-widest'>Total Appointments</p>
                </div>
                <div className='p-[clamp(1rem,4vw,1.5rem)] border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-white/[0.03] space-y-2 flex flex-col'>
                    <ClipboardList size={20} className='text-success-500 mb-1' />
                    <h4 className='text-[clamp(1.25rem,4.5vw,1.5rem)] font-black text-gray-900 dark:text-white font-outfit leading-tight'>{doctor.stats.treatment_count}</h4>
                    <p className='text-[clamp(9px,2vw,10px)] font-bold text-gray-400 uppercase tracking-widest'>Treatments Logged</p>
                </div>
                <div className='col-span-2 lg:col-span-1 p-[clamp(1rem,4vw,1.5rem)] border border-brand-200 rounded-xl dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/[0.02] space-y-2 flex flex-col'>
                    <div className='flex items-center gap-1.5 text-amber-500 mb-1'>
                        <Star size={20} fill='currentColor' />
                    </div>
                    <h4 className='text-[clamp(1.25rem,4.5vw,1.5rem)] font-black text-gray-900 dark:text-white font-outfit leading-tight'>{doctor.stats.rating} / 5.0</h4>
                    <p className='text-[clamp(9px,2vw,10px)] font-bold text-brand-600/70 dark:text-brand-400 uppercase tracking-widest'>Patient Rating</p>
                </div>
            </div>

            {/* Services & Skills Mapping */}
            <div className='p-[clamp(1rem,5vw,1.75rem)] border border-gray-200 rounded-xl dark:border-gray-800 bg-white dark:bg-white/[0.03]'>
                <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-6'>
                    <div>
                        <h4 className='text-[clamp(16px,2.5vw,18px)] font-bold text-gray-900 dark:text-white'>
                            Authorized Services & Skills
                        </h4>
                        <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mt-1'>
                            {selectedServices.length} Clinical Tasks currently authorized for routing logic.
                        </p>
                    </div>

                {!isEditing ? (
                    <div className='hidden lg:block'>
                        <Button 
                            variant='outline'
                            onClick={() => {
                                setIsEditing(true);
                                showToast('Currently on edit mode', 'info', 'Notice');
                            }}
                            className='flex items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold xl:w-auto hover:border-brand-500 hover:text-brand-500 font-outfit'
                        >
                            <svg
                                className='fill-current'
                                width='18'
                                height='18'
                                viewBox='0 0 18 18'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.1262 13.0737 7.1262 13.0737'
                                    fill='currentColor'
                                />
                            </svg>
                            Edit Services
                        </Button>
                    </div>
                ) : (
                    <div className='hidden lg:block'>
                        <Button 
                            variant='outline'
                            onClick={() => showToast('Currently on edit mode', 'info', 'Notice')}
                            className='flex items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold xl:w-auto border-brand-200 text-brand-500 bg-brand-50/30 font-outfit cursor-default'
                        >
                            <Info size={18} />
                            Editing Active
                        </Button>
                    </div>
                )}
                </div>

                {isEditing ? (
                    <div className='space-y-8 animate-in fade-in duration-300'>
                        {/* Currently Authorized Section */}
                        {categorizedServices.authorized.length > 0 && (
                            <div className='space-y-3'>
                                <h5 className='text-xs font-black uppercase tracking-widest text-brand-500 flex items-center gap-2'>
                                    <CheckCircle2 size={14} strokeWidth={3} />
                                    Currently Authorized
                                </h5>
                                <div className='grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 auto-rows-fr'>
                                    {categorizedServices.authorized.map(renderServiceCheckbox)}
                                </div>
                            </div>
                        )}

                        {/* General Services Section */}
                        {categorizedServices.general.length > 0 && (
                            <div className='space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800/50'>
                                <h5 className='text-xs font-black uppercase tracking-widest text-gray-400'>
                                    Available General Services
                                </h5>
                                <div className='grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 auto-rows-fr'>
                                    {categorizedServices.general.map(renderServiceCheckbox)}
                                </div>
                            </div>
                        )}

                        {/* Specialized Services Section */}
                        {categorizedServices.specialized.length > 0 && (
                            <div className='space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800/50'>
                                <h5 className='text-xs font-black uppercase tracking-widest text-gray-400'>
                                    Available Specialized Services
                                </h5>
                                <div className='grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 auto-rows-fr'>
                                    {categorizedServices.specialized.map(renderServiceCheckbox)}
                                </div>
                            </div>
                        )}
                        
                        {/* Action Buttons at the Bottom */}
                        <div className='flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800'>
                            <button 
                                onClick={handleCancel}
                                className='px-5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors'
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className='flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20'
                            >
                                <Save size={16} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-fr'>
                            {selectedServices.length > 0 ? selectedServices.map((service, i) => (
                                <div 
                                    key={i}
                                    className='h-full flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100 dark:border-gray-800/80 hover:border-brand-500/50 transition-colors group bg-gray-50/50 dark:bg-white/[0.01]'
                                >
                                    <div className='flex items-center gap-2 sm:gap-3'>
                                        <div className='w-4 h-4 sm:w-5 sm:h-5 rounded bg-brand-500 flex items-center justify-center text-white shrink-0'>
                                            <CheckCircle2 size={10} sm:size={12} strokeWidth={3} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className='text-[clamp(11px,2.5vw,14px)] font-semibold text-gray-800 dark:text-white/90 truncate'>{service}</p>
                                            <span className='text-[clamp(8px,2vw,9px)] font-bold uppercase tracking-widest text-brand-500/80'>
                                                Authorized
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className='col-span-full py-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl'>
                                    <AlertCircle size={32} className='text-gray-300 mb-3' />
                                    <p className='text-gray-500 dark:text-gray-400 text-sm'>No authorized services configured for this doctor.</p>
                                </div>
                            )}
                        </div>

                        {!isEditing && (
                            <div className='block lg:hidden'>
                                <Button 
                                    variant='outline'
                                    onClick={() => setIsEditing(true)}
                                    className='flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold hover:border-brand-500 hover:text-brand-500'
                                >
                                    <svg
                                        className='fill-current'
                                        width='18'
                                        height='18'
                                        viewBox='0 0 18 18'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            clipRule='evenodd'
                                            d='M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z'
                                            fill='currentColor'
                                        />
                                    </svg>
                                    Edit Services
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorProfileDetail;
