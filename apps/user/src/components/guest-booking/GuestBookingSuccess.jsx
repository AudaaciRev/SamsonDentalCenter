import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Loader2, MailWarning, Clock, Hash, ShieldCheck, ArrowRight } from 'lucide-react';

const GuestBookingSuccess = ({ result, onReset, booking }) => {
    const navigate = useNavigate();
    const [resending, setResending] = useState(false);
    const [resendStatus, setResendStatus] = useState(null);
    const [cooldown, setCooldown] = useState(0);
    const [password, setPassword] = useState('');
    const [upgrading, setUpgrading] = useState(false);
    const [upgradeResult, setUpgradeResult] = useState(null);
    const [upgradeError, setUpgradeError] = useState(null);

    // Countdown effect for the resend button
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    // Auto-scroll to top when success screen mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleResend = async () => {
        if (!booking?.resendVerification || cooldown > 0) return;
        setResending(true);
        setResendStatus(null);
        
        const res = await booking.resendVerification(
            result.appointment.id,
            result.appointment.guest_email || booking.formData.email
        );
        
        setResending(false);
        
        if (res?.success) {
            setResendStatus({ success: true, message: "Verification email resent!" });
            setCooldown(300); // 5 minutes block
        } else {
            setResendStatus(res);
        }
        
        // Remove status message after 10 seconds to keep UI clean
        setTimeout(() => setResendStatus(null), 10000);
    };

    const handleUpgrade = async (e) => {
        e.preventDefault();
        setUpgrading(true);
        setUpgradeError(null);
        
        try {
            const res = await booking.upgradeToUser(password);
            if (res.success) {
                setUpgradeResult(true);
            } else {
                setUpgradeError(res.message);
            }
        } catch (err) {
            setUpgradeError("An unexpected error occurred.");
        } finally {
            setUpgrading(false);
        }
    };

    return (
        <div className="w-full max-w-[500px] mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[28px] p-5 sm:p-8 shadow-theme-lg overflow-hidden relative">
                {/* Decorative Top Border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600"></div>

                {/* Header Section */}
                <div className='mb-5 sm:mb-6 text-center'>
                    <div className='w-12 h-12 sm:w-16 sm:h-16 bg-brand-50 dark:bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-brand-100 dark:border-brand-500/20 shadow-inner'>
                        <CheckCircle className='w-6 h-6 sm:w-8 sm:h-8 text-brand-500' />
                    </div>
                    <h2 className='text-lg sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-1.5 sm:mb-2'>
                        Request Submitted
                    </h2>
                    <p className='text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium px-2 sm:px-4'>
                        Your booking has been recorded. Follow the instructions to finalize.
                    </p>
                </div>

                {/* Success Alert Banner (Verified) */}
                <div className='bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 text-left'>
                    <div className="flex gap-3 sm:gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="grow">
                            <h4 className="text-[12px] sm:text-[14px] font-black text-gray-900 dark:text-white uppercase tracking-wide">Verification Successful!</h4>
                            <p className='text-[11px] sm:text-[13px] text-gray-600 dark:text-gray-400 font-medium'>
                                Your email is verified. Our team will review your request shortly.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- Frictionless Account Creation --- */}
                {!upgradeResult ? (
                    <div className='bg-brand-500 rounded-3xl p-6 sm:p-8 mb-6 text-white shadow-theme-xl relative overflow-hidden group'>
                        {/* Decorative Background Icon */}
                        <Mail className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
                        
                        <div className="relative z-10">
                            <h3 className="text-xl sm:text-2xl font-black mb-2 uppercase tracking-tight">Access your records anytime</h3>
                            <p className="text-brand-50 text-[13px] sm:text-[14px] font-medium leading-relaxed mb-6 opacity-90">
                                Since you've already verified your email, just set a password to create your account and skip these steps next time!
                            </p>
                            
                            <form onSubmit={handleUpgrade} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-100 ml-1">Set Password</label>
                                    <input 
                                        type="password"
                                        placeholder="Minimum 6 characters"
                                        className="w-full bg-white/10 border border-white/20 focus:border-white/40 focus:ring-4 focus:ring-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/40 outline-none transition-all font-bold"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={upgrading || !password || password.length < 6}
                                    className="w-full bg-white text-brand-600 font-black py-4 rounded-2xl hover:bg-brand-50 active:scale-95 transition-all shadow-theme-lg disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                                >
                                    {upgrading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>Create My Account <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>
                            {upgradeError && <p className="mt-4 text-[11px] font-bold text-red-100 uppercase tracking-wide bg-red-500/20 p-3 rounded-xl border border-red-500/30">{upgradeError}</p>}
                        </div>
                    </div>
                ) : (
                    <div className='bg-emerald-500 rounded-3xl p-6 sm:p-8 mb-6 text-white shadow-theme-xl animate-in zoom-in-95 duration-500'>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Account Created!</h3>
                            <p className="text-emerald-50 text-sm font-medium opacity-90 mb-6">
                                Welcome to PrimeraDental! You've been automatically logged in.
                            </p>
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="bg-white text-emerald-600 font-black px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-all uppercase tracking-widest text-[13px]"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                )}

                {/* Navigation Footer */}
                <div className='flex flex-row items-center justify-between gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700/50'>
                    <button
                        onClick={() => navigate('/')}
                        className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-black text-[10px] sm:text-[13px] px-3 py-2 sm:px-6 sm:py-3 transition-colors uppercase tracking-widest'
                    >
                        Home
                    </button>
                    <button
                        onClick={onReset}
                        className='bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black px-4 py-2 sm:px-6 sm:py-3 rounded-xl transition-all shadow-theme-sm sm:shadow-theme-md text-[10px] sm:text-[13px] uppercase tracking-widest'
                    >
                        Book Another
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuestBookingSuccess;
