import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useGuestBooking from '../../hooks/useGuestBooking';
import GuestBookingWizard from '../../components/guest-booking/GuestBookingWizard';
import useServices from '../../hooks/useServices';

const GuestBookingPage = () => {
    const [searchParams] = useSearchParams();
    const initialServiceId = searchParams.get('service');
    const [initialServiceName, setInitialServiceName] = useState(null);

    const { services } = useServices();

    // Issue #4: Pre-populate service name from services list
    useEffect(() => {
        if (initialServiceId && services && services.length > 0) {
            // Note: Ensure types match (e.g., string vs number) when comparing IDs
            const service = services.find((s) => String(s.id) === String(initialServiceId));
            if (service) {
                setInitialServiceName(service.name);
            }
        }
    }, [initialServiceId, services]);

    const booking = useGuestBooking(initialServiceId, initialServiceName);

    return (
        <GuestBookingWizard booking={booking} />
    );
};

export default GuestBookingPage;
