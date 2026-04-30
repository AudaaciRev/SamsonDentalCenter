import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

/**
 * Get all patient profiles (dependents) for a specific account holder.
 */
export const getPatientProfiles = async (profileId) => {
    const { data, error } = await supabaseAdmin
        .from('patient_profiles')
        .select('*')
        .eq('profile_id', profileId)
        .order('first_name', { ascending: true });

    if (error) throw new AppError(error.message, 500);
    return data || [];
};

/**
 * Get a single patient profile by ID with ownership check.
 */
export const getPatientProfileById = async (id, profileId) => {
    const { data, error } = await supabaseAdmin
        .from('patient_profiles')
        .select('*')
        .eq('id', id)
        .eq('profile_id', profileId)
        .single();

    if (error || !data) throw new AppError('Patient profile not found.', 404);
    return data;
};

/**
 * Create a new patient profile.
 */
export const createPatientProfile = async (profileId, profileData) => {
    const { first_name, last_name, middle_name, suffix, date_of_birth, relationship } = profileData;

    if (!first_name || !last_name || !date_of_birth || !relationship) {
        throw new AppError('First name, last name, DOB, and relationship are required.', 400);
    }

    const { data, error } = await supabaseAdmin
        .from('patient_profiles')
        .insert({
            profile_id: profileId,
            first_name,
            last_name,
            middle_name,
            suffix,
            date_of_birth,
            relationship
        })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') {
            throw new AppError('A profile with this name and DOB already exists.', 409);
        }
        throw new AppError(error.message, 500);
    }

    return data;
};

/**
 * Update an existing patient profile.
 */
export const updatePatientProfile = async (id, profileId, profileData) => {
    const { data, error } = await supabaseAdmin
        .from('patient_profiles')
        .update({
            ...profileData,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('profile_id', profileId)
        .select()
        .single();

    if (error) throw new AppError(error.message, 500);
    return data;
};

/**
 * Delete a patient profile.
 */
export const deletePatientProfile = async (id, profileId) => {
    const { error } = await supabaseAdmin
        .from('patient_profiles')
        .delete()
        .eq('id', id)
        .eq('profile_id', profileId);

    if (error) throw new AppError(error.message, 500);
    return { success: true };
};
