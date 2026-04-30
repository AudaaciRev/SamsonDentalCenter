import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, Phone, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';

const ClaimProfilePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyAndLinkStub } = useAuth();
    
    // Get passed data from RegisterPage
    const { email, password, profile_id } = location.state || {};
    
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Redirect if no state (direct access)
    useEffect(() => {
        if (!email || !profile_id) {
            navigate('/register');
        }
    }, [email, profile_id, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await verifyAndLinkStub({
                email,
                password,
                date_of_birth: dob,
                phone,
                profile_id
            });
            navigate('/patient/book');
        } catch (err) {
            setError(err.message || 'Verification failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-md mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-500 mx-auto mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Identity</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        We found an existing profile with your email. Please provide your birth date or phone number to link it.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="space-y-4">
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

                        <div className="relative flex items-center py-2">
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

                    <div className="pt-2 space-y-4">
                        <button 
                            type="submit"
                            disabled={loading || (!dob && !phone)}
                            className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-xl shadow-brand-500/20"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                            <span>Link Account</span>
                        </button>

                        <button 
                            type="button"
                            onClick={() => navigate('/register')}
                            className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                        >
                            <ArrowLeft size={14} />
                            <span>Use a different email</span>
                        </button>
                    </div>
                </form>

                <div className="pt-4 text-center">
                    <p className="text-[10px] text-gray-400 leading-relaxed max-w-[280px] mx-auto uppercase tracking-tighter font-medium">
                        Verification is required to ensure that you are the rightful owner of the existing medical records linked to this email.
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
};

export default ClaimProfilePage;
