import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import PatientHeader from '../components/patient/PatientHeader';
import { useTheme } from '../context/ThemeContext';
import Backdrop from '../components/patient/Backdrop';
import PatientSidebar from '../components/patient/PatientSidebar';

const LayoutContent = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const { setIsDarkModeAllowed } = useTheme();

    // Theme Guard: Allow dark mode while portal is mounted
    useEffect(() => {
        setIsDarkModeAllowed(true);
        return () => setIsDarkModeAllowed(false);
    }, [setIsDarkModeAllowed]);

    return (
        <div className='min-h-screen xl:flex bg-white sm:bg-transparent dark:bg-gray-900 dark:sm:bg-transparent'>
            <div>
                <PatientSidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 min-w-0 flex flex-col transition-[margin] duration-300 ease-in-out ${
                    isExpanded || isHovered
                        ? 'lg:ml-[290px]'
                        : 'lg:ml-[90px]'
                } ${isMobileOpen ? 'ml-0' : ''}`}
            >
                <PatientHeader />
                <div className='flex-grow pt-0 px-0 pb-0 sm:p-4 mx-auto w-full max-w-[1536px] md:p-6 bg-white sm:bg-transparent dark:bg-gray-900 dark:sm:bg-transparent'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

const PatientPortalLayout = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default PatientPortalLayout;
