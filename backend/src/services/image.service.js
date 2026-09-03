import {
    uploadToCloudinary,
    deleteFromCloudinary,
} from "./cloudinary.service.js";

const uploadImage = async (fileBuffer, folder) => {
    return await uploadToCloudinary(
        fileBuffer,
        folder
    );
};

const deleteImage = async (publicId) => {
    return await deleteFromCloudinary(publicId);
};

export {
    uploadImage,
    deleteImage,
};