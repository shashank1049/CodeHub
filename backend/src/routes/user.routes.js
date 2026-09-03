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
    getGithubRepositoryForUser,
    updateAvatar,
    updateCoverImage,

} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rateLimit.middleware.js";
import {
    validateRegister,
    validateLogin,
    validateChangePassword,
    validateUpdateProfile,
} from "../validators/user.validator.js";
import upload  from "../middlewares/upload.middleware.js";
// import { testCloudinaryUpload } from "../services/cloudinary.service.js";
// import {diagnoseCloudinaryUpload} from "../services/cloudinary.service.js";




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





// router.get("/cloudinary-test", async (req, res) => {
//     try {
//         const result = await testCloudinaryUpload();

//         return res.status(200).json({
//             success: true,
//             data: result,
//         });
//     } catch (error) {
//         console.error("Cloudinary direct upload failed:", error);

//         return res.status(error.http_code || 500).json({
//             success: false,
//             message: error.message,
//             http_code: error.http_code,
//         });
//     }
// });
// router.get("/cloudinary-diagnose", async (req, res) => {
//     try {
//         const result = await diagnoseCloudinaryUpload();

//         return res.status(200).json({
//             success: true,
//             data: result,
//         });
//     } catch (error) {
//         console.error("Cloudinary diagnostic failed:", error);

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// });






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
router.patch(
    "/avatar",
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
);

router.patch(
    "/cover-image",
    verifyJWT,
    upload.single("coverImage"),
    updateCoverImage
);







export default router;