import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

import connectDB from "../db/index.js";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";

const migrateImages = async () => {
    try {
        await connectDB();

        console.log("Starting image migration...");

        // -------------------------
        // USERS
        // -------------------------

        const userResult = await User.collection.updateMany(
            {
                $or: [
                    { avatar: { $type: "string" } },
                    { coverImage: { $type: "string" } },
                ],
            },
            [
                {
                    $set: {
                        avatar: {
                            $cond: [
                                {
                                    $eq: [
                                        { $type: "$avatar" },
                                        "string",
                                    ],
                                },
                                {
                                    url: "$avatar",
                                    publicId: "",
                                },
                                "$avatar",
                            ],
                        },

                        coverImage: {
                            $cond: [
                                {
                                    $eq: [
                                        { $type: "$coverImage" },
                                        "string",
                                    ],
                                },
                                {
                                    url: "$coverImage",
                                    publicId: "",
                                },
                                "$coverImage",
                            ],
                        },
                    },
                },
            ]
        );

        console.log(
            `Users migrated: ${userResult.modifiedCount}`
        );

        // -------------------------
        // PROJECTS
        // -------------------------

        const projectResult =
            await Project.collection.updateMany(
                {
                    thumbnail: {
                        $type: "string",
                    },
                },
                [
                    {
                        $set: {
                            thumbnail: {
                                url: "$thumbnail",
                                publicId: "",
                            },
                        },
                    },
                ]
            );

        console.log(
            `Projects migrated: ${projectResult.modifiedCount}`
        );

        console.log(
            "Image migration completed successfully"
        );

        process.exit(0);
    } catch (error) {
        console.error(
            "Image migration failed:",
            error
        );

        process.exit(1);
    }
};

migrateImages();