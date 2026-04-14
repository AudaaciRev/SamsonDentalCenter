import { useSearchParams } from 'react-router-dom';
import useGuestReschedule from '../../hooks/useGuestReschedule';
import RescheduleWizard from '../../components/guest-reschedule/RescheduleWizard';

const RescheduleAppointmentPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const reschedule = useGuestReschedule(token);

    return (
        <RescheduleWizard reschedule={reschedule} />
    );
};

export default RescheduleAppointmentPage;
