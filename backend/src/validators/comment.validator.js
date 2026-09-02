import { ApiError } from "../utils/ApiError.js";

const validateCreateComment = (req, res, next) => {
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(
            400,
            "Comment content is required"
        );
    }

    next();
};


const validateUpdateComment = (req, res, next) => {
    const { content } = req.body;

    if (!content?.trim()) {
        throw new ApiError(
            400,
            "Comment content is required"
        );
    }

    next();
};


export {
    validateCreateComment,
    validateUpdateComment,
};