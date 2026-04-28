import { Router } from 'express';
import { register, login, logout, getProfile, updateProfile, setPassword, sendGuestOTP, verifyGuestOTP, upgradeGuestToUser } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes (no login needed)
router.post('/register', register);
router.post('/login', login);
router.post('/set-password', setPassword);

// Guest OTP routes
router.post('/guest/send-otp', sendGuestOTP);
router.post('/guest/verify-otp', verifyGuestOTP);
router.post('/guest-to-user', upgradeGuestToUser);

// Protected routes (login required)
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getProfile);
router.patch('/me', requireAuth, updateProfile);

export default router;
