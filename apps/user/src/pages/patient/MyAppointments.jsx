import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import ComponentCard from '../../components/common/ComponentCard';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    Badge,
    Dropdown,
    DropdownItem,
} from '../../components/ui';

const ThreeDotsIcon = () => (
    <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
        <path
            d='M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
        <path
            d='M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
);

export const appointmentsData = [
    {
        id: 'APP-001',
        dentist: {
            name: 'Dr. Sarah Alexandra Smith, DDS',
            specialty: 'Senior General Dentist',
            image: '/images/user/user-01.jpg',
        },
        patient: 'Johnathon Bartholomew Doe',
        service: 'Comprehensive Routine Checkup',
        date: 'Oct 24, 2024',
        time: '10:00 AM',
        endTime: '11:00 AM',
        status: 'Approved',
    },
    {
        id: 'APP-002',
        dentist: {
            name: 'Dr. Michael Chen, Orthodontist',
            specialty: 'Orthodontics & Facial Orthopedics',
            image: '/images/user/user-02.jpg',
        },
        patient: 'Samantha Marie Wellington III',
        service: 'Advanced Braces Adjustment',
        date: 'Oct 20, 2024',
        time: '02:30 PM',
        endTime: '04:00 PM',
        status: 'Approved',
    },
    {
        id: 'APP-003',
        dentist: {
            name: 'Dr. Emily Johnson, Oral Surgeon',
            specialty: 'Maxillofacial Surgery',
            image: '/images/user/user-03.jpg',
        },
        patient: 'Christopher Alexander Martinez',
        service: 'Complex Wisdom Tooth Extraction',
        date: 'Oct 15, 2024',
        time: '09:00 AM',
        endTime: '09:45 AM',
        status: 'Cancelled',
        rejectionReason: 'Clinic requested cancellation due to schedule conflict.',
    },
    {
        id: 'APP-004',
        dentist: {
            name: 'Dr. Emily Chen',
            specialty: 'Periodontist',
            image: '/images/user/user-03.jpg',
        },
        patient: 'John Doe',
        service: 'Gum Treatment',
        date: 'Nov 05, 2024',
        time: '11:15 AM',
        endTime: '12:00 PM',
        status: 'Pending',
    },
    {
        id: 'APP-005',
        dentist: {
            name: 'Dr. Sarah Alexandra Smith, DDS',
            specialty: 'Senior General Dentist',
            image: '/images/user/user-01.jpg',
        },
        patient: 'Isabella Florentina Gomez-Smith',
        service: 'Deep Tissue Gum Disease Treatment',
        date: 'Nov 12, 2024',
        time: '04:00 PM',
        endTime: '05:30 PM',
        status: 'Pending',
    },
];

const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const MyAppointments = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const navigate = useNavigate();

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const handleViewDetails = (id) => {
        setOpenDropdown(null);
        navigate(`/patient/appointments/${id}`);
    };

    return (
        <>
            <PageBreadcrumb pageTitle='My Appointments' />
            <ComponentCard 
                title='My Appointments'
                desc='View and manage your upcoming and past dental visits.'
                action={
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <input 
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-transparent dark:border-white/[0.05] dark:text-gray-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 w-[160px] sm:w-[220px]"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-white/[0.03] dark:text-gray-300 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H21M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Filter
                        </button>
                    </div>
                }
            >
                <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
                    <div className='max-w-full overflow-x-auto'>
                        <Table>
                            {/* Table Header */}
                            <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400 min-w-[120px]'
                                    >
                                        Date
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400 min-w-[150px]'
                                    >
                                        Time
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400'
                                    >
                                        Service
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400'
                                    >
                                        Dentist
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400'
                                    >
                                        Patient
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400'
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-4 py-3 font-medium text-gray-500 text-end text-sm dark:text-gray-400'
                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                                {appointmentsData.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell className='px-4 py-3 text-start min-w-[120px]'>
                                            <span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
                                                {app.date}
                                            </span>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-start min-w-[150px]'>
                                            <span className='block text-gray-500 text-theme-sm dark:text-gray-400'>
                                                {app.time} - {app.endTime}
                                            </span>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                            <span className='block' title={app.service}>
                                                {truncateText(app.service, 10)}
                                            </span>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-start'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-8 h-8 overflow-hidden rounded-full bg-brand-50'>
                                                    <div className='w-full h-full flex items-center justify-center text-brand-500 font-bold text-xs'>
                                                        {app.dentist.name
                                                            .replace('Dr. ', '')
                                                            .charAt(0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90' title={app.dentist.name}>
                                                        {truncateText(app.dentist.name, 12)}
                                                    </span>
                                                    <span className='block text-gray-500 text-theme-xs dark:text-gray-400' title={app.dentist.specialty}>
                                                        {truncateText(app.dentist.specialty, 12)}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                            <span className='block' title={app.patient}>
                                                {truncateText(app.patient, 12)}
                                            </span>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                            <Badge
                                                size='sm'
                                                color={
                                                    app.status === 'Approved'
                                                        ? 'success'
                                                        : app.status === 'Cancelled'
                                                        ? 'error'
                                                        : 'warning'
                                                }
                                            >
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-end text-theme-sm dark:text-gray-400'>
                                            <div className='relative flex justify-end'>
                                                <button
                                                    onClick={() =>
                                                        toggleDropdown(app.id)
                                                    }
                                                    className='dropdown-toggle text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                                                >
                                                    <ThreeDotsIcon />
                                                </button>
                                                <Dropdown
                                                    isOpen={
                                                        openDropdown === app.id
                                                    }
                                                    onClose={() =>
                                                        setOpenDropdown(null)
                                                    }
                                                    className='w-40 p-2'
                                                >
                                                    <DropdownItem
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                app.id
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </DropdownItem>
                                                </Dropdown>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.05]">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-white/[0.03] dark:text-gray-300 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Previous
                        </button>

                        <div className="hidden md:flex items-center gap-1">
                            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-500">
                                1
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.05] transition-colors">
                                2
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.05] transition-colors">
                                3
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                                ...
                            </span>
                            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.05] transition-colors">
                                8
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.05] transition-colors">
                                9
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/[0.05] transition-colors">
                                10
                            </button>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg dark:bg-white/[0.03] dark:text-gray-300 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors">
                            Next
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </ComponentCard>
        </>
    );
};

export default MyAppointments;
