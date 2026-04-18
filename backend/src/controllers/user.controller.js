import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateRefreshAndAccessToken = (userId) => {
    const accessToken = jwt.sign(
        {
            id: userId
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );

    const refreshToken = jwt.sign(
        {
            id: userId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );

    return { accessToken, refreshToken };
};

const Prisma = new PrismaClient();

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    if(!email?.trim() || !password?.trim() || !name?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await Prisma.user.findUnique({ //findUnique is used to find a single record that matches the specified criteria. It returns the record if found, or null if no matching record is found.
        where: { email }
    });

    if(existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name
        }
    });

    const { accessToken, refreshToken } = generateRefreshAndAccessToken(newUser.id);

    await Prisma.user.update({
        where: { id: newUser.id },
        data: { refreshToken }
    });

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000 
    }

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 10 * 24 * 60 * 60 * 1000 
    }

    return res
    .status(201)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(
        new ApiResponse(201,
            {
                id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, classId: newUser.classId
            },
            "User registered successfully"
        ) 
    )

});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email?.trim() || !password?.trim()) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await Prisma.user.findUnique({
        where: { email }
    });

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = generateRefreshAndAccessToken(user.id);

    await Prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000 
    }

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 10 * 24 * 60 * 60 * 1000 
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(
        new ApiResponse(200, 
            {
                id: user.id, email: user.email, name: user.name, role: user.role, classId: user.classId
            }, 
            "User logged in successfully"
        )
    )
});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    await Prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null }
    });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        throw new ApiError(401, "Refresh token is missing");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const user = await Prisma.user.findUnique({
        where: { id: decodedToken.id }
    });

    if(!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Unauthorized: Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = generateRefreshAndAccessToken(user.id);

    await Prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken }
    });

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000 
    }

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 10 * 24 * 60 * 60 * 1000 
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", newRefreshToken, refreshTokenOptions)
    .json( new ApiResponse(200, null, "Access token refreshed successfully") );
});

const getCurrentUser = asyncHandler(async (req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse( 200, req.user, "Current user fetched successfully"))
});

const updateName = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { name } = req.body;
    if(!name?.trim()) {
        throw new ApiError(400, "Name is required");
    }

    const user = await Prisma.user.update({
        where: { id: userId },
        data: { name }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Name updated successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if(!currentPassword?.trim() || !newPassword?.trim()) {
        throw new ApiError(400, "Current and new passwords are required");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, req.user.password);

    if(!isPasswordValid) {
        throw new ApiError(401, "Current password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const user = await Prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Password updated successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    await Prisma.user.delete({
        where: { id: userId }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User deleted successfully"));
});

export {
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    getCurrentUser,
    updateName, 
    changePassword, 
    deleteUser 
};