import Comment from "../models/comment.model.js";
import Project from "../models/project.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";




const createComment = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(
            400,
            "Comment content is required"
        );
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(
            404,
            "Project not found"
        );
    }

    const comment = await Comment.create({
        content: content.trim(),
        project: projectId,
        owner: req.user._id,
    });

    const createdComment = await Comment.findById(
        comment._id
    ).populate(
        "owner",
        "fullName username avatar"
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            createdComment,
            "Comment added successfully"
        )
    );
});


const getProjectComments = asyncHandler(
    async (req, res) => {
        const { projectId } = req.params;

        const project = await Project.exists({
            _id: projectId,
        });

        if (!project) {
            throw new ApiError(
                404,
                "Project not found"
            );
        }

        const comments = await Comment.find({
            project: projectId,
        })
            .populate(
                "owner",
                "fullName username avatar"
            )
            .sort({
                createdAt: -1,
            })
            .lean();

        return res.status(200).json(
            new ApiResponse(
                200,
                comments,
                "Comments fetched successfully"
            )
        );
    }
);


const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(
            400,
            "Comment content is required"
        );
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(
            404,
            "Comment not found"
        );
    }

    // Only comment owner can update it
    if (
        comment.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to update this comment"
        );
    }

    comment.content = content.trim();

    await comment.save();

    const updatedComment = await Comment.findById(
        comment._id
    ).populate(
        "owner",
        "fullName username avatar"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedComment,
            "Comment updated successfully"
        )
    );
});


const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(
            404,
            "Comment not found"
        );
    }

    // Only comment owner can delete it
    if (
        comment.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to delete this comment"
        );
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Comment deleted successfully"
        )
    );
});






export {
    createComment,
    getProjectComments,
    updateComment,
    deleteComment,
}