import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PageHeader = ({ overline, title, subtitle }) => {
    const containerRef = useRef(null);
    const textElementsRef = useRef([]);

    const getContent = () => {
        const pageName = overline || title || 'Our Services';
        const slug = pageName.toLowerCase();

        const config = {
            'about us': {
                title: 'Global standards in dental excellence.',
                desc: 'Dedicated to world-class oral healthcare with clinical precision.',
            },
            'contact us': {
                title: 'Your journey to a perfect smile starts here.',
                desc: 'Connect with our specialists to discuss your personalized treatment.',
            },
            'our services': {
                title: 'Advanced solutions for every dental need.',
                desc: 'From preventive care to restorations, we offer comprehensive expertise.',
            },
            'our dentists': {
                title: 'Meet the team behind your smile.',
                desc: 'Our experts deliver top-quality treatments in a patient-focused environment.',
            },
            'gallery': {
                title: 'A glimpse into our clinical excellence.',
                desc: 'See the real-life transformations achieved in our modern facility.',
            },
            'appointment': {
                title: 'Secure your consultation in just a few clicks.',
                desc: 'Choose a time that works for you and start your journey today.',
            },
        };

        // Map aliases to primary keys
        const aliasMap = {
            about: 'about us',
            contact: 'contact us',
            inquiries: 'contact us',
            services: 'our services',
            doctors: 'our dentists',
            team: 'our dentists',
            booking: 'appointment',
        };

        const key = aliasMap[slug] || slug;
        const match = config[key];

        return {
            pageName,
            engagingTitle: match?.title || title || `Expert care for ${pageName}.`,
            subDesc:
                match?.desc ||
                subtitle ||
                'Committed to delivering top-quality treatments in a professional environment.',
        };
    };

    const { pageName, engagingTitle, subDesc } = getContent();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                textElementsRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power4.out',
                    delay: 0.3,
                },
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className='relative w-full min-h-[420px] md:min-h-[500px] lg:min-h-[550px] flex items-center justify-center overflow-hidden bg-[#050506] bg-linear-to-br from-[#050506] via-[#0b0c0f] to-[#12131a] pt-20'
        >
            {/* Geometric Background Elements - Sharp diagonal layout from the image reference */}
            <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none'>
                {/* Main sharp diagonal panel on the right */}
                <div
                    className='absolute top-0 right-0 w-[200%] h-[300%] origin-top-right bg-linear-to-br from-white/14 via-white/7 to-transparent shadow-[-20px_0_50px_rgba(0,0,0,0.45)]'
                    style={{
                        transform: 'translate(25%, -30%) rotate(38deg)',
                        borderLeft: '1px solid rgba(255,255,255,0.4)',
                    }}
                ></div>

                {/* Secondary accent diagonal line */}
                <div
                    className='absolute top-0 right-0 w-[200%] h-[300%] origin-top-right'
                    style={{
                        transform: 'translate(23%, -28%) rotate(38deg)',
                        borderLeft: '1px solid rgba(255,255,255,0.1)',
                    }}
                ></div>

                {/* Additional glow for text readability and backdrop harmony */}
                <div className='absolute top-1/2 left-1/2 w-200 h-200 rounded-full blur-[120px] bg-[#4c6bf5]/10 -translate-x-1/2 -translate-y-1/2'></div>
            </div>

            {/* Content - Tiered hierarchy from image */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 w-full pb-10 text-center font-sans'>
                <div className='flex flex-col items-center'>
                    {/* 1. Page Title / Name (Overline style) */}
                    <span
                        ref={(el) => (textElementsRef.current[0] = el)}
                        className='text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.2em] text-slate-300 mb-6'
                    >
                        {pageName}
                    </span>

                    {/* 2. Engaging Sentence (Main Heading - Sentence Case) */}
                    <h1
                        ref={(el) => (textElementsRef.current[1] = el)}
                        className='text-[2.5rem] sm:text-[3.5rem] lg:text-[4.75rem] font-medium leading-[1.1] tracking-[-0.03em] text-white max-w-4xl mb-6 text-balance'
                    >
                        {engagingTitle}
                    </h1>

                    {/* 3. Sub-description (Bottom text) */}
                    <p
                        ref={(el) => (textElementsRef.current[2] = el)}
                        className='text-[15px] sm:text-base text-white/80 max-w-2xl leading-[1.6] font-normal text-balance mt-4'
                    >
                        {subDesc}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
