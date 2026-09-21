import api from "./api";

const getNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};

const getUnreadNotificationCount = async () => {
    const response = await api.get(
        "/notifications/unread-count"
    );
    return response.data;
};

const markNotificationAsRead = async (notificationId) => {
    const response = await api.patch(
        `/notifications/${notificationId}/read`
    );
    return response.data;
};

const markAllNotificationsAsRead = async () => {
    const response = await api.patch(
        "/notifications/read-all"
    );
    return response.data;
};

const deleteNotification = async (notificationId) => {
    const response = await api.delete(
        `/notifications/${notificationId}`
    );
    return response.data;
};

export {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};