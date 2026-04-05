import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import ComponentCard from '../../components/common/ComponentCard';
import { Badge } from '../../components/ui';

// Dummy data fetching for now
const getAppointmentData = (id) => {
    return {
        id: id,
        dentist: {
            name: 'Dr. Sarah Smith',
            specialty: 'General Dentist',
            image: '/images/user/user-01.jpg',
        },
        patient: 'John Doe',
        service: 'Routine Checkup',
        date: 'Oct 24, 2024',
        time: '10:00 AM',
        endTime: '11:00 AM',
        duration: '1 Hour',
        serviceTier: 'Standard',
        approvalStatus: 'Approved',
        status: 'Scheduled',
        preTreatmentNotes: 'Please arrive 10 minutes early to fill out any necessary forms. Avoid eating heavy meals 2 hours before the appointment.',
        postAppointmentDetails: 'N/A',
    };
};

const AppointmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // In a real app, you'd fetch this from via useEffect/React Query
    const app = getAppointmentData(id);

    return (
        <>
            <PageBreadcrumb 
                pageTitle='Appointment Details' 
                parentName='My Appointments'
                parentPath='/patient/appointments'
            />
            <div className="space-y-6">
                <ComponentCard
                    title={`Appointment ${app.id}`}
                    desc="Detailed view of this appointment's core information and status."
                >
                    <div className="p-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        {/* Core Info & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</h4>
                                    <p className="mt-1 text-base font-semibold text-gray-800 dark:text-white/90">
                                        {app.date} | {app.time} - {app.endTime}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Details</h4>
                                    <p className="mt-1 text-base font-semibold text-gray-800 dark:text-white/90">{app.service}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration: {app.duration} • Tier: {app.serviceTier}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dentist</h4>
                                    <div className="mt-2 flex items-center gap-3">
                                        <div className='w-10 h-10 overflow-hidden rounded-full bg-brand-50 flex items-center justify-center text-brand-500 font-bold text-sm'>
                                            {app.dentist.name.replace('Dr. ', '').charAt(0)}
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
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Appointment Status</h4>
                                    <div className="mt-2">
                                        <Badge
                                            size='sm'
                                            color={
                                                app.status === 'Scheduled'
                                                    ? 'primary'
                                                    : app.status === 'Completed'
                                                    ? 'success'
                                                    : app.status === 'Cancelled'
                                                    ? 'error'
                                                    : 'warning'
                                            }
                                        >
                                            {app.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Approval</h4>
                                    <p className="mt-1 text-base font-semibold text-gray-800 dark:text-white/90">{app.approvalStatus}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200 dark:border-white/[0.05] mb-6"/>

                        {/* Pre & Post Notes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                <h4 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-2">Pre-Treatment Notes</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{app.preTreatmentNotes}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                <h4 className="text-sm font-medium text-gray-800 dark:text-white/90 mb-2">Post-Appointment Details</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{app.postAppointmentDetails}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate('/patient/appointments')}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Back to List
                            </button>
                            {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                                <>
                                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        Reschedule
                                    </button>
                                    <button className="px-4 py-2 border border-error-500 text-error-500 dark:text-error-400 rounded-lg text-sm font-medium hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors">
                                        Cancel Appointment
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </>
    );
};

export default AppointmentDetails;
