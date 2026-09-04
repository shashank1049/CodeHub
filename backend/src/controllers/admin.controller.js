import User from "../models/user.model.js";
import Project from "../models/project.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteImage } from "../services/image.service.js";

const getAllUsers = asyncHandler(
    async (req, res) => {
        const {
            page = 1,
            limit = 20,
            search = "",
        } = req.query;

        const pageNumber = Math.max(
            parseInt(page, 10) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(
                parseInt(limit, 10) || 20,
                1
            ),
            50
        );

        const skip =
            (pageNumber - 1) *
            limitNumber;

        const filter = {};

        if (search.trim()) {
            const searchRegex = new RegExp(
                search
                    .trim()
                    .replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    ),
                "i"
            );

            filter.$or = [
                {
                    username: searchRegex,
                },
                {
                    fullName: searchRegex,
                },
                {
                    email: searchRegex,
                },
            ];
        }

        const [
            users,
            totalUsers,
        ] = await Promise.all([
            User.find(filter)
                .select(
                    "-password -refreshToken"
                )
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(limitNumber),

            User.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(
            totalUsers / limitNumber
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    users,
                    pagination: {
                        currentPage:
                            pageNumber,
                        limit:
                            limitNumber,
                        totalUsers,
                        totalPages,
                        hasNextPage:
                            pageNumber <
                            totalPages,
                        hasPreviousPage:
                            pageNumber > 1,
                    },
                },
                "Users fetched successfully"
            )
        );
    }
);

const getAllProjects = asyncHandler(
    async (req, res) => {
        const {
            page = 1,
            limit = 20,
            search = "",
        } = req.query;

        const pageNumber = Math.max(
            parseInt(page, 10) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(
                parseInt(limit, 10) || 20,
                1
            ),
            50
        );

        const skip =
            (pageNumber - 1) *
            limitNumber;

        const filter = {};

        if (search.trim()) {
            const searchRegex = new RegExp(
                search
                    .trim()
                    .replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    ),
                "i"
            );

            filter.$or = [
                {
                    title: searchRegex,
                },
                {
                    description:
                        searchRegex,
                },
                {
                    techStack: searchRegex,
                },
            ];
        }

        const [
            projects,
            totalProjects,
        ] = await Promise.all([
            Project.find(filter)
                .populate(
                    "owner",
                    "fullName username avatar"
                )
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(limitNumber),

            Project.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(
            totalProjects / limitNumber
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    projects,
                    pagination: {
                        currentPage:
                            pageNumber,
                        limit:
                            limitNumber,
                        totalProjects,
                        totalPages,
                        hasNextPage:
                            pageNumber <
                            totalPages,
                        hasPreviousPage:
                            pageNumber > 1,
                    },
                },
                "Projects fetched successfully"
            )
        );
    }
);

const deleteProjectByAdmin = asyncHandler(
    async (req, res) => {
        const { projectId } = req.params;

        const project =
            await Project.findById(
                projectId
            );

        if (!project) {
            throw new ApiError(
                404,
                "Project not found"
            );
        }

        const thumbnailPublicId =
            project.thumbnail?.publicId;

        await Project.findByIdAndDelete(
            projectId
        );

        if (thumbnailPublicId) {
            try {
                await deleteImage(
                    thumbnailPublicId
                );
            } catch (error) {
                console.error(
                    "Failed to delete project thumbnail from Cloudinary:",
                    error
                );
            }
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Project deleted successfully"
            )
        );
    }
);

export {
    getAllUsers,
    getAllProjects,
    deleteProjectByAdmin,
};