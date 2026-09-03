import { Router } from "express";

import {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "../controllers/notification.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Get user's notifications
router.get(
    "/",
    verifyJWT,
    getNotifications
);

// Get unread notification count
router.get(
    "/unread-count",
    verifyJWT,
    getUnreadCount
);

// Mark all notifications as read
router.patch(
    "/read-all",
    verifyJWT,
    markAllNotificationsAsRead
);

// Mark single notification as read
router.patch(
    "/:notificationId/read",
    verifyJWT,
    markNotificationAsRead
);

// Delete single notification
router.delete(
    "/:notificationId",
    verifyJWT,
    deleteNotification
);

export default router;