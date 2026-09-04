import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import {
    searchUsers,
    searchProjects,
    searchAll,
} from "../services/search.service.js";

const searchUsersController = asyncHandler(
    async (req, res) => {
        const { q } = req.query;
        const { page = 1, limit = 10 } = req.query;

        if (!q?.trim()) {
            throw new ApiError(
                400,
                "Search query is required"
            );
        }

        const result = await searchUsers(
            q.trim(),
            page,
            limit
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                result,
                "Users search completed successfully"
            )
        );
    }
);

const searchProjectsController = asyncHandler(
    async (req, res) => {
        const {
            q,
            page = 1,
            limit = 10,
            techStack = "",
            sortBy = "relevance",
        } = req.query;

        if (!q?.trim()) {
            throw new ApiError(
                400,
                "Search query is required"
            );
        }

        const allowedSortOptions = [
            "relevance",
            "latest",
            "oldest",
            "mostLiked",
        ];

        if (!allowedSortOptions.includes(sortBy)) {
            throw new ApiError(
                400,
                "Invalid sort option"
            );
        }

        const result = await searchProjects(
            q.trim(),
            page,
            limit,
            techStack,
            sortBy
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                result,
                "Projects search completed successfully"
            )
        );
    }
);


const searchAllController = asyncHandler(
    async (req, res) => {
        const { q } = req.query;
        const { page = 1, limit = 10 } = req.query;

        if (!q?.trim()) {
            throw new ApiError(
                400,
                "Search query is required"
            );
        }

        const result = await searchAll(
            q.trim(),
            page,
            limit
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                result,
                "Search completed successfully"
            )
        );
    }
);

export {
    searchUsersController,
    searchProjectsController,
    searchAllController,
};