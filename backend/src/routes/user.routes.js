import { Router } from "express";
import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    updateProfile,
    getDeveloperProfile

} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyJWT,getCurrentUser)
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken)
router.patch(
    "/change-password",
    verifyJWT,
    changePassword
);
router.patch("/update-profile", verifyJWT, updateProfile)
router.get(
    "/:username",
    getDeveloperProfile
);



export default router;