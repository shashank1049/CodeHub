import { Router } from "express";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    likeProject,
    unlikeProject,
    updateProjectThumbnail,
} from "../controllers/project.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    validateCreateProject,
    validateUpdateProject,
} from "../validators/project.validator.js";




const router = Router();

router.post(
    "/",
    verifyJWT,validateCreateProject,
    createProject
);


router.patch(
    "/:projectId/thumbnail",
    verifyJWT,
    upload.single("thumbnail"),
    updateProjectThumbnail
);

router.get("/:projectId", optionalAuth, getProjectById);
router.patch("/:projectId", verifyJWT, validateUpdateProject, updateProject);
router.delete("projectId", verifyJWT, deleteProject);
router.post( "/:projectId/like", verifyJWT, likeProject);

router.delete( "/:projectId/like", verifyJWT, unlikeProject);
router.get("/",verifyJWT, getAllProjects)







export default router;