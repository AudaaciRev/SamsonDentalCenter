import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AIChatbotPromo = ({ variant = 'light' }) => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const isDark = variant === 'dark';

    // GSAP Animations
    useEffect(() => {
        let ctx = gsap.context(() => {
            // Heading masked reveal
            gsap.from('.chatbot-reveal-text', {
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

            // Card Reveal
            gsap.from('.chatbot-reveal-items', {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: 'expo.out',
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
        <section ref={sectionRef} className={`py-16 sm:py-24 lg:py-32 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            {/* Background decoration */}
            <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
                <div className={`chatbot-reveal-items absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full blur-[120px] ${isDark ? 'bg-blue-600/10' : 'bg-blue-600/5'}`}></div>
            </div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center'>
                    
                    {/* Visual Mockup - Side 1 */}
                    <div className='order-2 lg:order-1 chatbot-reveal-items'>
                        <div className='relative group'>
                            <div className={`rounded-[2.5rem] shadow-2xl overflow-hidden border max-w-md mx-auto lg:mx-0 transform -rotate-1 group-hover:rotate-0 transition-all duration-700 ease-out ${isDark ? 'bg-slate-800 border-white/5' : 'bg-white border-slate-200 shadow-slate-200/50 hover:shadow-blue-500/10'}`}>
                                <div className={`backdrop-blur-sm p-5 border-b flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50/80 border-slate-200/80'}`}>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20'>
                                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Dental AI Assistant</p>
                                            <p className='text-[10px] text-green-500 font-bold flex items-center uppercase tracking-widest mt-0.5'>
                                                <span className='w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse'></span>
                                                Active Now
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={`p-8 space-y-6 h-[400px] overflow-y-auto ${isDark ? 'bg-slate-900/50' : 'bg-slate-50/30'}`}>
                                    <div className='flex justify-start'>
                                        <div className={`rounded-2xl rounded-tl-none p-5 max-w-[85%] text-sm leading-relaxed font-medium shadow-sm border ${isDark ? 'bg-slate-800 text-slate-300 border-white/5' : 'bg-white text-slate-600 border-slate-100 shadow-slate-200/50'}`}>
                                            Hello! How can I help you with your dental health today?
                                        </div>
                                    </div>
                                    <div className='flex justify-end'>
                                        <div className='bg-blue-600 text-white rounded-2xl rounded-tr-none p-5 max-w-[85%] text-sm font-medium shadow-lg shadow-blue-500/10'>
                                            Do you offer teeth whitening services?
                                        </div>
                                    </div>
                                    <div className='flex justify-start'>
                                        <div className={`rounded-2xl rounded-tl-none p-5 max-w-[85%] text-sm leading-relaxed font-medium shadow-sm border ${isDark ? 'bg-slate-800 text-slate-300 border-white/5' : 'bg-white text-slate-600 border-slate-100 shadow-slate-200/50'}`}>
                                            Yes! We offer professional in-office whitening that can brighten your smile up to 8 shades in one visit.
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-5 border-t ${isDark ? 'border-white/5 bg-slate-800/80' : 'border-slate-200/80 bg-slate-50/50'}`}>
                                    <div className={`h-12 rounded-xl border w-full flex items-center px-5 ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200 shadow-inner shadow-slate-50'}`}>
                                        <span className='text-slate-500 text-xs font-medium'>Type your message...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content - Side 2 */}
                    <div ref={headingRef} className='order-1 lg:order-2 text-center lg:text-left'>
                        <div className='overflow-hidden mb-8'>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm chatbot-reveal-text ${isDark ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M13 10V3L4 14h7v7l9-11h-7z'></path>
                                </svg>
                                <span className='text-[10px] font-bold uppercase tracking-widest'>24/7 Smart Support</span>
                            </div>
                        </div>

                        <h2 className={`text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <div className='overflow-hidden'>
                                <span className='block chatbot-reveal-text'>Instant Answers,</span>
                            </div>
                            <div className='overflow-hidden'>
                                <span className='block text-blue-600 chatbot-reveal-text'>Anytime.</span>
                            </div>
                        </h2>

                        <div className='chatbot-reveal-items'>
                            <p className={`text-lg md:text-xl mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Have questions about our services, pricing, or availability? Our advanced AI Chatbot is ready to assist you instantly.
                            </p>

                            <div className='flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start'>
                                <button
                                    onClick={() => navigate('/inquiries')}
                                    className='w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 px-12 py-5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1'
                                >
                                    Ask Our AI Now
                                </button>
                                <button
                                    onClick={() => navigate('/services')}
                                    className={`w-full sm:w-auto border px-12 py-5 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'}`}
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIChatbotPromo;
