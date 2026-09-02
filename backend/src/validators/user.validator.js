import { ApiError } from "../utils/ApiError.js";
import { validatePassword } from "../utils/validatePasseord.js";


// Register validation
const validateRegister = (req, res, next) => {
    const {
        fullName,
        username,
        email,
        password,
    } = req.body;

    if (!fullName?.trim()) {
        throw new ApiError(
            400,
            "Full name is required"
        );
    }

    if (!username?.trim()) {
        throw new ApiError(
            400,
            "Username is required"
        );
    }

    if (!email?.trim()) {
        throw new ApiError(
            400,
            "Email is required"
        );
    }

    if (!password) {
        throw new ApiError(
            400,
            "Password is required"
        );
    }

    if (!validatePassword(password)) {
        throw new ApiError(
            400,
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        );
    }

    next();
};


// Login validation
const validateLogin = (req, res, next) => {
    const {
        email,
        username,
        password,
    } = req.body;

    if (!email?.trim() && !username?.trim()) {
        throw new ApiError(
            400,
            "Email or username is required"
        );
    }

    if (!password) {
        throw new ApiError(
            400,
            "Password is required"
        );
    }

    next();
};


// Change password validation
const validateChangePassword = (req, res, next) => {
    const {
        oldPassword,
        newPassword,
    } = req.body;

    if (!oldPassword) {
        throw new ApiError(
            400,
            "Old password is required"
        );
    }

    if (!newPassword) {
        throw new ApiError(
            400,
            "New password is required"
        );
    }

    if (!validatePassword(newPassword)) {
        throw new ApiError(
            400,
            "New password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        );
    }

    if (oldPassword === newPassword) {
        throw new ApiError(
            400,
            "New password must be different from old password"
        );
    }

    next();
};


// Update profile validation
const validateUpdateProfile = (req, res, next) => {
    const allowedFields = [
        "fullName",
        "bio",
        "githubUsername",
        "avatar",
        "coverImage",
    ];

    const providedFields = Object.keys(req.body);

    const hasValidField = providedFields.some(
        (field) => allowedFields.includes(field)
    );

    if (!hasValidField) {
        throw new ApiError(
            400,
            "No valid profile fields provided"
        );
    }

    next();
};


export {
    validateRegister,
    validateLogin,
    validateChangePassword,
    validateUpdateProfile,
};