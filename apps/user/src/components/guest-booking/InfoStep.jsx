import { useState } from 'react';
import { ArrowRight, User, Mail, Phone, Info } from 'lucide-react';

const InfoStep = ({ formData, onUpdate, onNext, onBack }) => {
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Full name is required.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else {
            const sanitizedPhone = formData.phone.replace(/\D/g, '');
            if (!/^\d{10,11}$/.test(sanitizedPhone)) {
                newErrors.phone = 'Please enter a valid phone number (10-11 digits).';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    const handleChange = (field, value) => {
        onUpdate(field, value);
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div>
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>Your Information</h2>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    We need a few details to complete your booking. A confirmation email will be sent to the address you provide.
                </p>
            </div>

            <div className='space-y-6 max-w-xl'>
                {/* Full Name */}
                <div className="relative">
                    <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 ml-1'>
                        Full Name <span className='text-brand-500'>*</span>
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-500 text-gray-400">
                            <User size={18} />
                        </div>
                        <input
                            type='text'
                            value={formData.full_name}
                            onChange={(e) => handleChange('full_name', e.target.value)}
                            placeholder='Juan Dela Cruz'
                            className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl text-sm transition-all outline-hidden
                                ${errors.full_name 
                                    ? 'border-red-100 bg-red-50/50 focus:border-red-300 focus:ring-4 focus:ring-red-500/10' 
                                    : 'border-transparent focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:bg-white dark:focus:bg-gray-800'}`}
                        />
                    </div>
                    {errors.full_name && (
                        <p className='flex items-center gap-1.5 text-red-500 text-[11px] font-bold mt-2 ml-1'>
                            <Info size={12} /> {errors.full_name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="relative">
                    <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 ml-1'>
                        Email Address <span className='text-brand-500'>*</span>
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-500 text-gray-400">
                            <Mail size={18} />
                        </div>
                        <input
                            type='email'
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder='juan@email.com'
                            className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl text-sm transition-all outline-hidden
                                ${errors.email 
                                    ? 'border-red-100 bg-red-50/50 focus:border-red-300 focus:ring-4 focus:ring-red-500/10' 
                                    : 'border-transparent focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:bg-white dark:focus:bg-gray-800'}`}
                        />
                    </div>
                    {errors.email && (
                        <p className='flex items-center gap-1.5 text-red-500 text-[11px] font-bold mt-2 ml-1'>
                            <Info size={12} /> {errors.email}
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div className="relative">
                    <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 ml-1'>
                        Phone Number <span className='text-brand-500'>*</span>
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-500 text-gray-400">
                            <Phone size={18} />
                        </div>
                        <input
                            type='tel'
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder='09171234567'
                            className={`block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border-2 rounded-2xl text-sm transition-all outline-hidden
                                ${errors.phone 
                                    ? 'border-red-100 bg-red-50/50 focus:border-red-300 focus:ring-4 focus:ring-red-500/10' 
                                    : 'border-transparent focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 focus:bg-white dark:focus:bg-gray-800'}`}
                        />
                    </div>
                    {errors.phone && (
                        <p className='flex items-center gap-1.5 text-red-500 text-[11px] font-bold mt-2 ml-1'>
                            <Info size={12} /> {errors.phone}
                        </p>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className='flex justify-between items-center mt-12 pt-6 border-t border-gray-100 dark:border-gray-700'>
                <button
                    onClick={onBack}
                    className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold text-base px-8 py-3 transition-colors'
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className='bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-theme-md flex items-center gap-2 text-base'
                >
                    Review & Confirm
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default InfoStep;
