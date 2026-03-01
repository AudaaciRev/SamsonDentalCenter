import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes (no login needed)
router.post('/register', register);
router.post('/login', login);

// Protected routes (login required)
router.get('/me', requireAuth, getProfile);
router.patch('/me', requireAuth, updateProfile);

export default router;
