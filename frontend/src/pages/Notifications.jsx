import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "../services/notification.service";

const getNotificationUser = (notification) => {
    return notification?.sender || notification?.user || null;
};

const getNotificationProjectId = (notification) => {
    return notification?.project?._id || notification?.project || null;
};

const getNotificationType = (notification) => {
    return String(notification?.type || "").toUpperCase();
};

const getFallbackMessage = (type, sender) => {
    const name = sender?.fullName || sender?.username || "Someone";

    if (type === "LIKE") return `${name} liked your project.`;
    if (type === "COMMENT") return `${name} commented on your project.`;
    if (type === "FOLLOW") return `${name} started following you.`;

    return "You have a new notification.";
};

const Notifications = () => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getNotifications();
            const data = response?.data || response;

            const list =
                data?.notifications ||
                data?.results ||
                (Array.isArray(data) ? data : []);

            setNotifications(list);

            setUnreadCount(
                data?.unreadCount ??
                data?.unread ??
                list.filter((item) => !item.isRead).length
            );
        } catch (error) {
            console.error("Failed to fetch notifications:", error);

            setError(
                error?.response?.data?.message ||
                "Failed to load notifications"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkRead = async (notification) => {
        if (!notification?._id || notification.isRead) return;

        try {
            await markNotificationAsRead(notification._id);

            setNotifications((current) =>
                current.map((item) =>
                    item._id === notification._id
                        ? { ...item, isRead: true }
                        : item
                )
            );

            setUnreadCount((current) => Math.max(current - 1, 0));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleMarkAllRead = async () => {
        if (unreadCount === 0) return;

        try {
            setActionLoading(true);

            await markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map((item) => ({
                    ...item,
                    isRead: true,
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);

            setError(
                error?.response?.data?.message ||
                "Failed to mark notifications as read"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await deleteNotification(notificationId);

            const deleted = notifications.find(
                (item) => item._id === notificationId
            );

            setNotifications((current) =>
                current.filter((item) => item._id !== notificationId)
            );

            if (deleted && !deleted.isRead) {
                setUnreadCount((current) => Math.max(current - 1, 0));
            }
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    const handleNotificationClick = async (notification) => {
        await handleMarkRead(notification);

        const type = getNotificationType(notification);
        const sender = getNotificationUser(notification);
        const projectId = getNotificationProjectId(notification);

        if (type === "FOLLOW" && sender?.username) {
            navigate(`/profile/${sender.username}`);
            return;
        }

        if (
            (type === "LIKE" || type === "COMMENT") &&
            projectId
        ) {
            navigate(`/projects/${projectId}`);
        }
    };

    const formatDate = (date) => {
        if (!date) return "";

        const value = new Date(date);

        if (Number.isNaN(value.getTime())) return "";

        return value.toLocaleString([], {
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div
                className="flex min-h-[70vh] items-center justify-center"
                style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                }}
            >
                Loading notifications...
            </div>
        );
    }

    return (
        <div
            className="min-h-screen px-4 py-10 sm:px-6"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <div className="mx-auto max-w-3xl">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Notifications
                        </h1>

                        <p
                            className="mt-1 text-sm"
                            style={{ color: "var(--muted)" }}
                        >
                            Stay updated with activity on CodeHub.
                        </p>

                        <p
                            className="mt-1 text-sm"
                            style={{ color: "var(--muted)" }}
                        >
                            {unreadCount} unread
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleMarkAllRead}
                        disabled={actionLoading || unreadCount === 0}
                        className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-80 disabled:opacity-40"
                        style={{
                            borderColor: "var(--border)",
                            backgroundColor: "var(--surface)",
                        }}
                    >
                        {actionLoading
                            ? "Updating..."
                            : "Mark all as read"}
                    </button>
                </div>

                {error && (
                    <div
                        className="mb-5 rounded-xl border p-4 text-sm"
                        style={{
                            borderColor: "var(--border)",
                            color: "var(--danger)",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {notifications.length === 0 ? (
                    <div
                        className="rounded-2xl border p-12 text-center"
                        style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border)",
                        }}
                    >
                        <div className="text-4xl">🔔</div>

                        <h2 className="mt-4 text-xl font-semibold">
                            No notifications
                        </h2>

                        <p
                            className="mt-2 text-sm"
                            style={{ color: "var(--muted)" }}
                        >
                            You are all caught up!
                        </p>
                    </div>
                ) : (

                    /* Notifications List */
                    <div
                        className="overflow-hidden rounded-2xl border"
                        style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border)",
                        }}
                    >
                        {notifications.map((notification, index) => {
                            const sender = getNotificationUser(notification);
                            const type = getNotificationType(notification);

                            return (
                                <div
                                    key={notification._id}
                                    className={`flex gap-4 p-4 transition hover:bg-black/[0.03] dark:hover:bg-white/[0.03] ${
                                        index < notifications.length - 1
                                            ? "border-b"
                                            : ""
                                    }`}
                                    style={{
                                        borderColor: "var(--border)",
                                        backgroundColor: notification.isRead
                                            ? "transparent"
                                            : "color-mix(in srgb, var(--primary) 6%, transparent)",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleNotificationClick(notification)
                                        }
                                        className="flex min-w-0 flex-1 gap-3 text-left"
                                    >
                                        {/* Avatar */}
                                        {sender?.avatar?.url ? (
                                            <img
                                                src={sender.avatar.url}
                                                alt={sender?.username || "User"}
                                                className="h-11 w-11 shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-semibold"
                                                style={{
                                                    backgroundColor: "var(--secondary)",
                                                    color: "var(--secondary-foreground)",
                                                }}
                                            >
                                                {(
                                                    sender?.fullName ||
                                                    sender?.username ||
                                                    "C"
                                                )
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                        {/* Message */}
                                        <div className="min-w-0">
                                            <p className="leading-6">
                                                {notification.message ||
                                                    getFallbackMessage(type, sender)}
                                            </p>

                                            <p
                                                className="mt-1 text-xs"
                                                style={{ color: "var(--muted)" }}
                                            >
                                                {formatDate(notification.createdAt)}
                                            </p>
                                        </div>

                                        {!notification.isRead && (
                                            <span
                                                className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor: "var(--primary)",
                                                }}
                                            />
                                        )}
                                    </button>

                                    {/* Delete */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(notification._id)
                                        }
                                        className="self-start rounded-lg px-2 py-1 text-sm hover:opacity-70"
                                        style={{ color: "var(--muted)" }}
                                        aria-label="Delete notification"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="mt-6">
                    <Link
                        to="/"
                        className="text-sm font-medium hover:underline"
                        style={{ color: "var(--muted)" }}
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Notifications;