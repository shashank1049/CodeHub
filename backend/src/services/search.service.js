import User from "../models/user.model.js";
import Project from "../models/project.model.js";

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const searchUsers = async (
    query,
    page = 1,
    limit = 10
) => {
    const pageNumber = Math.max(
        parseInt(page, 10) || 1,
        1
    );

    const limitNumber = Math.min(
        Math.max(parseInt(limit, 10) || 10, 1),
        50
    );

    const skip =
        (pageNumber - 1) * limitNumber;

    const searchRegex = new RegExp(
        escapeRegex(query),
        "i"
    );

    const filter = {
        $or: [
            { username: searchRegex },
            { fullName: searchRegex },
            { bio: searchRegex },
        ],
    };

    const [users, totalUsers] =
        await Promise.all([
            User.find(filter)
                .select(
                    "fullName username avatar bio githubUsername"
                )
                .sort({ username: 1 })
                .skip(skip)
                .limit(limitNumber),

            User.countDocuments(filter),
        ]);

    const totalPages = Math.ceil(
        totalUsers / limitNumber
    );

    return {
        users,
        pagination: {
            currentPage: pageNumber,
            limit: limitNumber,
            totalUsers,
            totalPages,
            hasNextPage:
                pageNumber < totalPages,
            hasPreviousPage:
                pageNumber > 1,
        },
    };
};

const searchProjects = async (
    query,
    page = 1,
    limit = 10,
    techStack = "",
    sortBy = "relevance"
) => {
    const pageNumber = Math.max(
        parseInt(page, 10) || 1,
        1
    );

    const limitNumber = Math.min(
        Math.max(parseInt(limit, 10) || 10, 1),
        50
    );

    const skip =
        (pageNumber - 1) * limitNumber;

    const safeQuery = escapeRegex(query.trim());

    const searchRegex = new RegExp(
        safeQuery,
        "i"
    );

    const filter = {
        $or: [
            { title: searchRegex },
            { description: searchRegex },
            { techStack: searchRegex },
        ],
    };

    if (techStack?.trim()) {
        filter.techStack = {
            $regex: `^${escapeRegex(
                techStack.trim()
            )}$`,
            $options: "i",
        };
    }

    let sort = {
        createdAt: -1,
    };

    if (sortBy === "oldest") {
        sort = {
            createdAt: 1,
        };
    }

    if (sortBy === "mostLiked") {
        sort = {
            likesCount: -1,
            createdAt: -1,
        };
    }

    if (sortBy === "relevance") {
        sort = {
            relevanceScore: -1,
            createdAt: -1,
        };
    }

    const projects = await Project.aggregate([
        {
            $match: filter,
        },

        {
            $addFields: {
                relevanceScore: {
                    $add: [
                        {
                            $cond: [
                                {
                                    $regexMatch: {
                                        input: "$title",
                                        regex: `^${safeQuery}$`,
                                        options: "i",
                                    },
                                },
                                100,
                                0,
                            ],
                        },

                        {
                            $cond: [
                                {
                                    $regexMatch: {
                                        input: "$title",
                                        regex: `^${safeQuery}`,
                                        options: "i",
                                    },
                                },
                                50,
                                0,
                            ],
                        },

                        {
                            $cond: [
                                {
                                    $regexMatch: {
                                        input: "$title",
                                        regex: safeQuery,
                                        options: "i",
                                    },
                                },
                                30,
                                0,
                            ],
                        },

                        {
                            $cond: [
                                {
                                    $regexMatch: {
                                        input: "$description",
                                        regex: safeQuery,
                                        options: "i",
                                    },
                                },
                                10,
                                0,
                            ],
                        },

                        {
                            $cond: [
                                {
                                    $in: [
                                        query,
                                        "$techStack",
                                    ],
                                },
                                5,
                                0,
                            ],
                        },
                    ],
                },

                likesCount: {
                    $size: "$likes",
                },
            },
        },

        {
            $sort: sort,
        },

        {
            $skip: skip,
        },

        {
            $limit: limitNumber,
        },

        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },

        {
            $unwind: "$owner",
        },

        {
            $project: {
                title: 1,
                description: 1,
                techStack: 1,
                githubUrl: 1,
                liveUrl: 1,
                thumbnail: 1,
                likes: 1,
                createdAt: 1,
                updatedAt: 1,

                relevanceScore: 1,

                owner: {
                    _id: 1,
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                },
            },
        },
    ]);

    const totalProjects =
        await Project.countDocuments(filter);

    const totalPages = Math.ceil(
        totalProjects / limitNumber
    );

    return {
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
    };
};

const searchAll = async (
    query,
    page = 1,
    limit = 10
) => {
    const [users, projects] =
        await Promise.all([
            searchUsers(
                query,
                page,
                limit
            ),

            searchProjects(
                query,
                page,
                limit
            ),
        ]);

    return {
        users,
        projects,
    };
};

export {
    searchUsers,
    searchProjects,
    searchAll,
};