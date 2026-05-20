import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  res.json({ success: true, message: "Registered successfully" });
});

router.post("/login", (req, res) => {
  res.json({
    success: true,
    data: { token: "demo-token" },
  });
});

router.get("/me", (req, res) => {
  res.json({
    success: true,
    data: { name: "User" },
  });
});

export default router;