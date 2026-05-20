import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getLeaderboard = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

  const users = await User.find()
    .select('username score solvedProblems')
    .sort({ score: -1, createdAt: 1 })
    .limit(limit);

  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    username: user.username,
    score: user.score,
    solvedCount: user.solvedProblems?.length || 0,
  }));

  sendSuccess(res, {
    message: 'Leaderboard fetched successfully',
    data: { leaderboard },
  });
});
