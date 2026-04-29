import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import StaffInbox from '../../components/admin/staff/StaffInbox';
import StaffDetailView from '../../components/admin/staff/StaffDetailView';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const Staff = () => {
    const { tab, id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const activeTab = tab || 'profile';

    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        const fetchStaff = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const data = await api.get('/admin/users', token);
                // Filter out patients, show only system users
                const filtered = (data.users || []).filter(u => 
                    ['admin', 'secretary', 'receptionist', 'doctor'].includes(u.role)
                );
                setStaffMembers(filtered);
            } catch (err) {
                console.error('Failed to fetch staff:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, [token]);

    const tabLabel = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    const breadcrumbTitle = id ? `Staff ${tabLabel}` : "Staff & Reception";

    return (
        <div className='flex flex-col h-full'>
            <PageBreadcrumb
                pageTitle={breadcrumbTitle}
                parentName={id ? "Staff & Reception" : null}
                parentPath={id ? "/staff" : null}
                className='mb-4'
            />

            <div className='grow flex flex-col'>
                {id ? (
                    <StaffDetailView
                        id={id}
                        activeTab={activeTab}
                        onBack={() => navigate('/staff')}
                    />
                ) : (
                    <StaffInbox
                        staffMembers={staffMembers}
                        loading={loading}
                        error={error}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        activeTab={activeTab}
                        onAddClick={() => console.log('Add Staff Member clicked')}
                        onStaffClick={(staffId) => navigate(`/staff/${activeTab}/${staffId}`)}
                    />
                )}
            </div>
        </div>
    );
};

export default Staff;
