import { Calendar, Clock, User, Mail, Phone, Stethoscope, ShieldCheck, MailWarning, Info } from 'lucide-react';

const ConfirmStep = ({ formData, onSubmit, onBack, submitting, error }) => {
    const items = [
        { icon: Stethoscope, label: 'Service', value: formData.service_name },
        { icon: Calendar, label: 'Date', value: formData.date },
        { icon: Clock, label: 'Time', value: formData.time },
        { icon: User, label: 'Full Name', value: formData.full_name },
        { icon: Mail, label: 'Email', value: formData.email },
        { icon: Phone, label: 'Phone', value: formData.phone },
    ];

    return (
        <div>
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>Review Your Request</h2>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Please carefully review your appointment details before submitting for approval.
                </p>
            </div>

            {error && (
                <div className='bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-700 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-bold mb-8 flex gap-3 items-center'>
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                        <Info size={16} />
                    </div>
                    {error}
                </div>
            )}

            <div className='bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 md:p-8 mb-8 border border-gray-100 dark:border-gray-700'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    {items.map(({ icon: Icon, label, value }) => (
                        <div
                            key={label}
                            className='flex items-start gap-4'
                        >
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-theme-xs shrink-0 border border-gray-50 dark:border-gray-700">
                                <Icon
                                    size={18}
                                    className='text-brand-500'
                                />
                            </div>
                            <div>
                                <span className='block text-[10px] font-bold text-gray-400 uppercase tracking-widest'>{label}</span>
                                <span className='text-sm font-bold text-gray-900 dark:text-white mt-0.5'>{value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='bg-brand-50/30 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/20 rounded-2xl p-6 mb-10'>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
                        <MailWarning size={20} />
                    </div>
                    <div className="grow">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Action Required: Verification Email</h4>
                        <p className='text-xs text-gray-600 dark:text-gray-400 leading-relaxed'>
                            A verification email will be sent to <strong className="text-brand-600 dark:text-brand-400">{formData.email}</strong>. 
                            You <strong>must</strong> click the link in that email to confirm your request. 
                            Verified requests are then reviewed by our staff.
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className='flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-700'>
                <button
                    onClick={onBack}
                    disabled={submitting}
                    className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold text-base px-8 py-3 transition-colors disabled:opacity-30'
                >
                    Back
                </button>
                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className='bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold
                               px-12 py-4.5 rounded-2xl transition-all shadow-theme-lg
                               disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-base'
                >
                    {submitting ? (
                        <>
                            <div className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin' />
                            Booking...
                        </>
                    ) : (
                        <>
                            Complete Booking
                            <ShieldCheck size={24} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ConfirmStep;
