import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Lock, Calendar as CalendarIcon, Clock as ClockIcon, Info } from 'lucide-react';
import useSlots from '../../hooks/useSlots';

const DateTimeStep = ({
    serviceId,
    selectedDate,
    selectedTime,
    onUpdate,
    onNext,
    onBack,
    serviceName,
    sessionId,
    slotHold,
}) => {
    const { activeHold, holdSlot, releaseHold, formattedTime, holdLoading, holdError } = slotHold;

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const MAX_BOOKING_DAYS_AHEAD = 90;
    const maxDate = useMemo(
        () => new Date(today.getTime() + MAX_BOOKING_DAYS_AHEAD * 24 * 60 * 60 * 1000),
        [today],
    );

    const [weekStart, setWeekStart] = useState(() => {
        const d = new Date(today);
        d.setDate(d.getDate() - d.getDay()); 
        return d;
    });

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            return d;
        });
    }, [weekStart]);

    const navigateWeek = (direction) => {
        setWeekStart((prev) => {
            const next = new Date(prev);
            next.setDate(next.getDate() + (direction === 'next' ? 7 : -7));

            if (direction === 'next' && next > maxDate) {
                return prev;
            }
            const nextWeekEnd = new Date(next);
            nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);

            if (direction === 'prev' && nextWeekEnd < today) {
                return prev;
            }

            return next;
        });
    };

    const formatDateKey = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const {
        slots,
        nextAvailableDate,
        loading: slotsLoading,
        refetch: refetchSlots,
    } = useSlots(selectedDate || null, serviceId || null, true, sessionId);

    const handleDateClick = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const key = formatDateKey(d);

        const newWeekStart = new Date(d);
        newWeekStart.setDate(d.getDate() - d.getDay());
        newWeekStart.setHours(0, 0, 0, 0);
        setWeekStart(newWeekStart);

        onUpdate({ date: key, time: '' });
    };

    const handleTimeClick = async (slotData) => {
        if (!serviceId || !selectedDate) return;

        const isCurrentlySelected = selectedTime === slotData.rawTime;

        if (isCurrentlySelected) {
            await releaseHold();
            onUpdate({ time: '' });
            return;
        }

        const holdResult = await holdSlot(serviceId, selectedDate, slotData.rawTime);

        if (holdResult?.success) {
            onUpdate({ time: slotData.rawTime });
        }
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const canGoPrev = weekStart > today;
    const canGoNext = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) <= maxDate;

    const formatHoldDateTime = () => {
        if (!activeHold) return '';
        const date = new Date(activeHold.date);
        const dayName = dayNames[date.getDay()];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        const [hours, minutes] = activeHold.time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const timeDisplay = `${displayHour}:${minutes} ${ampm}`;

        return `${dayName} ${monthName} ${day}, ${year} at ${timeDisplay}`;
    };

    return (
        <div>
            <div className='mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>Pick Date & Time</h2>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    Choose your preferred appointment date and available time slot.
                </p>
            </div>

            {/* Hold Status Indicator */}
            {activeHold && selectedDate === activeHold.date && (
                <div className='mb-6 p-4 bg-brand-50/50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 rounded-2xl'>
                    <div className='flex items-start gap-4'>
                        <div className='w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-theme-xs shrink-0'>
                            <Lock size={18} className='text-brand-500' />
                        </div>
                        <div className='grow'>
                            <p className='text-sm font-bold text-gray-900 dark:text-white'>
                                Slot Reserved
                            </p>
                            <p className='text-xs text-brand-600 dark:text-brand-400 font-medium mt-0.5'>
                                {formatHoldDateTime()}
                            </p>
                            <div className='flex items-center gap-2 mt-2'>
                                <div className='h-1 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                                    <div className='h-full bg-brand-500 animate-pulse' style={{ width: '60%' }} />
                                </div>
                                <span className='text-[10px] font-bold text-gray-500 whitespace-nowrap uppercase'>
                                    Expires in {formattedTime}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {holdError && (
                <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex gap-3'>
                    <Info size={18} className='text-red-500 shrink-0' />
                    <p className='text-sm text-red-700 dark:text-red-400 font-medium'>{holdError}</p>
                </div>
            )}

            {/* Week navigation */}
            <div className='flex items-center justify-between mb-6'>
                <h3 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <CalendarIcon size={16} className='text-brand-500' />
                    {weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <div className='flex gap-2'>
                    <button
                        onClick={() => navigateWeek('prev')}
                        disabled={!canGoPrev}
                        className='p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-30'
                    >
                        <ChevronLeft size={20} className='text-gray-600 dark:text-gray-400' />
                    </button>
                    <button
                        onClick={() => navigateWeek('next')}
                        disabled={!canGoNext}
                        className='p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-30'
                    >
                        <ChevronRight size={20} className='text-gray-600 dark:text-gray-400' />
                    </button>
                </div>
            </div>

            {/* Day buttons */}
            <div className='grid grid-cols-7 gap-2 mb-8'>
                {weekDays.map((date) => {
                    const key = formatDateKey(date);
                    const isPast = date < today;
                    const isSameDay = date.getTime() === today.getTime();
                    const isSelected = key === selectedDate;
                    const isSunday = date.getDay() === 0;
                    const isBeyondMax = date > maxDate;
                    const isDisabled = isPast || isSunday || isBeyondMax || isSameDay;

                    return (
                        <button
                            key={key}
                            onClick={() => !isDisabled && handleDateClick(date)}
                            disabled={isDisabled}
                            className={`flex flex-col items-center py-3 rounded-2xl text-[10px] sm:text-xs transition-all ${
                                isSelected
                                    ? 'bg-brand-500 text-white shadow-theme-md ring-4 ring-brand-500/10'
                                    : isDisabled
                                      ? 'bg-transparent text-gray-300 cursor-not-allowed opacity-50'
                                      : 'bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            <span className='font-bold uppercase tracking-wider mb-1'>{dayNames[date.getDay()]}</span>
                            <span className={`text-base sm:text-lg font-black ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                {date.getDate()}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Time slots */}
            {selectedDate && (
                <div className='mb-10'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                            <ClockIcon size={16} className='text-brand-500' />
                            Available Times
                        </h3>
                        <button
                            onClick={refetchSlots}
                            disabled={slotsLoading}
                            className='flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg border border-gray-100 dark:border-gray-700 transition-all disabled:opacity-50'
                        >
                            <RefreshCw size={14} className={slotsLoading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>

                    {slotsLoading ? (
                        <div className='flex flex-col items-center justify-center py-12 gap-3'>
                            <div className='w-6 h-6 border-2 border-gray-200 border-t-brand-500 rounded-full animate-spin' />
                            <p className='text-gray-400 text-xs font-medium'>Checking slots...</p>
                        </div>
                    ) : slots && slots.length > 0 ? (
                        <div className='grid grid-cols-2 xsm:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3'>
                            {slots.map((slot) => {
                                const isHeldByMe = activeHold?.time === slot.rawTime && selectedDate === activeHold.date;
                                const effectiveAvailable = slot.available + (isHeldByMe ? 1 : 0);
                                if (effectiveAvailable <= 0) return null;

                                const isSelected = selectedTime === slot.rawTime;

                                return (
                                    <button
                                        key={slot.rawTime}
                                        onClick={() => handleTimeClick(slot)}
                                        disabled={holdLoading}
                                        className={`py-3 rounded-2xl text-xs font-bold transition-all relative ${
                                            isSelected
                                                ? 'bg-brand-500 text-white shadow-theme-md ring-4 ring-brand-500/10'
                                                : isHeldByMe
                                                  ? 'bg-brand-50 dark:bg-brand-500/10 border-2 border-brand-200 text-brand-700 dark:text-brand-400'
                                                  : 'bg-gray-50 dark:bg-gray-900/50 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        {slot.displayTime}
                                        {isHeldByMe && <Lock size={10} className='absolute top-2 right-2' />}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className='p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl text-center border-2 border-dashed border-gray-200 dark:border-gray-700'>
                            <p className='text-gray-500 text-sm font-medium mb-1'>No slots available for this date.</p>
                            {nextAvailableDate && (
                                <button
                                    onClick={() => handleDateClick(new Date(nextAvailableDate))}
                                    className='text-brand-500 text-sm font-bold hover:underline'
                                >
                                    Try {new Date(nextAvailableDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Navigation */}
            <div className='flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-700'>
                <button
                    onClick={onBack}
                    className='text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold text-base px-8 py-3 transition-colors'
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!selectedDate || !selectedTime}
                    className='bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-theme-md disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-base'
                >
                    Review Details
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default DateTimeStep;
