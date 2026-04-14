import { PrismaClient } from "@prisma/client";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const Prisma = new PrismaClient();

const toggleProjectLike = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    const existingLike = await Prisma.like.findUnique({
        where: {
            userId_projectId: {
                userId,
                projectId
            }
        }
    });

    if(existingLike) {
        await Prisma.like.delete({
            where: {
                userId_projectId: {
                    userId,
                    projectId
                }
            }
        });
        return res.status(200).json(new ApiResponse(200, null, "Project unliked successfully"));
    } 
    else {
        await Prisma.like.create({
            data: {
                userId,
                projectId
            }
        });
        return res.status(201).json(new ApiResponse(201, null, "Project liked successfully"));
    }
});

export { toggleProjectLike };