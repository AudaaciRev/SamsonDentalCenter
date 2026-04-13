import React, { useState, useEffect } from 'react';
import { Timer, ArrowRight, Sparkles } from 'lucide-react';

const WaitlistOfferCard = ({ offer, onClaim }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (!offer?.offer_expires_at) return;

        const calculateTimeLeft = () => {
            const difference = new Date(offer.offer_expires_at) - new Date();
            if (difference > 0) {
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
            return '00:00';
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            const time = calculateTimeLeft();
            setTimeLeft(time);
            if (time === '00:00') clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [offer?.offer_expires_at]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${minutes} ${ampm}`;
    };

    if (!offer || timeLeft === '00:00') return null;

    return (
        <div className='relative overflow-hidden rounded-[2.5rem] border border-brand-100 bg-brand-50/50 p-6 sm:p-8 dark:border-brand-500/20 dark:bg-brand-500/5 shadow-theme-sm animate-in fade-in slide-in-from-top-4 duration-700'>
            {/* Background Decoration */}
            <div className='absolute -right-4 -top-4 text-brand-500/10 pointer-events-none'>
                <Sparkles size={160} />
            </div>

            <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8'>
                <div className='space-y-4'>
                    <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest'>
                        <Sparkles size={12} className='animate-pulse' />
                        New Slot Available!
                    </div>
                    
                    <div>
                        <h2 className='text-2xl sm:text-3xl font-black text-gray-900 dark:text-white/90 font-outfit uppercase tracking-tight mb-2'>
                            {formatDate(offer.preferred_date)} at {formatTime(offer.preferred_time)}
                        </h2>
                        
                        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed font-medium'>
                            A slot for <strong>{offer.service_name}</strong> has opened up. Claim it now to move your appointment earlier!
                        </p>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row items-center gap-4'>
                    {/* Timer Section */}
                    <div className='flex items-center gap-4 px-6 py-3 bg-white dark:bg-gray-800 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shadow-sm'>
                        <Timer size={20} className='text-brand-500 animate-pulse' />
                        <div className='flex flex-col min-w-[60px]'>
                            <span className='text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1'>Expires in</span>
                            <span className='text-lg font-mono font-black text-slate-900 dark:text-white tabular-nums'>{timeLeft || '--:--'}</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={onClaim}
                        className='inline-flex items-center justify-center gap-3 px-10 py-4.5 bg-brand-500 text-white font-black text-xs uppercase tracking-widest rounded-[1.5rem] hover:bg-brand-600 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-500/20 w-full sm:w-auto'
                    >
                        Claim This Slot <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WaitlistOfferCard;
