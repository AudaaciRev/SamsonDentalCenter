import { useState, useEffect } from 'react';
import { ArrowRight, UserCircle, Contact, Info, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserOtherInfoStep = ({ formData, book_for_others, onUpdate, setBookForOthersMode, onNext, onBack }) => {
    const { user } = useAuth();
    const [errors, setErrors] = useState({});

    // Internal state for name parts (synced with formData for "Someone Else")
    const [nameParts, setNameParts] = useState({
        first: formData.booked_for_first_name || '',
        last: formData.booked_for_last_name || '',
        middle: formData.booked_for_middle_name || '',
        suffix: formData.booked_for_suffix_name || ''
    });

    // Update nameParts if formData changes (e.g., on back/next)
    useEffect(() => {
        if (book_for_others) {
            setNameParts({
                first: formData.booked_for_first_name || '',
                last: formData.booked_for_last_name || '',
                middle: formData.booked_for_middle_name || '',
                suffix: formData.booked_for_suffix_name || ''
            });
        }
    }, [book_for_others, formData.booked_for_first_name, formData.booked_for_last_name, formData.booked_for_middle_name, formData.booked_for_suffix_name]);

    const validate = () => {
        const newErrors = {};

        if (book_for_others) {
            if (!nameParts.first?.trim()) newErrors.first_name = 'First name is required.';
            if (!nameParts.last?.trim()) newErrors.last_name = 'Last name is required.';

            if (formData.booked_for_phone?.trim()) {
                const sanitizedPhone = formData.booked_for_phone.replace(/\D/g, '');
                if (!/^\d{10,11}$/.test(sanitizedPhone)) {
                    newErrors.phone = 'Please enter a valid phone number.';
                }
            } else {
                newErrors.phone = 'Phone number is required.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    const handleFieldChange = (field, value) => {
        onUpdate({ [field]: value });
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleNamePartChange = (part, value) => {
        const updatedParts = { ...nameParts, [part]: value };
        setNameParts(updatedParts);

        onUpdate({
            [`booked_for_${part}_name`]: value,
        });

        if (errors[`${part}_name`]) {
            setErrors(prev => ({ ...prev, [`${part}_name`]: undefined }));
        }
    };

    const getInputClasses = (fieldError) => {
        const base = "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-[clamp(14px,1vw,15px)] shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 transition-colors bg-white dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 font-medium";
        if (fieldError) {
            return `${base} border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
        }
        return `${base} text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
    };

    const labelClasses = "mb-1.5 block text-[clamp(12px,0.8vw,13px)] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-widest opacity-80 leading-none";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10 sm:pb-6">
            {/* Header Section */}
            <div className='mb-8 sm:mb-10'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight uppercase'>
                    Patient Information
                </h2>
                <p className='text-[13px] sm:text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium'>
                    Confirm who this appointment is for and provide contact details if booking on behalf of someone else.
                </p>
            </div>

            {/* Who is it for? Custom Segmented Control */}
            <div className='mb-8 flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 p-1.5 sm:p-2 rounded-2xl w-fit'>
                <button
                    type='button'
                    onClick={() => setBookForOthersMode(false)}
                    className={`px-6 py-2 sm:px-8 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all duration-300 uppercase tracking-[0.1em] ${!book_for_others
                            ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 shadow-theme-sm ring-1 ring-black/5 dark:ring-white/5'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    Myself
                </button>
                <button
                    type='button'
                    onClick={() => setBookForOthersMode(true)}
                    className={`px-6 py-2 sm:px-8 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all duration-300 uppercase tracking-[0.1em] ${book_for_others
                            ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 shadow-theme-sm ring-1 ring-black/5 dark:ring-white/5'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    Others
                </button>
            </div>

            {/* Premium Card Container */}
            <div className='w-full bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-theme-sm overflow-hidden'>
                {!book_for_others ? (
                    <section className="animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="px-6 py-6 sm:px-10 flex items-center gap-3 border-b border-gray-50 dark:border-gray-800/50 mb-6">
                            <UserCircle size={20} className="text-brand-500" />
                            <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white/90 uppercase tracking-widest leading-none">Account Identity</h3>
                        </div>
                        <div className="px-6 pb-10 sm:px-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div><label className={labelClasses}>First Name</label><input type='text' value={user?.first_name || ''} readOnly className={getInputClasses() + " cursor-not-allowed opacity-70 bg-gray-50/50"} /></div>
                                <div><label className={labelClasses}>Last Name</label><input type='text' value={user?.last_name || ''} readOnly className={getInputClasses() + " cursor-not-allowed opacity-70 bg-gray-50/50"} /></div>
                                <div><label className={labelClasses}>Middle Name</label><input type='text' value={user?.middle_name || ''} readOnly className={getInputClasses() + " cursor-not-allowed opacity-70 bg-gray-50/50"} /></div>
                                <div><label className={labelClasses}>Suffix</label><input type='text' value={user?.suffix || ''} readOnly className={getInputClasses() + " cursor-not-allowed opacity-70 bg-gray-50/50"} /></div>
                            </div>
                        </div>
                        <div className="px-6 py-6 sm:px-10 flex items-center gap-3 border-b border-gray-50 dark:border-gray-800/50 mb-6 border-t">
                            <Contact size={20} className="text-brand-500" />
                            <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white/90 uppercase tracking-widest leading-none">Contact Details</h3>
                        </div>
                        <div className="px-6 pb-10 sm:px-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div>
                                    <label className={labelClasses}>Email Address</label>
                                    <div className="relative group"><input type='email' value={user?.email || ''} readOnly className={getInputClasses() + " cursor-not-allowed opacity-70 bg-gray-50/50 pr-10"} /><Mail size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 opacity-50" /></div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Phone Number</label>
                                    <div className="relative group"><input type='tel' value={user?.phone || ''} readOnly className={getInputClasses() + " cursor-not-allowed opacity-70 bg-gray-50/50 pr-10"} /><Phone size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 opacity-50" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="mx-6 sm:mx-10 mt-2 mb-10 bg-brand-50/50 dark:bg-brand-500/5 border border-brand-100/50 dark:border-brand-500/10 rounded-2xl p-6 sm:p-8">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20"><ShieldCheck size={22} /></div>
                                    <h4 className="text-[14px] sm:text-base font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">Booking for Yourself</h4>
                                </div>
                                <p className="text-[12px] sm:text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">Notifications will be sent to: <strong className="text-brand-600 dark:text-brand-400 break-all">{user?.email}</strong></p>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="px-6 py-6 sm:px-10 flex items-center gap-3 border-b border-gray-50 dark:border-gray-800/50 mb-6">
                            <UserCircle size={20} className="text-brand-500" />
                            <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white/90 uppercase tracking-widest leading-none">Patient Details</h3>
                        </div>
                        <div className="px-6 pb-10 sm:px-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div>
                                    <label className={labelClasses}>First Name <span className='text-brand-500'>*</span></label>
                                    <input type='text' value={nameParts.first} onChange={(e) => handleNamePartChange('first', e.target.value)} placeholder='John' className={getInputClasses(errors.first_name)} />
                                    {errors.first_name && <p className='text-error-500 text-[10px] font-bold mt-1.5 ml-1'>{errors.first_name}</p>}
                                </div>
                                <div>
                                    <label className={labelClasses}>Last Name <span className='text-brand-500'>*</span></label>
                                    <input type='text' value={nameParts.last} onChange={(e) => handleNamePartChange('last', e.target.value)} placeholder='Doe' className={getInputClasses(errors.last_name)} />
                                    {errors.last_name && <p className='text-error-500 text-[10px] font-bold mt-1.5 ml-1'>{errors.last_name}</p>}
                                </div>
                                <div><label className={labelClasses}>Middle Name <span className="opacity-40 font-normal italic text-[9px]">(optional)</span></label><input type='text' value={nameParts.middle} onChange={(e) => handleNamePartChange('middle', e.target.value)} placeholder='Optional' className={getInputClasses()} /></div>
                                <div><label className={labelClasses}>Suffix <span className="opacity-40 font-normal italic text-[9px]">(optional)</span></label><input type='text' value={nameParts.suffix} onChange={(e) => handleNamePartChange('suffix', e.target.value)} placeholder='Jr., III' className={getInputClasses()} /></div>
                            </div>
                        </div>
                        <div className="px-6 py-6 sm:px-10 flex items-center gap-3 border-b border-gray-50 dark:border-gray-800/50 mb-6 border-t">
                            <Contact size={20} className="text-brand-500" />
                            <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-white/90 uppercase tracking-widest leading-none">Contact Information</h3>
                        </div>
                        <div className="px-6 pb-10 sm:px-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div>
                                    <label className={labelClasses}>Email Address <span className='text-brand-500'>*</span></label>
                                    <div className='h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-gray-800 text-slate-500 dark:text-white/40 flex items-center overflow-hidden'><span className="truncate">{user?.email}</span></div>
                                </div>
                                <div>
                                    <label className={labelClasses}>Phone Number <span className='text-brand-500'>*</span></label>
                                    <div className="relative group"><input type='tel' value={formData.booked_for_phone} onChange={(e) => handleFieldChange('booked_for_phone', e.target.value)} placeholder='09171234567' className={getInputClasses(errors.phone)} /><Phone size={14} className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-400 transition-colors" /></div>
                                    {errors.phone && <p className='text-error-500 text-[10px] font-bold mt-1.5 ml-1'>{errors.phone}</p>}
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Navigation Footer */}
            <div className='fixed bottom-0 left-0 right-0 sm:relative z-40 px-6 py-4 sm:px-0 sm:py-0 sm:mt-6 sm:pt-2 bg-white/95 dark:bg-gray-900/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t border-gray-100 dark:border-gray-800 sm:border-t-0 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] sm:shadow-none transition-all'>
                <div className='flex items-center gap-3 w-full sm:justify-between'>
                    <button onClick={onBack} className='flex-1 sm:flex-none sm:min-w-[120px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[11px] sm:text-sm px-6 py-3.5 sm:px-8 transition-colors uppercase tracking-widest bg-gray-50 dark:bg-gray-800 sm:bg-transparent rounded-2xl sm:rounded-2xl border border-transparent shadow-theme-xs'>Back</button>
                    <button onClick={handleNext} className='flex-[2] sm:flex-none sm:min-w-[240px] bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-6 py-3.5 sm:px-10 sm:py-4 rounded-2xl transition-all shadow-theme-md flex items-center justify-center gap-2 sm:gap-2.5 text-[12px] sm:text-base uppercase tracking-widest'>Continue to Review<ArrowRight size={20} className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                </div>
            </div>
        </div>
    );
};

export default UserOtherInfoStep;
