import { Router } from "express";

import {
    searchUsersController,
    searchProjectsController,
    searchAllController,
} from "../controllers/search.controller.js";

const router = Router();

router.get(
    "/users",
    searchUsersController
);

router.get(
    "/projects",
    searchProjectsController
);

router.get(
    "/",
    searchAllController
);

export default router;