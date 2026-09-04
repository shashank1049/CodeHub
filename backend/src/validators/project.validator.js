import { ApiError } from "../utils/ApiError.js";

const validateCreateProject = (req, res, next) => {
    const {
        title,
        description,
        techStack,
    } = req.body;

    if (!title?.trim()) {
        throw new ApiError(
            400,
            "Project title is required"
        );
    }

    if (!description?.trim()) {
        throw new ApiError(
            400,
            "Project description is required"
        );
    }

    if (
        !Array.isArray(techStack) ||
        techStack.length === 0
    ) {
        throw new ApiError(
            400,
            "At least one technology is required"
        );
    }

    next();
};

const validateUpdateProject = (req, res, next) => {
    const allowedFields = [
        "title",
        "description",
        "techStack",
        "githubUrl",
        "liveUrl",
    ];

    const providedFields = Object.keys(req.body);

    const hasValidField = providedFields.some(
        (field) =>
            allowedFields.includes(field)
    );

    if (!hasValidField) {
        throw new ApiError(
            400,
            "No valid project fields provided"
        );
    }

    if (
        req.body.techStack !== undefined &&
        (
            !Array.isArray(req.body.techStack) ||
            req.body.techStack.length === 0
        )
    ) {
        throw new ApiError(
            400,
            "Tech stack must contain at least one technology"
        );
    }

    next();
};

export {
    validateCreateProject,
    validateUpdateProject,
};