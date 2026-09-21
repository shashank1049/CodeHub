import api from "./api";

const followUser = async (username) => {
    const response = await api.post(
        `/follows/${username}`
    );

    return response.data;
};

const unfollowUser = async (username) => {
    const response = await api.delete(
        `/follows/${username}`
    );

    return response.data;
};

const getFollowStats = async (username) => {
    const response = await api.get(
        `/follows/${username}/stats`
    );

    return response.data;
};

const getFollowers = async (username) => {
    const response = await api.get(
        `/follows/${username}/followers`
    );

    return response.data;
};

const getFollowing = async (username) => {
    const response = await api.get(
        `/follows/${username}/following`
    );

    return response.data;
};

export {
    followUser,
    unfollowUser,
    getFollowStats,
    getFollowers,
    getFollowing,
};