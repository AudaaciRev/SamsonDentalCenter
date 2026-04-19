import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { ServicesProvider } from '../context/ServicesContext';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import Backdrop from '../components/admin/Backdrop';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useTheme } from '../context/ThemeContext';

const LayoutContent = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const { setIsDarkModeAllowed } = useTheme();

    useEffect(() => {
        setIsDarkModeAllowed(true);
        return () => setIsDarkModeAllowed(false);
    }, [setIsDarkModeAllowed]);

    return (
        <div className='min-h-screen xl:flex bg-white sm:bg-transparent dark:bg-gray-900 dark:sm:bg-transparent'>
            <div>
                <AdminSidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
                    isExpanded || isHovered
                        ? 'lg:ml-[290px]'
                        : 'lg:ml-[90px]'
                } ${isMobileOpen ? 'ml-0' : ''}`}
            >
                <AdminHeader />
                <div className='flex-grow pt-0 px-0 pb-0 sm:p-4 mx-auto w-full max-w-[1536px] md:p-6 bg-white sm:bg-transparent dark:bg-gray-900 dark:sm:bg-transparent'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

const AdminPortalLayout = () => {
    return (
        <SidebarProvider>
            <ServicesProvider>
                <LayoutContent />
            </ServicesProvider>
        </SidebarProvider>
    );
};

export default AdminPortalLayout;




