import React from 'react';
import { Calendar, ClipboardList, Clock } from 'lucide-react';
import StatCard from './StatCard';

const DashboardStats = ({ entries = [], appointments = [], totalAppointments = 0, loading = false }) => {
    // Find next upcoming appointment (closest future date)
    const now = new Date();
    const upcomingAppt = [...appointments]
        .filter(a => ['CONFIRMED', 'PENDING'].includes(a.status) && new Date(a.appointment_date) >= now)
        .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))[0];

    const upcomingValue = upcomingAppt 
        ? new Date(upcomingAppt.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'None Scheduled';

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
            <StatCard 
                title='Upcoming Appointment' 
                value={loading ? '...' : upcomingValue} 
                icon={Clock} 
                color='success' 
            />
            <StatCard 
                title='Total Appointments' 
                value={loading ? '...' : totalAppointments.toString()} 
                icon={Calendar} 
                color='brand' 
            />
            <StatCard 
                title='Waitlist Entries' 
                value={loading ? '...' : entries.length.toString()} 
                icon={ClipboardList} 
                color='warning' 
            />
        </div>
    );
};

export default DashboardStats;
