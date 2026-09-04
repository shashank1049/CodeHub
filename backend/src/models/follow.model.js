import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
    {
        follower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        following: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate follow relationships
followSchema.index(
    {
        follower: 1,
        following: 1,
    },
    {
        unique: true,
    }
);

// Prevent self-follow
followSchema.pre("validate", async function () {
    if (
        this.follower &&
        this.following &&
        this.follower.toString() ===
            this.following.toString()
    ) {
        throw new Error(
            "Users cannot follow themselves"
        );
    }
});

const Follow = mongoose.model(
    "Follow",
    followSchema
);

export default Follow;