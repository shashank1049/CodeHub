import Project from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Comment from "../models/comment.model.js";
import {uploadToCloudinary, deleteFromCloudinary,} from "../services/cloudinary.service.js";





const createProject = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        techStack,
        githubUrl,
        liveUrl,
        thumbnail,
    } = req.body;

    if (!title || !description || !techStack) {
        throw new ApiError(
            400,
            "Title, description and tech stack are required"
        );
    }

    if (!Array.isArray(techStack) || techStack.length === 0) {
        throw new ApiError(
            400,
            "Tech stack must contain at least one technology"
        );
    }

    const project = await Project.create({
        title,
        description,
        techStack,
        githubUrl,
        liveUrl,
        thumbnail,
        owner: req.user._id,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            project,
            "Project created successfully"
        )
    );
});




const getAllProjects = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search,
        techStack,
        sortBy = "latest",
    } = req.query;

    const pageNumber = Math.max(
        parseInt(page, 10) || 1,
        1
    );

    const limitNumber = Math.min(
        Math.max(parseInt(limit, 10) || 10, 1),
        50
    );

    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};

    const escapeRegex = (value) => {
        return value.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
    };

    // Search
    if (search?.trim()) {
        const searchValue = escapeRegex(
            search.trim()
        );

        filter.$or = [
            {
                title: {
                    $regex: searchValue,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: searchValue,
                    $options: "i",
                },
            },
        ];
    }

    // Tech stack filter
    if (techStack?.trim()) {
        const techValue = escapeRegex(
            techStack.trim()
        );

        filter.techStack = {
            $regex: `^${techValue}$`,
            $options: "i",
        };
    }

    const allowedSortOptions = [
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

    // Base aggregation
    const pipeline = [
        {
            $match: filter,
        },

        // Calculate likes count
        {
            $addFields: {
                likesCount: {
                    $size: {
                        $ifNull: ["$likes", []],
                    },
                },
            },
        },

        // Calculate comments count
        {
            $lookup: {
                from: "comments",
                let: {
                    projectId: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    "$project",
                                    "$$projectId",
                                ],
                            },
                        },
                    },
                    {
                        $count: "count",
                    },
                ],
                as: "commentStats",
            },
        },

        {
            $addFields: {
                commentsCount: {
                    $ifNull: [
                        {
                            $arrayElemAt: [
                                "$commentStats.count",
                                0,
                            ],
                        },
                        0,
                    ],
                },
            },
        },

        // Remove temporary field
        {
            $project: {
                commentStats: 0,
            },
        },
    ];

    // Sorting
    if (sortBy === "latest") {
        pipeline.push({
            $sort: {
                createdAt: -1,
            },
        });
    }

    if (sortBy === "oldest") {
        pipeline.push({
            $sort: {
                createdAt: 1,
            },
        });
    }

    if (sortBy === "mostLiked") {
        pipeline.push({
            $sort: {
                likesCount: -1,
                createdAt: -1,
            },
        });
    }

    // Pagination
    pipeline.push(
        {
            $skip: skip,
        },
        {
            $limit: limitNumber,
        }
    );

    // Populate owner
    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $unwind: {
                path: "$owner",
                preserveNullAndEmptyArrays: true,
            },
        }
    );

    // Only expose required owner fields
    pipeline.push({
        $project: {
            title: 1,
            description: 1,
            techStack: 1,
            githubUrl: 1,
            liveUrl: 1,
            thumbnail: 1,

            owner: {
                _id: "$owner._id",
                fullName: "$owner.fullName",
                username: "$owner.username",
                avatar: "$owner.avatar",
                githubUsername:
                    "$owner.githubUsername",
            },

            likes: 1,
            likesCount: 1,
            commentsCount: 1,

            createdAt: 1,
            updatedAt: 1,
        },
    });

    const [projects, totalProjects] =
        await Promise.all([
            Project.aggregate(pipeline),
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
                    currentPage: pageNumber,
                    limit: limitNumber,
                    totalProjects,
                    totalPages,
                    hasNextPage:
                        pageNumber < totalPages,
                    hasPreviousPage:
                        pageNumber > 1,
                },
            },
            "Projects fetched successfully"
        )
    );
});



const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
        .populate(
            "owner",
            "fullName username avatar githubUsername"
        )
        .lean();

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const commentsCount = await Comment.countDocuments({
        project: projectId,
    });

    const likesCount = project.likes?.length || 0;

    const isLiked = req.user
        ? project.likes?.some(
              (userId) =>
                  userId.toString() ===
                  req.user._id.toString()
          )
        : false;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                ...project,
                likesCount,
                commentsCount,
                isLiked,
            },
            "Project fetched successfully"
        )
    );
});



const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const {
        title,
        description,
        techStack,
        githubUrl,
        liveUrl,
        thumbnail,
    } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to update this project"
        );
    }

    const updateData = {};

    if (title !== undefined) {
        updateData.title = title.trim();
    }

    if (description !== undefined) {
        updateData.description = description.trim();
    }

    if (techStack !== undefined) {
        if (!Array.isArray(techStack) || techStack.length === 0) {
            throw new ApiError(
                400,
                "Tech stack must contain at least one technology"
            );
        }

        updateData.techStack = techStack;
    }

    if (githubUrl !== undefined) {
        updateData.githubUrl = githubUrl.trim();
    }

    if (liveUrl !== undefined) {
        updateData.liveUrl = liveUrl.trim();
    }

    if (thumbnail !== undefined) {
        updateData.thumbnail = thumbnail.trim();
    }

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(
            400,
            "At least one field is required"
        );
    }

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            $set: updateData,
        },
        {
            new: true,
            runValidators: true,
        }
    ).populate(
        "owner",
        "fullName username avatar githubUsername"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedProject,
            "Project updated successfully"
        )
    );
});



const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to delete this project"
        );
    }

    await Project.findByIdAndDelete(projectId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Project deleted successfully"
        )
    );
});




const likeProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const alreadyLiked = project.likes.some(
        (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
        throw new ApiError(409, "Project already liked");
    }

    project.likes.push(userId);

    await project.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                likesCount: project.likes.length,
            },
            "Project liked successfully"
        )
    );
});


const unlikeProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const alreadyLiked = project.likes.some(
        (id) => id.toString() === userId.toString()
    );

    if (!alreadyLiked) {
        throw new ApiError(409, "Project is not liked yet");
    }

    project.likes = project.likes.filter(
        (id) => id.toString() !== userId.toString()
    );

    await project.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                likesCount: project.likes.length,
            },
            "Project unliked successfully"
        )
    );
});



const updateProjectThumbnail = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!req.file) {
        throw new ApiError(
            400,
            "Project thumbnail is required"
        );
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Only project owner can update thumbnail
    if (
        project.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to update this project thumbnail"
        );
    }

    const oldThumbnailPublicId =
        project.thumbnail?.publicId;

    const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "codehub/project-thumbnails"
    );

    project.thumbnail = {
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
    };

    await project.save({
        validateBeforeSave: false,
    });

    // Delete old thumbnail after DB update
    if (oldThumbnailPublicId) {
        try {
            await deleteFromCloudinary(
                oldThumbnailPublicId
            );
        } catch (error) {
            console.error(
                "Failed to delete old project thumbnail:",
                error
            );
        }
    }

    const updatedProject = await Project.findById(
        projectId
    )
        .populate(
            "owner",
            "fullName username avatar githubUsername"
        )
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedProject,
            "Project thumbnail updated successfully"
        )
    );
});



export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    likeProject,
    unlikeProject,
    updateProjectThumbnail,
};