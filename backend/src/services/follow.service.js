import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const followUser = async (followerId, username) => {
    const userToFollow = await User.findOne({
        username: username.toLowerCase(),
    });

    if (!userToFollow) {
        throw new ApiError(404, "User not found");
    }

    if (
        followerId.toString() ===
        userToFollow._id.toString()
    ) {
        throw new ApiError(
            400,
            "You cannot follow yourself"
        );
    }

    const existingFollow = await Follow.findOne({
        follower: followerId,
        following: userToFollow._id,
    });

    if (existingFollow) {
        throw new ApiError(
            409,
            "You are already following this user"
        );
    }

    const follow = await Follow.create({
        follower: followerId,
        following: userToFollow._id,
    });

    return {
        follow,
        followedUser: userToFollow,
    };
};

const unfollowUser = async (
    followerId,
    username
) => {
    const userToUnfollow = await User.findOne({
        username: username.toLowerCase(),
    });

    if (!userToUnfollow) {
        throw new ApiError(404, "User not found");
    }

    const follow = await Follow.findOneAndDelete({
        follower: followerId,
        following: userToUnfollow._id,
    });

    if (!follow) {
        throw new ApiError(
            404,
            "You are not following this user"
        );
    }

    return follow;
};

const getFollowers = async (
    username,
    page = 1,
    limit = 20
) => {
    const user = await User.findOne({
        username: username.toLowerCase(),
    }).select("_id");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const pageNumber = Math.max(
        parseInt(page, 10) || 1,
        1
    );

    const limitNumber = Math.min(
        Math.max(parseInt(limit, 10) || 20, 1),
        50
    );

    const skip =
        (pageNumber - 1) * limitNumber;

    const [followers, totalFollowers] =
        await Promise.all([
            Follow.find({
                following: user._id,
            })
                .populate(
                    "follower",
                    "fullName username avatar bio"
                )
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            Follow.countDocuments({
                following: user._id,
            }),
        ]);

    const totalPages = Math.ceil(
        totalFollowers / limitNumber
    );

    return {
        followers: followers.map(
            (follow) => follow.follower
        ),
        pagination: {
            currentPage: pageNumber,
            limit: limitNumber,
            totalFollowers,
            totalPages,
            hasNextPage:
                pageNumber < totalPages,
            hasPreviousPage:
                pageNumber > 1,
        },
    };
};

const getFollowing = async (
    username,
    page = 1,
    limit = 20
) => {
    const user = await User.findOne({
        username: username.toLowerCase(),
    }).select("_id");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const pageNumber = Math.max(
        parseInt(page, 10) || 1,
        1
    );

    const limitNumber = Math.min(
        Math.max(parseInt(limit, 10) || 20, 1),
        50
    );

    const skip =
        (pageNumber - 1) * limitNumber;

    const [following, totalFollowing] =
        await Promise.all([
            Follow.find({
                follower: user._id,
            })
                .populate(
                    "following",
                    "fullName username avatar bio"
                )
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            Follow.countDocuments({
                follower: user._id,
            }),
        ]);

    const totalPages = Math.ceil(
        totalFollowing / limitNumber
    );

    return {
        following: following.map(
            (follow) => follow.following
        ),
        pagination: {
            currentPage: pageNumber,
            limit: limitNumber,
            totalFollowing,
            totalPages,
            hasNextPage:
                pageNumber < totalPages,
            hasPreviousPage:
                pageNumber > 1,
        },
    };
};

const getFollowStats = async (
    targetUserId,
    currentUserId = null
) => {
    const [followersCount, followingCount] =
        await Promise.all([
            Follow.countDocuments({
                following: targetUserId,
            }),

            Follow.countDocuments({
                follower: targetUserId,
            }),
        ]);

    let isFollowing = false;

    if (currentUserId) {
        isFollowing = Boolean(
            await Follow.exists({
                follower: currentUserId,
                following: targetUserId,
            })
        );
    }

    return {
        followersCount,
        followingCount,
        isFollowing,
    };
};

export {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowStats,
};