import { Router } from "express";

import {
    createComment,
    getProjectComments,
    updateComment,
    deleteComment,
} from "../controllers/comment.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    validateCreateComment,
    validateUpdateComment,
} from "../validators/comment.validator.js";




const router = Router();

router.get(
    "/project/:projectId",
    getProjectComments
);

router.post(
    "/project/:projectId",
    verifyJWT,
    validateCreateComment,
    createComment
);

router.patch(
    "/:commentId",
    verifyJWT,
    validateUpdateComment,
    updateComment
);

router.delete(
    "/:commentId",
    verifyJWT,
    deleteComment
);

export default router;