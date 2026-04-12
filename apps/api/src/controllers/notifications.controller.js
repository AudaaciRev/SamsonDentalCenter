import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
} from '../services/notification.service.js';

/**
 * GET /api/notifications/my
 * Optional query: ?unread=true
 */
export const getMyNotifications = async (req, res, next) => {
    try {
        const unreadOnly = req.query.unread === 'true';
        const notifications = await getUserNotifications(req.user.id, unreadOnly);
        res.json({ notifications, total: notifications.length });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * GET /api/notifications/unread-count
 * Used by the frontend notification bell badge.
 */
export const unreadCount = async (req, res, next) => {
    try {
        const result = await getUnreadCount(req.user.id);
        res.json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * PATCH /api/notifications/:id/read
 */
export const markRead = async (req, res, next) => {
    try {
        const notification = await markAsRead(req.params.id, req.user.id);
        res.json({ message: 'Marked as read.', notification });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};

/**
 * PATCH /api/notifications/read-all
 */
export const markAllRead = async (req, res, next) => {
    try {
        const result = await markAllAsRead(req.user.id);
        res.json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};
