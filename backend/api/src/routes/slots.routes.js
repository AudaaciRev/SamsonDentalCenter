import { Router } from 'express';
import {
    getAvailable,
    getSuggestions,
    getSuggestionsPublic,
    getAvailablePublic,
} from '../controllers/slots.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public route
router.get('/available/public', getAvailablePublic);
router.get('/suggest/public', getSuggestionsPublic);

// Private route
router.get('/available', requireAuth, getAvailable);
router.get('/suggest', requireAuth, getSuggestions);

export default router;
