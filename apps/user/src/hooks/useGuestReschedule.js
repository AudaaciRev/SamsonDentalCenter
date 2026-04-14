import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import useSlotHold from './useSlotHold';

const STEPS = ['datetime', 'review'];

/**
 * Hook to manage the guest rescheduling wizard state.
 * Handles token verification, slot holding, and final submission.
 */
const useGuestReschedule = (token) => {
    const [step, setStep] = useState(0);
    const [currentAppt, setCurrentAppt] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Slot Hold Logic (Uses the unique token as session ID)
    const slotHold = useSlotHold(token);

    // ── 1. Initial Load: Fetch Appointment Details ──
    const fetchInfo = useCallback(async () => {
        if (!token) {
            setError('Missing rescheduling token.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await api.get(`/appointments/guest/reschedule?token=${token}`);
            
            setCurrentAppt(data.current_appointment);
            
            // ✅ Pre-fill with current appointment details so they have a starting point
            setFormData({ 
                date: data.current_appointment.date, 
                time: data.current_appointment.time,
                service_id: data.current_appointment.service_id,
                service_name: data.current_appointment.service
            });
            
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Invalid or expired link.');
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    // ── 2. Navigation Logic ──
    const currentStep = STEPS[step];

    const nextStep = () => {
        if (step < STEPS.length - 1) setStep((s) => s + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep((s) => s - 1);
    };

    const goToStep = (index) => {
        if (index < step) setStep(index);
    };

    const updateFields = (fields) => {
        setError(null);
        setFormData((prev) => ({ ...prev, ...fields }));
    };

    // ── 3. Submission ──
    const submit = async () => {
        if (!token || !formData.date || !formData.time) return;

        setSubmitting(true);
        setError(null);

        try {
            const data = await api.post(`/appointments/guest/reschedule?token=${token}`, {
                date: formData.date,
                time: formData.time,
                user_session_id: token, // ✅ Use token as the session id for hold recognition
            });

            setResult({
                appointment: data.new_appointment,
                isUser: !!data.user
            });
            
            slotHold.clearHold();
        } catch (err) {
            setError(err.message || 'Failed to move appointment.');
        } finally {
            setSubmitting(false);
        }
    };

    const reset = () => {
        setStep(0);
        setFormData({ date: '', time: '' });
        setError(null);
        setResult(null);
        slotHold.clearHold();
    };

    return {
        // State
        loading,
        currentAppt,
        token,
        step,
        currentStep,
        steps: STEPS,
        formData,
        submitting,
        error,
        result,
        slotHold,
        // Actions
        updateFields,
        nextStep,
        prevStep,
        goToStep,
        submit,
        reset,
        refresh: fetchInfo
    };
};

export default useGuestReschedule;
