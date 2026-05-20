import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);

    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      score: user.score,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const safeUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      score: user.score,
    };

    res.json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

// ================= ME =================
export const getMe = async (req, res) => {
  try {
    const safeUser = {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      score: req.user.score,
    };

    res.json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};