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
                id: newUser.id, email: newUser.email, name: newUser.name, credits: newUser.credits
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
                id: user.id, email: user.email, name: user.name, credits: user.credits, avatar: user.avatar
            }, 
            "User logged in successfully"
        )
    )
});

export { registerUser, loginUser };