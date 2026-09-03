import Notification from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
    getUserNotifications,
    getUnreadNotificationCount,
} from "../services/notification.service.js";






const getNotifications = asyncHandler(
    async (req, res) => {
        const { page = 1, limit = 20 } = req.query;

        const result = await getUserNotifications(
            req.user._id,
            page,
            limit
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                result,
                "Notifications fetched successfully"
            )
        );
    }
);



const getUnreadCount = asyncHandler(
    async (req, res) => {
        const unreadCount =
            await getUnreadNotificationCount(
                req.user._id
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                { unreadCount },
                "Unread notification count fetched successfully"
            )
        );
    }
);



const markNotificationAsRead = asyncHandler(
    async (req, res) => {
        const { notificationId } = req.params;

        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: notificationId,
                    recipient: req.user._id,
                },
                {
                    $set: {
                        isRead: true,
                    },
                },
                {
                    new: true,
                }
            );

        if (!notification) {
            throw new ApiError(
                404,
                "Notification not found"
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                notification,
                "Notification marked as read"
            )
        );
    }
);



const markAllNotificationsAsRead = asyncHandler(
    async (req, res) => {
        const result =
            await Notification.updateMany(
                {
                    recipient: req.user._id,
                    isRead: false,
                },
                {
                    $set: {
                        isRead: true,
                    },
                }
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    modifiedCount:
                        result.modifiedCount,
                },
                "All notifications marked as read"
            )
        );
    }
);




const deleteNotification = asyncHandler(
    async (req, res) => {
        const { notificationId } = req.params;

        const notification =
            await Notification.findOneAndDelete({
                _id: notificationId,
                recipient: req.user._id,
            });

        if (!notification) {
            throw new ApiError(
                404,
                "Notification not found"
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Notification deleted successfully"
            )
        );
    }
);



export {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};