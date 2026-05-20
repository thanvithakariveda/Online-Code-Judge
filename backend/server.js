import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problem.routes.js"; // ✅ FIXED NAME

dotenv.config();

// Connect DB first
connectDB();

const app = express();

// ---------------- CORS ----------------
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || [],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight
app.options("*", cors());

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- ROUTES ----------------
app.use("/auth", authRoutes);
app.use("/problems", problemRoutes); // ✅ IMPORTANT FIX

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});