import React, { useState, useMemo } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { Plus, Search, Filter } from 'lucide-react';
import { ServiceCard } from '../../components/services';
import { useServicesContext } from '../../context/ServicesContext';

// Extracted Filters configuration
const FILTERS = [
    { id: 'all', label: 'All Services' },
    { id: 'general', label: 'General' },
    { id: 'specialized', label: 'Specialized' },
];

const Services = () => {
    const { services, loading, error } = useServicesContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTier, setActiveTier] = useState('all');
    const [visibleCount, setVisibleCount] = useState(12);

    const filteredServices = useMemo(() => {
        return services.filter((s) => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTier = activeTier === 'all' || s.tier === activeTier;
            return matchesSearch && matchesTier;
        });
    }, [searchQuery, activeTier, services]);

    const displayedServices = filteredServices.slice(0, visibleCount);

    if (loading) return (
        <div className='flex items-center justify-center h-full'>
            <div className='animate-pulse text-gray-400 font-black uppercase tracking-widest text-xs'>
                Loading Catalog...
            </div>
        </div>
    );

    if (error) return (
        <div className='flex items-center justify-center h-full text-red-500'>
            Error: {error}
        </div>
    );

    return (
        <div className='flex flex-col h-full bg-gray-50/50 dark:bg-gray-900'>
            <div className='mb-4'>
                <PageBreadcrumb pageTitle='Services Catalog' />
            </div>

            <div className='flex flex-col grow overflow-hidden bg-white dark:bg-white/[0.02] sm:rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm'>
                {/* Header Section */}
                <div className='px-4 py-5 sm:px-6 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-transparent backdrop-blur-sm sticky top-0 z-10'>
                    <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
                        {/* Title & Stats */}
                        <div>
                            <h2 className='text-xl font-black text-gray-900 dark:text-white flex items-center gap-3 font-outfit uppercase tracking-tight'>
                                Clinic Services
                                <span className='px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-black'>
                                    {filteredServices.length} Total
                                </span>
                            </h2>
                            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1'>
                                Manage clinic service offerings and pricing
                            </p>
                        </div>

                        {/* Search & Actions */}
                        <div className='flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto'>
                            <div className='relative w-full sm:w-72'>
                                <Search
                                    className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400'
                                    size={16}
                                />
                                <input
                                    type='text'
                                    placeholder='Search services...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className='w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-brand-500/30 focus:ring-4 focus:ring-brand-500/10 rounded-xl text-sm font-medium transition-all outline-none'
                                />
                            </div>
                            <button className='w-full sm:w-auto h-11 px-6 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-[14px] font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-brand-500/20 uppercase tracking-widest'>
                                <Plus size={18} strokeWidth={3} />
                                Add Service
                            </button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className='flex items-center gap-2 mt-6 overflow-x-auto no-scrollbar pb-1'>
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveTier(filter.id)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${activeTier === filter.id
                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg'
                                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className='grow p-4 sm:p-6 bg-gray-50/50 dark:bg-transparent min-h-[500px] overflow-y-auto no-scrollbar'>
                    {displayedServices.length > 0 ? (
                        <>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                                {displayedServices.map((service) => (
                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                    />
                                ))}
                            </div>

                            {/* Load More Pagination */}
                            {visibleCount < filteredServices.length && (
                                <div className='mt-12 flex justify-center pb-8'>
                                    <button
                                        onClick={() => setVisibleCount((prev) => prev + 12)}
                                        className='flex items-center gap-2 px-8 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm active:scale-95'
                                    >
                                        Load More Services
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-24 text-center'>
                            <div className='w-24 h-24 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-sm'>
                                <Search size={40} />
                            </div>
                            <h3 className='text-lg font-black text-gray-900 dark:text-white font-outfit uppercase tracking-tight'>
                                No Services Found
                            </h3>
                            <p className='text-xs text-gray-400 mt-2 max-w-[280px] font-medium leading-relaxed'>
                                We couldn't find any treatment matches your current filter or search criteria.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Services;
