import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, CheckCircle2, UserCheck, Users, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../../utils/api';

const AddPatientModal = ({ isOpen, onClose, onPatientAdded, token }) => {
    const [step, setStep] = useState('form'); // 'form' | 'duplicates' | 'success'
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        suffix: '',
        email: '',
        phone: '',
        date_of_birth: '',
    });
    const [duplicates, setDuplicates] = useState([]);
    const [error, setError] = useState(null);
    const [createdPatient, setCreatedPatient] = useState(null);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleCheckDuplicates = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.first_name || !formData.last_name) {
                throw new Error('First and Last names are required.');
            }

            const query = new URLSearchParams({
                first_name: formData.first_name,
                last_name: formData.last_name,
                date_of_birth: formData.date_of_birth,
                phone: formData.phone,
                email: formData.email,
            }).toString();

            const response = await api.get(`/admin/patients/check-duplicates?${query}`, token);
            
            if (response.duplicates && response.duplicates.length > 0) {
                setDuplicates(response.duplicates);
                setStep('duplicates');
            } else {
                await handleCreatePatient();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePatient = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/admin/walk-in/quick', formData, token);
            setCreatedPatient(response.patient);
            setStep('success');
            if (onPatientAdded) onPatientAdded(response.patient);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setStep('form');
        setFormData({
            first_name: '',
            last_name: '',
            middle_name: '',
            suffix: '',
            email: '',
            phone: '',
            date_of_birth: '',
        });
        setDuplicates([]);
        setError(null);
        setCreatedPatient(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Register Walk-In Patient</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Create a stub profile for immediate booking</p>
                        </div>
                    </div>
                    <button onClick={resetAndClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm font-medium">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    {step === 'form' && (
                        <form onSubmit={handleCheckDuplicates} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">First Name</label>
                                    <input 
                                        required
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Juan"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Last Name</label>
                                    <input 
                                        required
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Dela Cruz"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Middle Name</label>
                                    <input 
                                        name="middle_name"
                                        value={formData.middle_name}
                                        onChange={handleInputChange}
                                        placeholder="Optional"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Suffix</label>
                                    <input 
                                        name="suffix"
                                        value={formData.suffix}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Jr."
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Date of Birth</label>
                                <input 
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                                <input 
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="patient@example.com"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                />
                                <p className="text-[10px] text-gray-400 ml-1 italic">Providing an email allows the patient to link their account later.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                                <input 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+63 9XX XXX XXXX"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                                />
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                                    <span>Continue to Verification</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'duplicates' && (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-500 mb-4 animate-bounce">
                                    <AlertCircle size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Potential Duplicates Found</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                                    {duplicates.length} existing record(s) match this patient's details.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {duplicates.map((dup) => (
                                    <div key={dup.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold uppercase">
                                                {dup.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-1">{dup.full_name}</p>
                                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">
                                                    {dup.email || 'No email'} â€¢ {dup.phone || 'No phone'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => window.open(`/patients/profile/${dup.id}`, '_blank')}
                                                className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-500/10 rounded-lg transition-all"
                                                title="View Profile"
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                            {dup.role === 'patient' && (
                                                <span className="text-[10px] px-2 py-1 bg-brand-500/10 text-brand-500 rounded font-bold">MATCH</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button 
                                    onClick={() => setStep('form')}
                                    className="py-3.5 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                                >
                                    Go Back & Edit
                                </button>
                                <button 
                                    onClick={handleCreatePatient}
                                    disabled={loading}
                                    className="py-3.5 bg-brand-500 text-white rounded-xl font-bold text-sm hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                                    <span>Create Anyway</span>
                                </button>
                            </div>
                            
                            <div className="text-center">
                                <button className="text-xs font-bold text-brand-500 hover:underline">Link as Dependent to Existing Account?</button>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="py-8 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-500 mb-6 scale-110">
                                <CheckCircle2 size={40} />
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Patient Registered!</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-8">
                                Stub profile created successfully for <span className="font-bold text-gray-900 dark:text-white">{createdPatient?.full_name}</span>.
                            </p>
                            
                            <div className="w-full space-y-3">
                                <button 
                                    onClick={() => {
                                        window.location.href = `/patients/profile/${createdPatient?.id}`;
                                        resetAndClose();
                                    }}
                                    className="w-full py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <UserCheck size={20} />
                                    <span>Go to Profile</span>
                                </button>
                                <button 
                                    onClick={resetAndClose}
                                    className="w-full py-4 text-gray-500 font-bold hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddPatientModal;
