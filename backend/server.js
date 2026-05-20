import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problem.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import submissionRoutes from "./routes/submission.routes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(",")
      : "*",
    credentials: true,
  })
);

// Health check
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Routes
app.use("/auth", authRoutes);
app.use("/problems", problemRoutes);
app.use("/leaderboard", leaderboardRoutes);   // ✅ FIX HERE
app.use("/submissions", submissionRoutes);    // ✅ IMPORTANT (for later)

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});