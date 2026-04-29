import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, GitMerge, UserPlus, Loader2, Search, Filter, Download, MoreVertical } from 'lucide-react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import PatientInbox from '../../components/admin/patients/PatientInbox';
import PatientRow from '../../components/admin/patients/PatientRow';
import PatientDetailView from '../../components/admin/patients/PatientDetailView';
import AddPatientModal from '../../components/admin/patients/AddPatientModal';
import MergePatientsModal from '../../components/admin/patients/MergePatientsModal';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const Patients = () => {
    const { tab, id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const activeTab = tab || 'profile';

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);

    const fetchPatients = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await api.get(`/admin/patients?search=${searchQuery}`, token);
            setPatients(data.patients || []);
        } catch (err) {
            console.error('Failed to fetch patients:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPatients();
        }, searchQuery ? 500 : 0);

        return () => clearTimeout(delayDebounceFn);
    }, [token, searchQuery]);

    const tabLabel = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    const breadcrumbTitle = id ? `Patient ${tabLabel}` : "Patient Registry";

    return (
        <div className='flex flex-col h-full'>
            <div className='flex items-center justify-between mb-4'>
                <PageBreadcrumb 
                    pageTitle={breadcrumbTitle} 
                    parentName={id ? "Patient Registry" : null}
                    parentPath={id ? "/patients" : null}
                />
                <div className='flex items-center gap-2'>
                    <button 
                        onClick={() => setIsMergeModalOpen(true)}
                        className='h-10 px-4 flex items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all'
                    >
                        <GitMerge size={16} />
                        <span className='hidden sm:inline'>Merge Records</span>
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className='h-10 px-4 flex items-center gap-2 bg-brand-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20'
                    >
                        <Plus size={18} />
                        <span className='hidden sm:inline'>Add New Patient</span>
                    </button>
                </div>
            </div>
            
            <div className='grow flex flex-col'>
                {id ? (
                    <PatientDetailView 
                        patientId={id}
                        activeTab={activeTab}
                        onBack={() => navigate('/patients')}
                    />
                ) : (
                    <div className='grow overflow-y-auto no-scrollbar'>
                        {loading ? (
                            <div className='flex items-center justify-center h-64'>
                                <Loader2
                                    className='animate-spin text-brand-500'
                                    size={40}
                                />
                            </div>
                        ) : (
                            <div className='p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                                {patients.map((patient) => (
                                    <PatientRow
                                        key={patient.id}
                                        patient={patient}
                                        onClick={() => navigate(`/patients/profile/${patient.id}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AddPatientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onPatientAdded={fetchPatients}
                token={token}
            />

            <MergePatientsModal 
                isOpen={isMergeModalOpen}
                onClose={() => setIsMergeModalOpen(false)}
                token={token}
                onMerged={() => {
                    console.log('Patients merged');
                    fetchPatients();
                }}
            />
        </div>
    );
};

export default Patients;
