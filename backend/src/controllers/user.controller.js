import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { validatePassword } from "../utils/validatePasseord.js";
import Project from "../models/project.model.js";




const generateAccessAndRefreshTokens = async (user) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
        accessToken,
        refreshToken,
    };
};





const registerUser = asyncHandler(async (req, res) => {
    const {
        fullName,
        username,
        email,
        password,
        avatar,
        bio,
        githubUsername,
    } = req.body;

    if (!fullName || !username || !email || !password) {
        throw new ApiError(400, "Required fields are missing");
    }

    if (!validatePassword(password)) {
        throw new ApiError(
            400,
            "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
        );
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new ApiError(409, "Username or email already exists");
    }

    const user = await User.create({
        fullName,
        username,
        email,
        password,
        avatar,
        bio,
        githubUsername,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});






const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
        throw new ApiError(
            400,
            "Email/username and password are required"
        );
    }

    const user = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(user);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const cookieOptions={
        httpOnly: true,
        secure: process.env.Node_ENV==="production",
        sameSite:"lax",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});





const getCurrentUser=asyncHandler(async (req, res)=>{
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched Successfully"
        )
    )
})




const refreshAccessToken = asyncHandler(async (req, res) => {

    
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token is required");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(
                401,
                "Refresh token is expired or invalid"
            );
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid refresh token"
        );
    }
});





const logoutUser=asyncHandler(async (req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1,
            },
        },
        {
            new:true,
        }
    );

    const cookieOptions={
        httpOnly:true,
        secure:process.env.NOE_ENV==="prduction",
        sameSite:"lax",
    }

    return res.status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )
})




const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(
            400,
            "Old password and new password are required"
        );
    }

    if (!validatePassword(newPassword)) {
        throw new ApiError(
            400,
            "New password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
        );
    }

    const user = await User.findById(req.user._id);

    const isPasswordCorrect =
        await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    );
});




const updateProfile = asyncHandler(async (req, res) => {
    const {
        fullName,
        bio,
        githubUsername,
        avatar,
        coverImage,
    } = req.body;

    const updateData = {};

    if (fullName !== undefined) {
        updateData.fullName = fullName.trim();
    }

    if (bio !== undefined) {
        updateData.bio = bio.trim();
    }

    if (githubUsername !== undefined) {
        updateData.githubUsername = githubUsername.trim();
    }

    if (avatar !== undefined) {
        updateData.avatar = avatar.trim();
    }

    if (coverImage !== undefined) {
        updateData.coverImage = coverImage.trim();
    }

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(
            400,
            "At least one profile field is required"
        );
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateData,
        },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Profile updated successfully"
        )
    );
});



const getDeveloperProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    const user = await User.findOne({
        username: username.toLowerCase(),
    }).select(
        "-password -refreshToken -role"
    );

    if (!user) {
        throw new ApiError(
            404,
            "Developer not found"
        );
    }

    const projects = await Project.find({
        owner: user._id,
    })
        .sort({
            createdAt: -1,
        })
        .lean();

    const projectsCount = projects.length;

    const totalLikes = projects.reduce(
        (total, project) =>
            total + (project.likes?.length || 0),
        0
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user,
                projects,
                stats: {
                    projectsCount,
                    totalLikes,
                },
            },
            "Developer profile fetched successfully"
        )
    );
});
















export {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    updateProfile,
    getDeveloperProfile
}