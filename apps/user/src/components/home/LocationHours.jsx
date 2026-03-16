import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LocationHours = ({ variant = 'light' }) => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const isDark = variant === 'dark';

    // GSAP Animations
    useEffect(() => {
        let ctx = gsap.context(() => {
            // Heading masked reveal
            gsap.from('.location-reveal-text', {
                y: '100%',
                duration: 1.2,
                stagger: 0.15,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: headingRef.current,
                    start: 'top 85%',
                    once: true,
                },
            });

            // Items Reveal
            gsap.from('.location-reveal-items', {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    once: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={`py-16 sm:py-24 lg:py-32 relative overflow-hidden transition-colors duration-500 z-0 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            {/* Minimal Background Gradients */}
            <div className={`location-reveal-items absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[80px] -mr-64 -mt-64 pointer-events-none ${isDark ? 'bg-blue-600/10' : 'bg-blue-600/5'}`}></div>
            <div className={`location-reveal-items absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[80px] -ml-64 -mb-64 pointer-events-none ${isDark ? 'bg-blue-400/10' : 'bg-blue-400/5'}`}></div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                <div className='flex flex-col lg:flex-row gap-12 lg:gap-20 items-center'>
                    
                    {/* Content Left */}
                    <div ref={headingRef} className='w-full lg:w-1/2 flex flex-col'>
                        <div className='overflow-hidden mb-6'>
                            <div className='location-reveal-text flex items-center gap-3'>
                                <span className='h-px w-8 bg-blue-600'></span>
                                <span className='tracking-wider font-semibold text-blue-600 text-[10px] uppercase tracking-[0.2em]'>
                                    Contact & Hours
                                </span>
                            </div>
                        </div>
                        
                        <h2 className={`text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight mb-8 sm:mb-12 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <div className='overflow-hidden'>
                                <span className='block location-reveal-text'>Visit Our</span>
                            </div>
                            <div className='overflow-hidden'>
                                <span className='block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 location-reveal-text'>Clinical Space.</span>
                            </div>
                        </h2>

                        <div className='location-reveal-items flex flex-col sm:flex-row gap-10 sm:gap-16'>
                            {/* Hours List */}
                            <div className='flex-1'>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]'></div>
                                    <h3 className='text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]'>Operating Hours</h3>
                                </div>
                                <ul className='space-y-5'>
                                    {[
                                        { day: 'Mon — Fri', time: '9:00 AM — 6:00 PM' },
                                        { day: 'Saturday', time: '8:00 AM — 5:00 PM' }
                                    ].map((item, idx) => (
                                        <li key={idx} className={`flex justify-between items-end border-b pb-3 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                            <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.day}</span>
                                            <span className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.time}</span>
                                        </li>
                                    ))}
                                    <li className='flex justify-between items-end pb-3'>
                                        <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sunday</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${isDark ? 'text-blue-400 bg-blue-600/10 border border-blue-500/20' : 'text-blue-600 bg-blue-50 border border-blue-100'}`}>By Appointment</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Location Details */}
                            <div className='flex-1'>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='w-2 h-2 rounded-full bg-slate-300'></div>
                                    <h3 className='text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]'>Our Location</h3>
                                </div>
                                <div className='space-y-3 mb-10'>
                                    <p className={`text-xl sm:text-2xl font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        7 Himalayan Road, <br />
                                        Tandang Sora
                                    </p>
                                    <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                        Quezon City, Metro Manila. <br className="hidden sm:block"/>
                                        Accessible via Commonwealth Ave.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className='group flex items-center gap-3 text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors duration-300'
                                >
                                    Get Directions
                                    <div className='w-8 h-8 rounded-full border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300'>
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M13 7l5 5m0 0l-5 5m5-5H6'/></svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Right: Compact Map */}
                    <div className='w-full lg:w-1/2 location-reveal-items'>
                        <div className={`relative w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all duration-500 group hover:shadow-blue-500/5 ${isDark ? 'border-white/5' : 'border-slate-200/50 shadow-slate-200/50'}`}>
                            <iframe
                                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.953843794345!2d121.0466!3d14.6735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b0a561055555%3A0x1234567890abcdef!2sTandang%20Sora%20Ave%2C%20Quezon%20City%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1620000000000!5m2!1sen!2sph'
                                width='100%'
                                height='100%'
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading='lazy'
                                className={`absolute inset-0 w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 ease-in-out ${isDark ? 'opacity-70 invert contrast-[90%] brightness-[80%]' : ''}`}
                            ></iframe>
                            
                            <div className={`absolute bottom-6 left-6 right-6 backdrop-blur-md border p-4 rounded-[1.5rem] shadow-xl z-10 flex items-center gap-4 transition-all duration-500 translate-y-2 group-hover:translate-y-0 ${isDark ? 'bg-slate-800/90 border-white/10' : 'bg-white/95 border-slate-100'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-600 text-white shadow-blue-500/20'}`}>
                                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <div className='flex flex-col'>
                                    <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Samson Dental Center</p>
                                    <a href='https://maps.google.com' target='_blank' rel='noopener noreferrer' className='text-[10px] font-bold text-blue-600 hover:text-blue-500 uppercase tracking-widest mt-0.5 mt-1'>Open in Maps</a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LocationHours;
