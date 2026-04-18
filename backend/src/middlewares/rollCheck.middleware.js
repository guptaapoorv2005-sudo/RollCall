import { ApiError } from "../utils/ApiError.js";

export const rollCheck = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(403, 'Access denied');
    }
    next();
  };
};

