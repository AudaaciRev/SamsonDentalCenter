import { useState } from 'react';
import { User, Mail, Phone, Lock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onSubmit, loading = false, error = null }) => {
    const [signupData, setSignupData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        dob: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [signupErrors, setSignupErrors] = useState({});

    const navigate = useNavigate();

    const updateField = (field, value) => {
        setSignupData({ ...signupData, [field]: value });
        if (signupErrors[field]) {
            const newErrors = { ...signupErrors };
            delete newErrors[field];
            setSignupErrors(newErrors);
        }
    };

    const handleToggleLogin = () => {
        navigate('/login');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(signupData);
    };

    return (
        <div className='animate-in fade-in slide-in-from-left-4 duration-500 flex flex-col h-full min-h-0 overflow-hidden'>
            <div className='mb-4 text-center flex-shrink-0'>
                <h2 className='text-2xl font-brand font-black text-slate-900 mb-1 tracking-tight'>
                    Join Us
                </h2>
                <p className='text-slate-400 text-xs font-medium'>
                    Register for a premium experience.
                </p>
            </div>

            <div className='flex-grow overflow-y-auto pr-2 custom-scrollbar mb-4'>
                <form
                    className='space-y-5 pb-4'
                    id='register-form'
                    onSubmit={handleFormSubmit}
                >
                    {/* Category: Personal Identity */}
                    <div className='space-y-3'>
                        <div className='flex items-center justify-start opacity-40'>
                            <span className='text-[9px] font-bold text-slate-400 uppercase tracking-widest'>
                                Personal Identity
                            </span>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div className='relative group'>
                                <label className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 block text-left group-focus-within:text-sky-500 transition-colors'>
                                    First Name
                                </label>
                                <div className='relative'>
                                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors'>
                                        <User size={16} />
                                    </div>
                                    <input
                                        type='text'
                                        value={signupData.firstName}
                                        onChange={(e) => updateField('firstName', e.target.value)}
                                        className={`w-full bg-slate-50/50 border rounded-xl pl-10 pr-3 py-2 focus:bg-white outline-none text-[13px] font-medium text-left transition-all ${signupErrors.firstName ? 'border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-sky-500 shadow-sm'}`}
                                        placeholder='First'
                                    />
                                </div>
                                {signupErrors.firstName && (
                                    <p className='text-red-500 text-[10px] font-bold mt-1 text-right animate-in fade-in slide-in-from-top-1'>
                                        {signupErrors.firstName}
                                    </p>
                                )}
                            </div>
                            <div className='relative group'>
                                <label className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 block text-left group-focus-within:text-sky-500 transition-colors'>
                                    Middle Name
                                </label>
                                <div className='relative'>
                                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors'>
                                        <User size={16} />
                                    </div>
                                    <input
                                        type='text'
                                        value={signupData.middleName}
                                        onChange={(e) => updateField('middleName', e.target.value)}
                                        className='w-full bg-slate-50/50 border border-slate-100 rounded-xl pl-10 pr-3 py-2 focus:bg-white focus:border-sky-500 outline-none text-[13px] font-medium text-left transition-all shadow-sm'
                                        placeholder='Middle'
                                    />
                                </div>
                                {signupErrors.middleName && (
                                    <p className='text-red-500 text-[10px] font-bold mt-1 text-right animate-in fade-in slide-in-from-top-1'>
                                        {signupErrors.middleName}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div className='relative group'>
                                <label className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 block text-left group-focus-within:text-sky-500 transition-colors'>
                                    Last Name
                                </label>
                                <div className='relative'>
                                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors'>
                                        <User size={16} />
                                    </div>
                                    <input
                                        type='text'
                                        value={signupData.lastName}
                                        onChange={(e) => updateField('lastName', e.target.value)}
                                        className={`w-full bg-slate-50/50 border rounded-xl pl-10 pr-3 py-2 focus:bg-white outline-none text-[13px] font-medium text-left transition-all ${signupErrors.lastName ? 'border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-sky-500 shadow-sm'}`}
                                        placeholder='Last'
                                    />
                                </div>
                                {signupErrors.lastName && (
                                    <p className='text-red-500 text-[10px] font-bold mt-1 text-right animate-in fade-in slide-in-from-top-1'>
                                        {signupErrors.lastName}
                                    </p>
                                )}
                            </div>
                            <div className='relative group'>
                                <label className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 block text-left group-focus-within:text-sky-500 transition-colors'>
                                    Suffix
                                </label>
                                <div className='relative'>
                                    <select
                                        value={signupData.suffix}
                                        onChange={(e) => updateField('suffix', e.target.value)}
                                        className='w-full bg-slate-50/50 border border-slate-100 rounded-xl px-4 py-2 focus:bg-white focus:border-sky-500 outline-none text-[13px] font-medium text-left transition-all shadow-sm appearance-none'
                                    >
                                        <option value=''>None</option>
                                        <option value='Jr.'>Jr.</option>
                                        <option value='Sr.'>Sr.</option>
                                        <option value='II'>II</option>
                                        <option value='III'>III</option>
                                        <option value='IV'>IV</option>
                                    </select>
                                    <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
                                        <svg
                                            className='w-4 h-4'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M19 9l-7 7-7-7'
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {signupErrors.suffix && (
                                    <p className='text-red-500 text-[10px] font-bold mt-1 text-right animate-in fade-in slide-in-from-top-1'>
                                        {signupErrors.suffix}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='grid grid-cols-1 gap-3'>
                            <div className='relative group'>
                                <label className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 block text-left group-focus-within:text-sky-500 transition-colors'>
                                    Birthday
                                </label>
                                <div className='relative'>
                                    <input
                                        type='date'
                                        value={signupData.dob}
                                        onChange={(e) => updateField('dob', e.target.value)}
                                        className={`w-full bg-slate-50/50 border rounded-xl px-4 py-2 focus:bg-white outline-none text-[13px] font-medium text-left transition-all ${signupErrors.dob ? 'border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-sky-500 shadow-sm'}`}
                                    />
                                </div>
                                {signupErrors.dob && (
                                    <p className='text-red-500 text-[10px] font-bold mt-1 text-right animate-in fade-in slide-in-from-top-1'>
                                        {signupErrors.dob}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Category: Contact Info */}
                    <div className='space-y-3'>
                        <div className='flex items-center justify-start opacity-40'>
                            <span className='text-[9px] font-bold text-slate-400 uppercase tracking-widest'>
                                Contact Information
                            </span>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div className='relative group'>
                                <label className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 block text-left group-focus-within:text-sky-500 transition-colors'>
                                    Email
                                </label>
                                <div className='relative'>
                                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors'>
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        type='email'
                                        value={signupData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className={`w-full bg-slate-50/50 border rounded-xl pl-10 pr-3 py-2 focus:bg-white outline-none text-[13px] font-medium text-left transition-all ${signupErrors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-sky-500 shadow-sm'}`}
                                        placeholder='email@address.com'
                                    />
                                </div>
                                {signupErrors.email && (
                                    <p className='text-red-500 text-[10px] font-bold mt-1 text-right animate-in fade-in slide-in-from-top-1'>
                                        {signupErrors.email}
                                    </p>
                                )}
                            </div>
                            <div className='relative group'>
                                <label className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 block text-left group-focus-within:text-sky-500 transition-colors'>
                                    Phone
                                </label>
                                <div className='relative'>
                                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors'>
                                        <Phone size={16} />
                                    </div>
                                    <input
                                        type='tel'
                                        value={signupData.phone}
                                        onChange={(e) => updateField('phone', e.target.value)}
                                        className={`w-full bg-slate-50/50 border rounded-xl pl-10 pr-3 py-2 focus:bg-white outline-none text-[13px] font-medium text-left transition-all ${signupErrors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-sky-500 shadow-sm'}`}
                                        placeholder='+63 9xx...'
                                    />
                                </div>
                                {signupErrors.phone && (
                                    <p className='text-red-500 text-[10px] font-bold mt-1 text-right animate-in fade-in slide-in-from-top-1'>
                                        {signupErrors.phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Category: Security */}
                    <div className='space-y-3'>
                        <div className='flex items-center justify-start opacity-40'>
                            <span className='text-[9px] font-bold text-slate-400 uppercase tracking-widest'>
                                Account Security
                            </span>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div className='relative group'>
                                <label className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 block text-left group-focus-within:text-sky-500 transition-colors'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors'>
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        type='password'
                                        value={signupData.password}
                                        onChange={(e) => updateField('password', e.target.value)}
                                        className={`w-full bg-slate-50/50 border rounded-xl pl-10 pr-3 py-2 focus:bg-white outline-none text-[13px] font-medium text-left transition-all ${signupErrors.password ? 'border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-sky-500 shadow-sm'}`}
                                        placeholder='••••••••'
                                    />
                                </div>
                                {signupErrors.password && (
                                    <p className='text-red-500 text-[10px] font-bold mt-1 text-right animate-in fade-in slide-in-from-top-1'>
                                        {signupErrors.password}
                                    </p>
                                )}
                            </div>
                            <div className='relative group'>
                                <label className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 block text-left group-focus-within:text-sky-500 transition-colors'>
                                    Confirm
                                </label>
                                <div className='relative'>
                                    <div className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors'>
                                        <Lock size={16} />
                                    </div>
                                    <input
                                        type='password'
                                        value={signupData.confirmPassword}
                                        onChange={(e) =>
                                            updateField('confirmPassword', e.target.value)
                                        }
                                        className={`w-full bg-slate-50/50 border rounded-xl pl-10 pr-3 py-2 focus:bg-white outline-none text-[13px] font-medium text-left transition-all ${signupErrors.confirmPassword ? 'border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-sky-500 shadow-sm'}`}
                                        placeholder='••••••••'
                                    />
                                </div>
                                {signupErrors.confirmPassword && (
                                    <p className='text-red-500 text-[10px] font-bold mt-1 text-right animate-in fade-in slide-in-from-top-1'>
                                        {signupErrors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className='flex-shrink-0 pt-4 border-t border-slate-50 text-center'>
                {error && (
                    <div className='text-red-500 text-[11px] font-bold bg-red-50 p-2.5 rounded-xl border border-red-100 flex items-center justify-end space-x-2 animate-in zoom-in-95 duration-200 mb-3'>
                        <span>{error}</span>
                    </div>
                )}
                <button
                    form='register-form'
                    type='submit'
                    disabled={loading}
                    className='w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all text-xs uppercase tracking-widest shadow-lg shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center space-x-2'
                >
                    <span>{loading ? 'Registering...' : 'Register Now'}</span>
                    <ChevronRight size={18} />
                </button>
                <p className='text-slate-400 text-xs font-medium mt-4'>
                    Already have an account?{' '}
                    <button
                        onClick={handleToggleLogin}
                        className='text-sky-500 font-bold hover:underline ml-1'
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;
