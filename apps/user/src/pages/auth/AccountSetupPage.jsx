import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Key, ShieldCheck, Calendar, Phone, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../utils/api';
import AuthLayout from '../../layouts/AuthLayout';

const AccountSetupPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setError('Invalid or missing setup token.');
                setLoading(false);
                return;
            }
            try {
                const data = await api.get(`/auth/setup/verify?token=${token}`);
                setProfile(data.profile);
                setIsValid(true);
            } catch (err) {
                setError(err.message || 'The setup link has expired or is invalid.');
            } finally {
                setLoading(false);
            }
        };
        verifyToken();
    }, [token]);

    const handleSetup = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!dob && !phone) {
            setError('Please provide your date of birth or phone number for verification.');
            return;
        }

        setVerifying(true);
        setError(null);
        try {
            await api.post('/auth/setup/complete', {
                token,
                password,
                date_of_birth: dob,
                phone
            });
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <AuthLayout>
                <div className="flex flex-col items-center justify-center p-12">
                    <Loader2 className="animate-spin text-brand-500 mb-4" size={40} />
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Verifying Link...</p>
                </div>
            </AuthLayout>
        );
    }

    if (success) {
        return (
            <AuthLayout>
                <div className="w-full max-w-md mx-auto p-6 text-center space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto">
                        <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Ready!</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Your password has been set and your profile is now linked. You can now access all portal features.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/20"
                    >
                        Log In to Your Account
                    </button>
                </div>
            </AuthLayout>
        );
    }

    if (!isValid) {
        return (
            <AuthLayout>
                <div className="w-full max-w-md mx-auto p-6 text-center space-y-6">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                        <AlertCircle size={32} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invalid Setup Link</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {error || 'This link has already been used or has expired. Please contact the clinic for a new invitation.'}
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-sm font-bold text-brand-500 hover:underline"
                    >
                        Back to Login
                    </button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <div className="w-full max-w-md mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-500 mx-auto mb-4">
                        <Key size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Set Up Your Account</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Welcome, <span className="text-brand-500 font-bold">{profile?.full_name}</span>! Let's finish setting up your portal access.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSetup} className="space-y-6">
                    {/* Identity Verification Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} /> Identity Verification
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                                    Date of Birth
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="relative flex items-center py-1">
                                <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                                <span className="flex-shrink mx-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">OR</span>
                                <div className="flex-grow border-t border-gray-100 dark:border-gray-800"></div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <input 
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+63 9XX XXX XXXX"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Key size={14} /> Security
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                                    Create Password
                                </label>
                                <input 
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                                    Confirm Password
                                </label>
                                <input 
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit"
                            disabled={verifying}
                            className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-xl shadow-brand-500/20"
                        >
                            {verifying ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                            <span>Complete Account Setup</span>
                        </button>
                    </div>
                </form>

                <p className="text-[10px] text-gray-400 text-center uppercase tracking-tighter leading-relaxed">
                    By completing this setup, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </AuthLayout>
    );
};

export default AccountSetupPage;
