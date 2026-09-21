import api from "./api";

const updateProfile = async (profileData) => {
    const response = await api.patch(
        "/users/update-profile",
        profileData
    );

    return response.data;
};

const updateAvatar = async (file) => {
    const formData = new FormData();

    formData.append("avatar", file);

    const response = await api.patch(
        "/users/avatar",
        formData
    );

    return response.data;
};

const updateCoverImage = async (file) => {
    const formData = new FormData();

    formData.append("coverImage", file);

    const response = await api.patch(
        "/users/cover-image",
        formData
    );

    return response.data;
};

export {
    updateProfile,
    updateAvatar,
    updateCoverImage,
};