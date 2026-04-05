import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import ComponentCard from '../../components/common/ComponentCard';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    Badge,
} from '../../components/ui';

const appointmentsData = [
    {
        id: 'APP-001',
        dentist: {
            name: 'Dr. Sarah Smith',
            specialty: 'General Dentist',
            image: '/images/user/user-01.jpg',
        },
        service: 'Routine Checkup',
        date: 'Oct 24, 2024',
        time: '10:00 AM',
        status: 'Scheduled',
    },
    {
        id: 'APP-002',
        dentist: {
            name: 'Dr. Mark Wilson',
            specialty: 'Orthodontist',
            image: '/images/user/user-02.jpg',
        },
        service: 'Braces Adjustment',
        date: 'Oct 20, 2024',
        time: '02:30 PM',
        status: 'Completed',
    },
    {
        id: 'APP-003',
        dentist: {
            name: 'Dr. Sarah Smith',
            specialty: 'General Dentist',
            image: '/images/user/user-01.jpg',
        },
        service: 'Tooth Extraction',
        date: 'Oct 15, 2024',
        time: '09:00 AM',
        status: 'Cancelled',
    },
    {
        id: 'APP-004',
        dentist: {
            name: 'Dr. Emily Chen',
            specialty: 'Periodontist',
            image: '/images/user/user-03.jpg',
        },
        service: 'Gum Treatment',
        date: 'Nov 05, 2024',
        time: '11:15 AM',
        status: 'Pending',
    },
    {
        id: 'APP-005',
        dentist: {
            name: 'Dr. Sarah Smith',
            specialty: 'General Dentist',
            image: '/images/user/user-01.jpg',
        },
        service: 'Teeth Whitening',
        date: 'Nov 12, 2024',
        time: '04:00 PM',
        status: 'Scheduled',
    },
];

const MyAppointments = () => {
    return (
        <>
            <PageBreadcrumb pageTitle='My Appointments' />
            <ComponentCard
                title='Recent Appointments'
                desc='View and manage your upcoming and past dental visits.'
            >
                <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
                    <div className='max-w-full overflow-x-auto'>
                        <Table>
                            {/* Table Header */}
                            <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                                    >
                                        Dentist
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                                    >
                                        Service
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                                    >
                                        Date & Time
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                                    >
                                        ID
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                                {appointmentsData.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell className='px-5 py-4 sm:px-6 text-start'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 overflow-hidden rounded-full bg-brand-50'>
                                                    <div className='w-full h-full flex items-center justify-center text-brand-500 font-bold'>
                                                        {app.dentist.name
                                                            .replace('Dr. ', '')
                                                            .charAt(0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
                                                        {app.dentist.name}
                                                    </span>
                                                    <span className='block text-gray-500 text-theme-xs dark:text-gray-400'>
                                                        {app.dentist.specialty}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                            {app.service}
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                            <div>
                                                <span className='block text-gray-800 dark:text-white/90'>
                                                    {app.date}
                                                </span>
                                                <span className='block text-theme-xs'>
                                                    {app.time}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                            <Badge
                                                size='sm'
                                                color={
                                                    app.status === 'Scheduled'
                                                        ? 'primary'
                                                        : app.status ===
                                                          'Completed'
                                                        ? 'success'
                                                        : app.status ===
                                                          'Cancelled'
                                                        ? 'error'
                                                        : 'warning'
                                                }
                                            >
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
                                            {app.id}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </ComponentCard>
        </>
    );
};

export default MyAppointments;
