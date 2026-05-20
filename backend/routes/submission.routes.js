import express from "express";
import { protect } from "../middleware/auth.js";
import { getMySubmissions } from "../controllers/submissionController.js";

const router = express.Router();

// 🔥 MUST HAVE protect HERE
router.get("/me", protect, getMySubmissions);

export default router;