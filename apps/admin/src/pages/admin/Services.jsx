import React, { useState, useMemo } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import { 
    Plus, Search, Clock, 
    ShieldCheck, ShieldAlert, 
    MoreVertical, Filter, Image as ImageIcon,
    Tag, PhilippinePeso, Upload, ChevronRight
} from 'lucide-react';
import { Input, Button, Modal, Label, Badge } from '../../components/ui';

// Applied Fitts's Law: Made the entire card a clickable target rather than a small button.
// Applied Hick's Law: Removed the extra "Edit" button to reduce visual clutter, replaced with hover context.
const ServiceCard = ({ service, onClick }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div 
            onClick={() => onClick(service)}
            role="button"
            tabIndex={0}
            className='group relative bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all duration-300 flex flex-col h-full text-left'
        >
            {/* Image Section */}
            <div className='relative h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0'>
                {service.image_url && !imgError ? (
                    <img 
                        src={service.image_url} 
                        alt={service.name} 
                        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className='flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800/80 w-full h-full'>
                        <ImageIcon size={48} strokeWidth={1} />
                        <span className='mt-2 text-[10px] font-black uppercase tracking-widest text-gray-400'>No Photo</span>
                    </div>
                )}
                
                {/* Tier Badge overlay */}
                <div className='absolute top-4 right-4 z-10'>
                    <Badge 
                        variant={service.tier === 'specialized' ? 'purple' : 'blue'}
                        className='backdrop-blur-md bg-white/90 dark:bg-gray-900/90 shadow-sm border-0'
                    >
                        {service.tier}
                    </Badge>
                </div>
                {/* Gradient Overlay for seamless text transition */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
            </div>

            {/* Content Section */}
            <div className='p-6 flex flex-col grow bg-white dark:bg-gray-900'>
                <div className='flex justify-between items-start gap-3 mb-4'>
                    <h4 className='text-base font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight font-outfit line-clamp-2'>
                        {service.name}
                    </h4>
                </div>

                <div className='space-y-4 mt-auto'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-1.5 text-brand-600 dark:text-brand-400'>
                            <PhilippinePeso size={16} strokeWidth={2.5} />
                            <span className='text-xl font-black font-outfit'>{service.cost}</span>
                        </div>
                        <div className='flex items-center justify-center min-w-[70px] h-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700'>
                            <Clock size={12} className='text-gray-400 mr-1.5' />
                            <span className='text-[11px] font-bold text-gray-600 dark:text-gray-300'>{service.duration}</span>
                        </div>
                    </div>

                    <div className='pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between h-10'>
                        <div className='flex items-center gap-1.5'>
                            {service.auto_approve ? (
                                <div className='flex items-center gap-1.5 text-[10px] font-black text-success-600 uppercase tracking-widest bg-success-50 dark:bg-success-500/10 px-2 py-1 rounded-md'>
                                    <ShieldCheck size={12} />
                                    <span>Auto-Approve</span>
                                </div>
                            ) : (
                                <div className='flex items-center gap-1.5 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md'>
                                    <ShieldAlert size={12} />
                                    <span>Approval Req.</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Jakob's Law / Zeigarnik Effect: Show clear progression state on hover */}
                        <div className='opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brand-500'>
                            Edit <ChevronRight size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Extracted Filters configuration
const FILTERS = [
    { id: 'all', label: 'All Services' },
    { id: 'general', label: 'General' },
    { id: 'specialized', label: 'Specialized' },
];

const PRESET_DURATIONS = ['15m', '30m', '1h', '1h 30m'];

const Services = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTier, setActiveTier] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(20);

    // Modal State
    const [modalDuration, setModalDuration] = useState('30m');
    const [modalIsCustomDuration, setModalIsCustomDuration] = useState(false);
    const [modalCustomDurationVal, setModalCustomDurationVal] = useState('');

    const handleDurationSelect = (val) => {
        setModalIsCustomDuration(false);
        setModalDuration(val);
    };

    const handleCustomDurationSelect = () => {
        setModalIsCustomDuration(true);
        setModalDuration('custom');
    };

    // Mock data generators
    const MOCK_SERVICES = useMemo(() => [
        { id: 1, name: 'Oral Prophylaxis (Cleaning)', tier: 'general', cost: '1500', duration: '45m', auto_approve: true, image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop' },
        { id: 2, name: 'Composite Restoration', tier: 'general', cost: '2000', duration: '1h', auto_approve: true, image_url: 'https://images.unsplash.com/photo-1606811841660-1b51e9dd2d95?w=800&h=600&fit=crop' },
        { id: 3, name: 'Root Canal Therapy', tier: 'specialized', cost: '8000', duration: '1h 30m', auto_approve: false, image_url: null },
        { id: 4, name: 'Orthodontic Braces', tier: 'specialized', cost: '45000', duration: '1h', auto_approve: false, image_url: null },
        { id: 5, name: 'Dental Implants', tier: 'specialized', cost: '60000', duration: '2h', auto_approve: false, image_url: null },
        { id: 6, name: 'Teeth Whitening', tier: 'general', cost: '12000', duration: '1h', auto_approve: true, image_url: null },
        { id: 7, name: 'Tooth Extraction', tier: 'general', cost: '1500', duration: '30m', auto_approve: true, image_url: null },
        { id: 8, name: 'Wisdom Tooth Surgery', tier: 'specialized', cost: '15000', duration: '1h 30m', auto_approve: false, image_url: null },
    ], []);

    const filteredServices = useMemo(() => {
        return MOCK_SERVICES.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTier = activeTier === 'all' || s.tier === activeTier;
            return matchesSearch && matchesTier;
        });
    }, [searchQuery, activeTier, MOCK_SERVICES]);

    const displayedServices = filteredServices.slice(0, visibleCount);

    return (
        <div className='flex flex-col h-full bg-gray-50/50 dark:bg-gray-900'>
            <div className="mb-4">
                <PageBreadcrumb pageTitle="Services Catalog" />
            </div>

            <div className='flex-grow flex flex-col bg-white dark:bg-white/[0.03] sm:rounded-2xl border-t sm:border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm'>
                {/* Toolbar */}
                <div className='px-4 sm:px-6 py-5 border-b border-gray-100 dark:border-gray-800 space-y-5 bg-white xl:sticky xl:top-0 z-20'>
                    <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                        <div className='relative flex-grow w-full'>
                            <span className='absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400'>
                                <Search size={18} />
                            </span>
                            <input
                                type='text'
                                placeholder='Search treatments by name...'
                                className='w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className='w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-600 transition-all active:scale-95 shrink-0 shadow-xl shadow-brand-500/20'
                        >
                            <Plus size={18} strokeWidth={3} />
                            <span>Add Service</span>
                        </button>
                    </div>

                    <div className='flex items-center gap-2 overflow-x-auto no-scrollbar pb-1'>
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveTier(filter.id)}
                                className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                                    activeTier === filter.id
                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md'
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className='grow p-4 sm:p-6 bg-gray-50/50 dark:bg-transparent min-h-[500px]'>
                    {displayedServices.length > 0 ? (
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                            {displayedServices.map(service => (
                                <ServiceCard 
                                    key={service.id} 
                                    service={service} 
                                    onClick={(service) => {
                                        // Load data into modal state (simplified for demo)
                                        setIsModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-24 text-center'>
                            <div className='w-24 h-24 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-sm'>
                                <Filter size={40} />
                            </div>
                            <h3 className='text-xl font-black text-gray-900 font-outfit uppercase tracking-tight'>No Treatments Found</h3>
                            <p className='text-sm text-gray-500 max-w-sm mt-2'>Try adjusting your search criteria or tier filters to locate the specific service.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Service Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:h-[650px] animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Left Side: Photo Management */}
                        <div className="w-full md:w-[280px] lg:w-[360px] bg-gray-50 border-r border-gray-100 p-8 flex flex-col relative shrink-0">
                            <div className="mt-10">
                                <h3 className='text-xl font-black text-gray-900 uppercase tracking-tight font-outfit mb-2'>Service Identity</h3>
                                <p className='text-xs text-gray-500 font-medium leading-relaxed mb-10'>Upload a primary image representing this treatment. This will be visible to patients.</p>
                                
                                <div className="aspect-square w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 transition-all hover:border-brand-400 hover:bg-brand-50/50 group cursor-pointer mb-6">
                                    <div className="w-16 h-16 bg-gray-50 group-hover:bg-brand-100 rounded-full flex items-center justify-center mb-4 transition-colors">
                                        <ImageIcon className="text-gray-400 group-hover:text-brand-500 transition-colors" size={28} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">Upload Photo</span>
                                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                                </div>
                                
                                <div className="space-y-2">
                                     <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>Or Use Image URL</Label>
                                     <Input placeholder="https://..." className="bg-white border-gray-200 text-xs focus:border-brand-500" />
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Form Details */}
                        <div className="w-full flex-grow p-8 md:p-10 overflow-y-auto bg-white flex flex-col relative">
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-gray-900 font-outfit uppercase tracking-tight">Configuration Details</h2>
                            </div>

                            <div className='space-y-6 flex-grow'>
                                {/* Identity Group */}
                                <div className='space-y-2'>
                                    <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>Treatment Name</Label>
                                    <Input placeholder='e.g., Premium Teeth Whitening' className='h-12 font-bold text-sm bg-gray-50 border-transparent focus:bg-white focus:border-brand-500 transition-all' />
                                </div>

                                <div className='space-y-2'>
                                    <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>Description & Details</Label>
                                    <textarea 
                                        className='w-full h-20 p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white border focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-sm font-medium outline-none transition-all resize-none'
                                        placeholder='Explain the treatment, prerequisites, or notes for the patient...'
                                    ></textarea>
                                </div>

                                {/* Law of Common Region: Grouping operational parameters inside an inset box */}
                                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 border-b border-gray-100 pb-3">Operational Parameters</h4>
                                    
                                    <div className='grid grid-cols-2 gap-6'>
                                        <div className='space-y-3'>
                                            <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>Category Tier</Label>
                                            <div className='flex gap-2 p-1 bg-gray-100 rounded-xl'>
                                                <button className='flex-1 h-10 rounded-lg bg-white shadow-sm text-brand-600 text-xs font-black uppercase tracking-widest transition-all'>General</button>
                                                <button className='flex-1 h-10 rounded-lg text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-gray-900 transition-all'>Specialized</button>
                                            </div>
                                        </div>
                                        <div className='space-y-3'>
                                            <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>Est. Cost (PHP)</Label>
                                            <div className='relative'>
                                                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black'>₱</span>
                                                <Input placeholder='0.00' className='h-12 pl-10 font-black text-gray-900 bg-white border-gray-200 focus:border-brand-500 shadow-sm' />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='space-y-3'>
                                        <Label className='text-[10px] font-black uppercase tracking-widest text-gray-400'>Standard Duration</Label>
                                        <div className='flex flex-wrap gap-2'>
                                            {PRESET_DURATIONS.map(dur => (
                                                <button
                                                    key={dur}
                                                    onClick={() => handleDurationSelect(dur)}
                                                    className={`px-5 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                        modalDuration === dur 
                                                            ? 'bg-gray-900 text-white shadow-md'
                                                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 shadow-sm'
                                                    }`}
                                                >
                                                    {dur}
                                                </button>
                                            ))}
                                            <button
                                                onClick={handleCustomDurationSelect}
                                                className={`px-5 h-10 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                    modalIsCustomDuration
                                                        ? 'bg-brand-50 border border-brand-200 text-brand-600'
                                                        : 'bg-white border border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50'
                                                }`}
                                            >
                                                Custom
                                            </button>
                                        </div>
                                        
                                        {modalIsCustomDuration && (
                                            <div className='flex items-center gap-3 mt-3 animate-in fade-in slide-in-from-top-1'>
                                                <Input 
                                                    value={modalCustomDurationVal}
                                                    onChange={(e) => setModalCustomDurationVal(e.target.value)}
                                                    placeholder='e.g., 2h 30m' 
                                                    className='h-10 max-w-[200px] bg-white border-brand-200 focus:border-brand-500 focus:ring-brand-500 font-bold shadow-sm' 
                                                    autoFocus
                                                />
                                                <span className='text-xs text-gray-400 font-medium'>Format: 1h, 30m, 2h 15m</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='pt-8 mt-6 border-t border-gray-100 flex items-center justify-end gap-3'>
                                <Button 
                                    variant='outline' 
                                    onClick={() => setIsModalOpen(false)}
                                    className='h-12 px-8 rounded-xl text-xs font-black uppercase tracking-widest border-gray-200 text-gray-600 hover:bg-gray-50'
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={() => setIsModalOpen(false)}
                                    className='h-12 px-10 rounded-xl bg-brand-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:bg-brand-600'
                                >
                                    Save Service
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
