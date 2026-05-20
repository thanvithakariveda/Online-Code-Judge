import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendError } from "../utils/apiResponse.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return sendError(res, {
      message: "Not authorized",
      statusCode: 401,
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return sendError(res, {
        message: "User not found",
        statusCode: 401,
      });
    }

    next();
  } catch (err) {
    return sendError(res, {
      message: "Invalid token",
      statusCode: 401,
    });
  }
};