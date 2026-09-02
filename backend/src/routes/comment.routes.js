import { Router } from "express";

import {
    createComment,
    getProjectComments,
    updateComment,
    deleteComment,
} from "../controllers/comment.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
    "/project/:projectId",
    getProjectComments
);

router.post(
    "/project/:projectId",
    verifyJWT,
    createComment
);

router.patch(
    "/:commentId",
    verifyJWT,
    updateComment
);

router.delete(
    "/:commentId",
    verifyJWT,
    deleteComment
);

export default router;