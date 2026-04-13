import { Router } from 'express';
import {
    getMyNotifications,
    unreadCount,
    markRead,
    markAllRead,
} from '../controllers/notifications.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/my', requireAuth, getMyNotifications); // GET all (or ?unread=true)
router.get('/unread-count', requireAuth, unreadCount); // GET badge count
router.patch('/read-all', requireAuth, markAllRead); // PATCH mark all read (before /:id)
router.patch('/:id/read', requireAuth, markRead); // PATCH mark one read

export default router;
