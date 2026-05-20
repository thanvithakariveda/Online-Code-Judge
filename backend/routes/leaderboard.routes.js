import express from "express";

const router = express.Router();

// TEMP SIMPLE LEADERBOARD (NO DB DEPENDENCY FIRST FIX)
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      leaderboard: [
        {
          username: "admin",
          score: 100
        },
        {
          username: "user1",
          score: 80
        }
      ]
    }
  });
});

export default router;