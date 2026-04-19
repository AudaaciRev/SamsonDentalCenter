import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

// â”€â”€ Inline SVG Icons â”€â”€
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

const UserCircleIcon = () => (
    <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
        <path
            d='M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);

const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9.5L12 4L21 9.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
    {
        icon: <UserCircleIcon />,
        name: 'Doctors',
        path: '/doctors',
        subItems: [
            { name: 'Profile', path: '/doctors/profile' },
            { name: 'Schedule', path: '/doctors/schedule' },
            { name: 'History', path: '/doctors/history' },
        ],
    },
];

const ChevronDownIcon = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const AdminSidebar = () => {
    const { isExpanded, isMobileOpen, setIsMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();
    const [expandedNav, setExpandedNav] = useState('/doctors');

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
            <div className={`py-8 flex w-full transition-all duration-300 pl-[13px]`}>
                <Link to='/' className="flex items-center min-h-[40px]">
                    <div className="flex items-center">
                        <span className="text-2xl font-black text-brand-500 font-outfit min-w-[24px] flex justify-center">
                            S
                        </span>
                        <span 
                            className={`sidebar-text-base text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase font-outfit ${
                                isExpanded || isHovered || isMobileOpen 
                                ? 'opacity-100 max-w-[200px] visible ml-0' 
                                : 'opacity-0 max-w-0 invisible ml-0'
                            }`}
                        >
                            amson <span className='text-brand-500'>Dental</span>
                        </span>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <div className='flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar'>
                <nav className='mb-6'>
                    <div className='flex flex-col'>
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex items-center leading-[20px] text-gray-400 pl-[13px] transition-all duration-300`}
                            >
                                <div className={`flex items-center transition-all duration-300 ${isExpanded || isHovered || isMobileOpen ? 'opacity-0 scale-50 w-0 overflow-hidden' : 'opacity-100 scale-100 w-[24px]'}`}>
                                    <HorizontalDots className='size-6' />
                                </div>
                                <span className={`sidebar-text-base ${
                                    isExpanded || isHovered || isMobileOpen 
                                    ? 'opacity-100 max-w-[200px] visible ml-0' 
                                    : 'opacity-0 max-w-0 invisible ml-0 text-transparent'
                                }`}>
                                    Menu
                                </span>
                            </h2>
                            <ul className='flex flex-col gap-1'>
                                {navItems.map((nav) => {
                                    const hasSubItems = nav.subItems && nav.subItems.length > 0;
                                    const isNavExpanded = expandedNav === nav.path;
                                    const isMainActive = isActive(nav.path);

                                    return (
                                        <li key={nav.name}>
                                            <div
                                                onClick={() => {
                                                    if (hasSubItems) {
                                                        setExpandedNav(isNavExpanded ? null : nav.path);
                                                    }
                                                }}
                                                className={`cursor-pointer ${hasSubItems ? '' : 'pointer-events-none'}`}
                                            >
                                                {hasSubItems ? (
                                                    <div
                                                        className={`menu-item group ${
                                                            isMainActive
                                                                ? 'menu-item-active'
                                                                : 'menu-item-inactive'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`menu-item-icon-size shrink-0 ${
                                                                isMainActive
                                                                    ? 'menu-item-icon-active'
                                                                    : 'menu-item-icon-inactive'
                                                            }`}
                                                        >
                                                            {nav.icon}
                                                        </span>
                                                        <span className={`sidebar-text-base flex-grow ${
                                                            isExpanded || isHovered || isMobileOpen 
                                                            ? 'sidebar-text-expanded' 
                                                            : 'sidebar-text-collapsed'
                                                        }`}>
                                                            {nav.name}
                                                        </span>
                                                        <span className={`transition-transform duration-200 ${isNavExpanded ? 'rotate-180' : ''} ${
                                                            isExpanded || isHovered || isMobileOpen ? 'opacity-100 block' : 'opacity-0 hidden'
                                                        }`}>
                                                            <ChevronDownIcon className="w-4 h-4" />
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <Link
                                                        to={nav.path}
                                                        className={`menu-item group ${
                                                            isActive(nav.path)
                                                                ? 'menu-item-active'
                                                                : 'menu-item-inactive'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`menu-item-icon-size shrink-0 ${
                                                                isActive(nav.path)
                                                                    ? 'menu-item-icon-active'
                                                                    : 'menu-item-icon-inactive'
                                                            }`}
                                                        >
                                                            {nav.icon}
                                                        </span>
                                                        <span className={`sidebar-text-base ${
                                                            isExpanded || isHovered || isMobileOpen 
                                                            ? 'sidebar-text-expanded' 
                                                            : 'sidebar-text-collapsed'
                                                        }`}>
                                                            {nav.name}
                                                        </span>
                                                    </Link>
                                                )}
                                            </div>

                                            {/* SubItems */}
                                            {hasSubItems && (
                                                <ul
                                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                        isNavExpanded && (isExpanded || isHovered || isMobileOpen)
                                                            ? 'max-h-52 opacity-100 mt-1'
                                                            : 'max-h-0 opacity-0'
                                                    }`}
                                                >
                                                    {nav.subItems.map((sub) => (
                                                        <li key={sub.name}>
                                                            <Link
                                                                to={sub.path}
                                                                className={`flex items-center pl-12 pr-4 py-2.5 text-sm font-medium transition-colors rounded-lg mx-2 ${
                                                                    location.pathname.startsWith(sub.path)
                                                                        ? 'text-brand-500 bg-brand-50 dark:bg-brand-500/10'
                                                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                                                }`}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Sidebar Footer */}
            <div className='mt-auto pt-4 border-t border-gray-100 dark:border-gray-800'>
                <ul className='flex flex-col gap-1'>
                    <li>
                        <Link
                            to='/'
                            className={`menu-item group menu-item-inactive`}
                        >
                            <span className='menu-item-icon-size menu-item-icon-inactive shrink-0'>
                                <HomeIcon />
                            </span>
                            <span className={`sidebar-text-base ${
                                isExpanded || isHovered || isMobileOpen 
                                ? 'sidebar-text-expanded' 
                                : 'sidebar-text-collapsed'
                            }`}>
                                Back to Home
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default AdminSidebar;




