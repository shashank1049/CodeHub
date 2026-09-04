import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new ApiError(
                400,
                "Only JPG, JPEG, PNG and WebP images are allowed"
            ),
            false
        );
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter,
});

export default upload;