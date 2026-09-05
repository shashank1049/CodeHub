import api from "./api";

const registerUser = async (userData) => {
    const response = await api.post(
        "/users/register",
        userData
    );

    return response.data;
};

const loginUser = async (credentials) => {
    const response = await api.post(
        "/users/login",
        credentials
    );

    return response.data;
};

const logoutUser = async () => {
    const response = await api.post(
        "/users/logout"
    );

    return response.data;
};

const getCurrentUser = async () => {
    const response = await api.get(
        "/users/me"
    );

    return response.data;
};

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
};