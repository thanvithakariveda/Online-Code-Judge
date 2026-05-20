import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";

dotenv.config();

// DB connect
connectDB().catch((err) => {
  console.error("DB Error:", err);
});

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://online-code-judge-steel.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/problems", problemRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});