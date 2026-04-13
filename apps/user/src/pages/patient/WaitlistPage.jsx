import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import WaitlistOfferCard from '../../components/patient/waitlist/WaitlistOfferCard';
import WaitlistEmptyState from '../../components/patient/waitlist/WaitlistEmptyState';
import WaitlistTable from '../../components/patient/waitlist/WaitlistTable';
import ClaimSlotModal from '../../components/patient/waitlist/ClaimSlotModal';
import useWaitlist from '../../hooks/useWaitlist';
import { Loader2 } from 'lucide-react';

const FILTERS = ['All', 'Waiting', 'Offered', 'Confirmed', 'Expired', 'Cancelled'];

const WaitlistPage = () => {
    const { entries, offers, loading, error, cancel, confirmOffer } = useWaitlist();
    const [activeFilter, setActiveFilter] = useState('All');
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

    // options: { removeBackup: boolean } — forwarded from WaitlistCancelModal
    const handleCancelEntry = async (id, options = {}) => {
        try {
            await cancel(id, options);
        } catch (err) {
            console.error('Failed to cancel entry:', err);
        }
    };

    if (loading && entries.length === 0) {
        return (
            <div className='flex items-center justify-center grow py-20'>
                <Loader2 className='w-8 h-8 text-brand-500 animate-spin' />
            </div>
        );
    }

    return (
        <>
            <PageBreadcrumb pageTitle='Waitlist' />
            
            <div className='space-y-8'>
                {error && (
                    <div className='p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100'>
                        {error}
                    </div>
                )}

                {/* Empty State Card - Always on top when no active entries */}
                {entries.length === 0 && !loading && (
                    <WaitlistEmptyState />
                )}

                {/* Active Offers Section */}
                {offers.length > 0 && (
                    <div className='grid gap-6'>
                        {offers.map(offer => (
                            <WaitlistOfferCard 
                                key={offer.id} 
                                offer={offer} 
                                onClaim={() => handleClaimClick(offer)} 
                            />
                        ))}
                    </div>
                )}

                {/* List section - Always visible */}
                <div className='space-y-6'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                        <div>
                            <h3 className='text-lg font-bold text-gray-800 dark:text-white font-outfit uppercase tracking-tight'>
                                Waitlist Requests
                            </h3>
                            <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
                                View and manage your requests for earlier slots.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className='flex bg-gray-100 dark:bg-white/[0.05] p-1.5 rounded-[1rem] w-max border border-gray-200/50 dark:border-white/5'>
                            {FILTERS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-4 py-2 text-[10px] font-black rounded-[0.75rem] transition-all uppercase tracking-widest ${
                                        activeFilter === f 
                                        ? 'bg-white dark:bg-gray-800 text-brand-500 shadow-sm' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <WaitlistTable 
                        data={entries}
                        activeFilter={activeFilter} 
                        onClaim={handleClaimClick}
                        onCancel={handleCancelEntry}
                    />
                </div>
            </div>

            <ClaimSlotModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                slot={selectedSlot}
                onConfirm={handleConfirmClaim}
                loading={loading}
            />
        </>
    );
};

export default WaitlistPage;
