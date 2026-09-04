import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const verifyAdmin = asyncHandler(
    async (req, res, next) => {
        if (!req.user) {
            throw new ApiError(
                401,
                "Unauthorized request"
            );
        }

        if (req.user.role !== "admin") {
            throw new ApiError(
                403,
                "Admin access required"
            );
        }

        next();
    }
);

export { verifyAdmin };