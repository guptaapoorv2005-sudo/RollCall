import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { prisma as Prisma } from "../utils/prismaClient.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!token) {
        throw new ApiError(401, "Unauthorized: No token provided");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(401, "Unauthorized: Invalid token");
    }

    const user = await Prisma.user.findUnique({
        where: { id: decodedToken.id }
    });

    if(!user) {
        throw new ApiError(401, "Unauthorized: User not found");
    }

    req.user = user;

    next();
});