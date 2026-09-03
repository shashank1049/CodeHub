import Notification from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";

const createNotification = async ({
    recipient,
    sender,
    type,
    project = null,
    comment = null,
    message,
}) => {
    if (!recipient || !sender || !type || !message) {
        throw new ApiError(
            400,
            "Invalid notification data"
        );
    }

    // Don't notify user about their own action
    if (recipient.toString() === sender.toString()) {
        return null;
    }

    const notification = await Notification.create({
        recipient,
        sender,
        type,
        project,
        comment,
        message,
    });

    return notification;
};

const getUserNotifications = async (
    userId,
    page = 1,
    limit = 20
) => {
    const pageNumber = Math.max(
        parseInt(page, 10) || 1,
        1
    );

    const limitNumber = Math.min(
        Math.max(parseInt(limit, 10) || 20, 1),
        50
    );

    const skip =
        (pageNumber - 1) * limitNumber;

    const [
        notifications,
        totalNotifications,
        unreadCount,
    ] = await Promise.all([
        Notification.find({
            recipient: userId,
        })
            .populate(
                "sender",
                "username fullName avatar"
            )
            .populate(
                "project",
                "title thumbnail"
            )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber),

        Notification.countDocuments({
            recipient: userId,
        }),

        Notification.countDocuments({
            recipient: userId,
            isRead: false,
        }),
    ]);

    const totalPages = Math.ceil(
        totalNotifications / limitNumber
    );

    return {
        notifications,
        pagination: {
            currentPage: pageNumber,
            limit: limitNumber,
            totalNotifications,
            totalPages,
            hasNextPage: pageNumber < totalPages,
            hasPreviousPage: pageNumber > 1,
        },
        unreadCount,
    };
};

const getUnreadNotificationCount = async (
    userId
) => {
    return await Notification.countDocuments({
        recipient: userId,
        isRead: false,
    });
};

export {
    createNotification,
    getUserNotifications,
    getUnreadNotificationCount,
};