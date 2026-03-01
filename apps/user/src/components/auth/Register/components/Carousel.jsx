import { useState, useEffect } from 'react';

const Carousel = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const carouselImages = [
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className='hidden md:flex md:w-[50%] flex-shrink-0 relative bg-slate-900 overflow-hidden'>
            {carouselImages.map((img, idx) => (
                <img
                    key={idx}
                    src={img}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${currentImageIndex === idx ? 'opacity-40' : 'opacity-0'}`}
                    alt='Clinic'
                />
            ))}
            <div className='relative z-10 w-full p-6 lg:p-10 flex flex-col h-full'>
                <div className='flex items-center space-x-3 mb-8 lg:mb-12'>
                    <div className='w-8 h-8 lg:w-10 lg:h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20'>
                        <svg
                            className='w-4 h-4 lg:w-5 lg:h-5 fill-current'
                            viewBox='0 0 100 100'
                        >
                            <path d='M50 5 C25 5 20 40 20 60 C20 85 40 95 50 95 C60 95 80 85 80 60 C80 40 75 5 50 5 Z' />
                        </svg>
                    </div>
                    <span className='font-brand font-black text-white tracking-tighter text-lg lg:text-xl'>
                        PRIMERA DENTA
                    </span>
                </div>
                <div className='mt-auto'>
                    <div className='inline-block px-3 py-1 bg-sky-500/20 border border-sky-500/30 rounded-full mb-4'>
                        <span className='text-[8px] lg:text-[10px] font-black text-sky-400 uppercase tracking-[0.2em]'>
                            Patient Portal
                        </span>
                    </div>
                    <h1 className='text-2xl lg:text-4xl font-brand font-extrabold text-white mb-4 leading-tight'>
                        Modern Care,
                        <br />
                        Perfect Smiles.
                    </h1>
                    <p className='text-slate-400 text-xs lg:text-sm leading-relaxed max-w-xs mb-8'>
                        Access your premium dental portal to manage visits and records effortlessly.
                    </p>
                    <div className='flex space-x-3'>
                        {carouselImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-500 ${currentImageIndex === idx ? 'w-10 bg-sky-500' : 'w-3 bg-white/10'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
