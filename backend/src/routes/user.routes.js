import { Router } from "express";
import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    updateProfile,
    getDeveloperProfile,
    getGithubRepositoriesForUser,
    getGithubRepositoryForUser

} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rateLimit.middleware.js";
import {
    validateRegister,
    validateLogin,
    validateChangePassword,
    validateUpdateProfile,
} from "../validators/user.validator.js";





const router = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    maxRequests: 10,
    message: "Too many login attempts, please try again later",
});
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: "Too many registration attempts, please try again later",
});

const githubLimiter = rateLimit({
    windowMs: 60 * 1000,
    maxRequests: 30,
    message: "Too many GitHub requests, please try again later",
});





router.post("/register",registerLimiter,validateRegister, registerUser);
router.post("/login",loginLimiter,validateLogin, loginUser);
router.get("/me", verifyJWT,getCurrentUser)
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken)
router.patch(
    "/change-password",
    verifyJWT,validateChangePassword,
    changePassword
);
router.patch("/update-profile", verifyJWT,validateUpdateProfile, updateProfile)
router.get(
    "/:username/github/:repoName", githubLimiter,
    getGithubRepositoryForUser
);
router.get(
    "/:username/github", githubLimiter,
    getGithubRepositoriesForUser
);
router.get(
    "/:username",
    getDeveloperProfile
);




export default router;