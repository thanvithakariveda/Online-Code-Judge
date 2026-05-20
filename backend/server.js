import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problem.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL.split(","),
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/auth", authRoutes);
app.use("/problems", problemRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});