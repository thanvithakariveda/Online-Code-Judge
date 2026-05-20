import express from "express";
import { protect } from "../middleware/auth.js";
import { getMySubmissions } from "../controllers/submission.controller.js";

const router = express.Router();

router.get("/me", protect, getMySubmissions);

export default router;