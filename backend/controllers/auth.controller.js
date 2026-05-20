import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendError } from "../utils/apiResponse.js";

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, {
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return sendError(res, {
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    // ✅ IMPORTANT FIX (THIS LINE SOLVES YOUR ISSUE)
    const token = jwt.sign(
      { id: user._id }, // 🔥 MUST BE "id"
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user,
    });
  } catch (err) {
    return sendError(res, {
      message: "Login failed",
      statusCode: 500,
    });
  }
};