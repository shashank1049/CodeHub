import { Router } from "express";

import {
    follow,
    unfollow,
    getUserFollowers,
    getUserFollowing,
    getUserFollowStats,
} from "../controllers/follow.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";

const router = Router();

// Follow / Unfollow
router.post(
    "/:username",
    verifyJWT,
    follow
);

router.delete(
    "/:username",
    verifyJWT,
    unfollow
);

// Followers / Following
router.get(
    "/:username/followers",
    getUserFollowers
);

router.get(
    "/:username/following",
    getUserFollowing
);

// Follow stats
router.get(
    "/:username/stats",
    optionalAuth,
    getUserFollowStats
);

export default router;