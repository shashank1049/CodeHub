import { Router } from "express";

import {
    getAllUsers,
    getAllProjects,
    deleteProjectByAdmin,
} from "../controllers/admin.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.get(
    "/users",
    verifyJWT,
    verifyAdmin,
    getAllUsers
);

router.get(
    "/projects",
    verifyJWT,
    verifyAdmin,
    getAllProjects
);

router.delete(
    "/projects/:projectId",
    verifyJWT,
    verifyAdmin,
    deleteProjectByAdmin
);

export default router;