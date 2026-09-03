import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 2000,
        },

        techStack: {
            type: [String],
            required: true,
            validate: {
                validator: (value) => value.length > 0,
                message: "At least one technology is required",
            },
        },

        githubUrl: {
            type: String,
            trim: true,
            default: "",
        },

        liveUrl: {
            type: String,
            trim: true,
            default: "",
        },

        thumbnail: {
            url: {
                type: String,
                default: "",
            },
            publicId: {
                type: String,
                default: "",
            },
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);


const Project = mongoose.model("Project", projectSchema);

export default Project;