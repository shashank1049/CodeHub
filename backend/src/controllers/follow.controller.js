import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowStats,
} from "../services/follow.service.js";
import {
    createNotification,
} from "../services/notification.service.js";
import User from "../models/user.model.js";



const follow = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const { follow: createdFollow, followedUser } =
        await followUser(
            req.user._id,
            username
        );

    await createNotification({
        recipient: followedUser._id,
        sender: req.user._id,
        type: "FOLLOW",
        message: `${req.user.username} started following you`,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            createdFollow,
            "User followed successfully"
        )
    );
});

const unfollow = asyncHandler(async (req, res) => {
    const { username } = req.params;

    await unfollowUser(
        req.user._id,
        username
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "User unfollowed successfully"
        )
    );
});

const getUserFollowers = asyncHandler(
    async (req, res) => {
        const { username } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const result = await getFollowers(
            username,
            page,
            limit
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                result,
                "Followers fetched successfully"
            )
        );
    }
);

const getUserFollowing = asyncHandler(
    async (req, res) => {
        const { username } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const result = await getFollowing(
            username,
            page,
            limit
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                result,
                "Following list fetched successfully"
            )
        );
    }
);

const getUserFollowStats = asyncHandler(
    async (req, res) => {
        const { username } = req.params;

        const user = await User.findOne({
            username: username.toLowerCase(),
        }).select("_id");

        if (!user) {
            throw new ApiError(
                404,
                "User not found"
            );
        }

        const stats = await getFollowStats(
            user._id,
            req.user?._id || null
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                stats,
                "Follow stats fetched successfully"
            )
        );
    }
);

export {
    follow,
    unfollow,
    getUserFollowers,
    getUserFollowing,
    getUserFollowStats,
};