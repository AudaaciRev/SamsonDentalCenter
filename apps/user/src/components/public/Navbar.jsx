import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MobileMenu from './MobileMenu';
import gsap from 'gsap';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/inquiries', label: 'Inquiries' },
    { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef(null);
    const lastScrollY = useRef(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Smart Navbar: Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            
            // GSAP smooth state changes
            if (currentScrollY > 20) {
                gsap.to(navRef.current, {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(navRef.current, {
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    backdropFilter: 'blur(0px)',
                    paddingTop: '1.5rem',
                    paddingBottom: '1.5rem',
                    borderBottomColor: 'rgba(255, 255, 255, 0)',
                    boxShadow: '0 0px 0px 0 rgba(0, 0, 0, 0)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
            
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);

        let ctx = gsap.context(() => {
            gsap.from('.nav-anim', {
                y: -30,
                opacity: 0,
                duration: 1.2,
                stagger: 0.08,
                ease: 'expo.out',
                delay: 0.2,
                clearProps: 'transform,opacity',
            });
        }, navRef);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            ctx.revert();
        };
    }, []);

    // Smart Visibility Logic
    useEffect(() => {
        gsap.to(navRef.current, {
            y: isVisible ? 0 : -100,
            duration: 0.4,
            ease: 'power2.inOut'
        });
    }, [isVisible]);

    return (
        <nav
            ref={navRef}
            className="fixed top-0 left-0 right-0 z-50 border-b flex items-center"
            style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0)', 
                borderBottomColor: 'rgba(255, 255, 255, 0)',
                paddingTop: '1.5rem',
                paddingBottom: '1.5rem'
            }}
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full'>
                <div className='flex items-center justify-between'>
                    {/* Section 1: Logo */}
                    <div className='flex-1 flex items-center justify-start nav-anim'>
                        <Link
                            to='/'
                            className='group inline-flex items-center gap-2 sm:gap-3 cursor-pointer focus:outline-none transition-all duration-300 hover:opacity-80'
                        >
                            <div className='relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 ring-1 ring-blue-100/50'>
                                <svg
                                    viewBox='0 0 100 100'
                                    className='w-5 h-5 sm:w-6 sm:h-6 fill-current'
                                >
                                    <path d='M50 5 C25 5 20 40 20 60 C20 85 40 95 50 95 C60 95 80 85 80 60 C80 40 75 5 50 5 Z M50 85 C35 85 30 70 30 60 C30 40 35 15 50 15 C65 15 70 40 70 60 C70 70 65 85 50 85 Z' />
                                    <path
                                        className='text-slate-900 group-hover:text-blue-100 transition-colors duration-300'
                                        d='M50 35 C40 35 35 45 35 55 C35 65 40 75 50 75 C60 75 65 65 65 55 C65 45 60 35 50 35 Z M50 65 C45 65 42 60 42 55 C42 50 45 45 50 45 C55 45 58 50 58 55 C58 60 55 65 50 65 Z'
                                    />
                                </svg>
                            </div>
                            <div className='flex flex-col items-start justify-center pt-0.5 ml-1'>
                                <span className='font-extrabold text-[1.4rem] sm:text-[1.7rem] text-[#172554] uppercase leading-none tracking-tight pb-1'>
                                    SAMSON
                                </span>
                                <span className='text-blue-600 text-[8px] sm:text-[10px] uppercase tracking-[0.3em] leading-none font-bold'>
                                    DENTAL CENTER
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Section 2: Links (Desktop) */}
                    <div className='hidden md:flex items-center justify-center gap-8'>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                className={({ isActive }) =>
                                    `relative py-2 text-[15px] font-semibold tracking-wide transition-all duration-300 ease-out group ${isActive
                                        ? 'text-blue-600'
                                        : 'text-slate-600 hover:text-blue-600'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <span className='nav-anim block relative'>
                                        {link.label}
                                        <span
                                            className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-blue-600 transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                                }`}
                                        />
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Section 3: Actions */}
                    <div className='flex-1 flex items-center justify-end gap-3'>
                        <div className='nav-anim flex items-center gap-3'>
                            {user ? (
                                <button
                                    onClick={() => navigate('/patient')}
                                    className='hidden sm:inline-flex items-center justify-center text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ease-out ring-1 ring-slate-200 hover:ring-blue-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                                >
                                    Dashboard
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className='hidden sm:inline-flex items-center justify-center text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ease-out ring-1 ring-slate-200 hover:ring-blue-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                                >
                                    Login
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/book')}
                                className='hidden md:inline-flex items-center justify-center bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 ease-out shadow-sm hover:shadow-[0_8px_20px_rgb(37,99,235,0.2)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2'
                            >
                                Book Now
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className='nav-anim md:hidden'>
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className='p-2.5 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm ring-1 ring-slate-200/80 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 active:scale-95'
                            >
                                {mobileOpen ? (
                                    <X size={20} strokeWidth={2.5} />
                                ) : (
                                    <Menu size={20} strokeWidth={2.5} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <MobileMenu
                    links={navLinks}
                    user={user}
                    onClose={() => setMobileOpen(false)}
                />
            )}
        </nav>
    );
};

export default Navbar;
