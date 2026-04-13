import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

// ── Inline SVG Icons ──
const GridIcon = () => (
    <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M3.5 3.5H10.5V10.5H3.5V3.5ZM13.5 3.5H20.5V10.5H13.5V3.5ZM3.5 13.5H10.5V20.5H3.5V13.5ZM13.5 13.5H20.5V20.5H13.5V13.5Z'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);
const HorizontalDots = ({ className }) => (
    <svg
        className={className}
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <circle cx='6' cy='12' r='1.5' fill='currentColor' />
        <circle cx='12' cy='12' r='1.5' fill='currentColor' />
        <circle cx='18' cy='12' r='1.5' fill='currentColor' />
    </svg>
);

const navItems = [
    {
        icon: <GridIcon />,
        name: 'Dashboard',
        path: '/',
    },
];

const SecretarySidebar = () => {
    const { isExpanded, isMobileOpen, setIsMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();

    const isActive = useCallback(
        (path) => {
            if (path === '/' && location.pathname !== '/') return false;
            return location.pathname.startsWith(path);
        },
        [location.pathname]
    );
    
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 pb-4 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
                ${
                    isExpanded || isMobileOpen
                        ? 'w-[290px]'
                        : isHovered
                        ? 'w-[290px]'
                        : 'w-[90px]'
                }
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Logo */}
            <div
                className={`py-8 flex ${
                    !isExpanded && !isHovered
                        ? 'lg:justify-center'
                        : 'justify-start'
                }`}
            >
                <Link to='/'>
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <span className='text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase font-outfit'>
                                Samson <span className='text-brand-500'>Dental</span>
                            </span>
                        </>
                    ) : (
                        <>
                            <span className='text-2xl font-black text-brand-500 font-outfit'>
                                S
                            </span>
                        </>
                    )}
                </Link>
            </div>

            {/* Nav */}
            <div className='flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar'>
                <nav className='mb-6'>
                    <div className='flex flex-col'>
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? 'lg:justify-center'
                                        : 'justify-start'
                                }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    'Menu'
                                ) : (
                                    <HorizontalDots className='size-6' />
                                )}
                            </h2>
                            <ul className='flex flex-col gap-1'>
                                {navItems.map((nav) => (
                                    <li key={nav.name}>
                                        <Link
                                            to={nav.path}
                                            className={`menu-item group ${
                                                isActive(nav.path)
                                                    ? 'menu-item-active'
                                                    : 'menu-item-inactive'
                                            } ${
                                                !isExpanded && !isHovered
                                                    ? 'lg:justify-center'
                                                    : 'lg:justify-start'
                                            }`}
                                        >
                                            <span
                                                className={`menu-item-icon-size ${
                                                    isActive(nav.path)
                                                        ? 'menu-item-icon-active'
                                                        : 'menu-item-icon-inactive'
                                                }`}
                                            >
                                                {nav.icon}
                                            </span>
                                            {(isExpanded ||
                                                isHovered ||
                                                isMobileOpen) && (
                                                <span className='menu-item-text'>
                                                    {nav.name}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default SecretarySidebar;
