import { Router } from 'express';
import * as profilesController from '../controllers/profiles.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// All profile routes require authentication
router.use(requireAuth);

router.get('/', profilesController.getProfiles);
router.get('/:id', profilesController.getProfile);
router.post('/', profilesController.createProfile);
router.patch('/:id', profilesController.updateProfile);
router.delete('/:id', profilesController.deleteProfile);

export default router;
