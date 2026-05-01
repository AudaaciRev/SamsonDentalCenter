import crypto from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { sendOTPEmail } from './email-confirmation.service.js';

/**
 * Generate a 6-digit random OTP.
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send an OTP to a guest email.
 * Saves to guest_otp_codes table.
 *
 * @param {string} email - Guest email
 * @param {string} name - Guest name
 */
export const sendOTP = async (email, name) => {
    const otpCode = generateOTP();
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Create OTP record
    const { error } = await supabaseAdmin.from('guest_otp_codes').insert({
        email: normalizedEmail,
        otp_code: otpCode,
        expires_at: new Date(Date.now() + 10 * 60000).toISOString(), // 10 minutes
    });

    if (error) {
        console.error('Failed to save OTP:', error.message);
        throw new AppError('Failed to generate verification code.', 500);
    }

    // 2. Send Email (non-blocking)
    sendOTPEmail(normalizedEmail, name, otpCode).catch((err) => {
        console.error('Failed to send OTP email:', err.message);
    });

    return { message: 'Verification code sent to your email.' };
};

/**
 * Verify an OTP.
 *
 * @param {string} email - Guest email
 * @param {string} code - 6-digit code
 * @returns {object} { verification_token }
 */
export const verifyOTP = async (email, code) => {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find the latest valid OTP for this email
    const { data: otpRecord, error } = await supabaseAdmin
        .from('guest_otp_codes')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('otp_code', code)
        .eq('is_verified', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !otpRecord) {
        throw new AppError('Invalid or expired verification code.', 401);
    }

    // 2. Generate a verification token (32-char hex)
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 3. Mark as verified and store the token
    const { error: updateError } = await supabaseAdmin
        .from('guest_otp_codes')
        .update({
            is_verified: true,
            verification_token: verificationToken,
            verified_at: new Date().toISOString(),
        })
        .eq('id', otpRecord.id);

    if (updateError) {
        console.error('Failed to update OTP record:', updateError.message);
        throw new AppError('Failed to verify code.', 500);
    }

    return { 
        email: normalizedEmail,
        verification_token: verificationToken 
    };
};

/**
 * Middleware-style helper to verify if a guest token is valid for a given email.
 *
 * @param {string} email - Guest email
 * @param {string} token - Verification token
 * @returns {boolean}
 */
export const validateGuestVerification = async (email, token) => {
    const normalizedEmail = email.toLowerCase().trim();

    const { data, error } = await supabaseAdmin
        .from('guest_otp_codes')
        .select('id')
        .eq('email', normalizedEmail)
        .eq('verification_token', token)
        .eq('is_verified', true)
        // Token remains valid for 30 minutes after verification for the booking step
        .gt('verified_at', new Date(Date.now() - 30 * 60000).toISOString())
        .single();

    return !!data && !error;
};
