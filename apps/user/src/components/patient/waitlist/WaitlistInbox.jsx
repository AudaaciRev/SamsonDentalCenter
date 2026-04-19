import React, { useState, useEffect } from 'react';
import { Search, Mail, Clock, CheckCircle2, AlertCircle, Inbox } from 'lucide-react';
import WaitlistRow from './WaitlistRow';
import WaitlistSkeleton from './WaitlistSkeleton';

const CATEGORIES = [
    { id: 'All', label: 'All', icon: Inbox },
    { id: 'WAITING', label: 'Waiting', icon: Clock },
    { id: 'OFFER_PENDING', label: 'Offered', icon: AlertCircle },
    { id: 'CONFIRMED', label: 'Claimed', icon: CheckCircle2 },
];

const WaitlistInbox = ({ 
    entries, 
    activeFilter, 
    onFilterChange, 
    searchQuery, 
    onSearchChange,
    onEntryClick,
    selectedId,
    loading
}) => {
    const [localQuery, setLocalQuery] = useState(searchQuery);

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [localQuery, onSearchChange]);
    return (
        <div className='flex-grow flex flex-col h-full bg-white dark:bg-white/[0.03] sm:rounded-xl border-t sm:border border-gray-100 dark:border-gray-800 overflow-hidden'>
            {/* Header / Search Area */}
            <div className='px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-4'>
                <div className='relative'>
                    <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400'>
                        <Search size={18} />
                    </span>
                    <input 
                        type='text' 
                        placeholder='Search waitlist...'
                        className='w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border-none rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none'
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div className='flex items-center gap-2 overflow-x-auto no-scrollbar'>
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeFilter === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onFilterChange(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                                    isActive 
                                    ? 'bg-brand-500 text-white' 
                                    : 'bg-gray-100 dark:bg-white/[0.05] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/[0.1]'
                                }`}
                            >
                                <Icon size={14} />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* List Area */}
            <div className='flex flex-col grow min-h-[400px] md:min-h-[285px] overflow-y-auto pb-14 sm:pb-0'>
                {loading && entries.length === 0 ? (
                    <WaitlistSkeleton rows={3} />
                ) : entries.length > 0 ? (
                    entries.map((item) => (
                        <WaitlistRow 
                            key={item.id} 
                            item={item} 
                            isActive={selectedId === item.id}
                            onClick={onEntryClick}
                        />
                    ))
                ) : (
                    <div className='flex flex-col items-center justify-center py-20 text-center'>
                        <div className='w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4'>
                            <Clock size={32} />
                        </div>
                        <h4 className='text-lg font-bold text-gray-800 dark:text-white mb-1'>No requests found</h4>
                        <p className='text-sm text-gray-500'>Try adjusting your filters or search.</p>
                    </div>
                )}
            </div>
            
            {/* Footer */}
            <div className='fixed bottom-0 left-0 right-0 sm:relative z-30 bg-white/90 dark:bg-gray-900/95 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between sm:shadow-none'>
                <div className='flex flex-row items-center justify-between w-full gap-2 sm:gap-0'>
                    <div className='w-auto sm:w-1/3 text-left'>
                        <span className='text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap'>
                            Showing {entries.length} requests
                        </span>
                    </div>
                    <div className='flex items-center justify-end sm:justify-center w-auto sm:w-1/3'>
                        <div className='flex items-center gap-1 justify-center shrink-0'>
                            <button className='w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg transition-colors bg-brand-500 text-white'>
                                1
                            </button>
                        </div>
                    </div>
                    <div className='hidden sm:block sm:w-1/3'></div>
                </div>
            </div>
        </div>
    );
};

export default WaitlistInbox;
