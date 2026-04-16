import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import DashboardStats from '../../components/patient/dashboard/DashboardStats';
import DashboardNotifications from '../../components/patient/dashboard/DashboardNotifications';
import DashboardAppointments from '../../components/patient/dashboard/DashboardAppointments';
import WaitlistOfferCard from '../../components/patient/waitlist/WaitlistOfferCard';
import ClaimSlotModal from '../../components/patient/waitlist/ClaimSlotModal';
import useWaitlist from '../../hooks/useWaitlist';
import { useAppointmentState } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';
import ErrorState from '../../components/common/ErrorState';

const PatientDashboard = () => {
    const { user } = useAuth();
    const { entries, offers, loading: waitlistLoading, error: waitlistError, confirmOffer } = useWaitlist();
    const { appointments, total: totalAppointments, loading: apptsLoading, error: apptsError } = useAppointmentState();
    const error = waitlistError || apptsError;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleClaimClick = (slot) => {
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    const handleConfirmClaim = async (id) => {
        try {
            await confirmOffer(id);
            setIsModalOpen(false);
            setSelectedSlot(null);
        } catch (err) {
            console.error('Failed to confirm offer:', err);
        }
    };

    const fullName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Guest';

    return (
        <>
            <PageBreadcrumb pageTitle='Dashboard' />
            
            <div className='space-y-4 sm:space-y-6'>
                {error ? (
                    <ErrorState 
                        error={error} 
                        onRetry={() => window.location.reload()} 
                        title="Unable to load Dashboard"
                    />
                ) : (
                    <>
                        {/* Active Waitlist Offers */}
                        {offers.length > 0 && (
                            <div className='space-y-3 sm:space-y-4'>
                                {offers.map(offer => (
                                    <WaitlistOfferCard 
                                        key={offer.id} 
                                        offer={offer} 
                                        onClaim={() => handleClaimClick(offer)} 
                                    />
                                ))}
                            </div>
                        )}

                        {/* Welcome Section */}
                        <div className='relative overflow-hidden rounded-none sm:rounded-2xl border border-gray-200 bg-white px-5 py-6 sm:p-8 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-sm transition-all duration-300'>
                            {/* Decorative Background Pattern */}
                            <div className='absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none' />
                            
                            <div className='relative flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                                <div className='space-y-1 sm:space-y-2'>
                                    <h2 className='text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight leading-none'>
                                        Welcome back, <span className='text-brand-500'>{fullName}!</span>
                                    </h2>
                                    <p className='text-xs sm:text-sm lg:text-base text-gray-500 dark:text-gray-400 font-medium max-w-[480px]'>
                                        Your dental journey continues here. Here's an overview of your oral health and upcoming appointments.
                                    </p>
                                </div>
                                
                                {/* Portal Status Indicator */}
                                <div className='flex items-center gap-2.5 px-4 py-2 bg-brand-50 dark:bg-brand-500/10 rounded-xl border border-brand-100 dark:border-brand-500/20 w-fit shrink-0'>
                                    <span className='relative flex h-2 w-2'>
                                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75'></span>
                                        <span className='relative inline-flex rounded-full h-2 w-2 bg-brand-500'></span>
                                    </span>
                                    <span className='text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-400'>
                                        Portal Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <DashboardStats 
                            entries={entries} 
                            appointments={appointments}
                            totalAppointments={totalAppointments}
                            loading={waitlistLoading || apptsLoading}
                        />

                        {/* Row 3: Appointments (2 card widths) + Notifications (1 card width)
                            Uses a 3-col grid to match the stat-cards above */}
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                            {/* Appointments — 2/3 width */}
                            <div className='sm:col-span-2'>
                                <DashboardAppointments />
                            </div>

                            {/* Notifications — 1/3 width */}
                            <div className='sm:col-span-1'>
                                <DashboardNotifications />
                            </div>
                        </div>
                    </>
                )}
            </div>

            <ClaimSlotModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                slot={selectedSlot}
                onConfirm={handleConfirmClaim}
                loading={waitlistLoading}
            />
        </>
    );
};

export default PatientDashboard;
