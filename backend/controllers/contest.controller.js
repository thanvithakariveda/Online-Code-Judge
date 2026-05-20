import Contest from '../models/Contest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getContests = asyncHandler(async (req, res) => {
  const contests = await Contest.find()
    .populate('problems', 'title slug difficulty')
    .sort({ startTime: -1 });
  res.json({ success: true, contests });
});

export const getContestById = asyncHandler(async (req, res) => {
  const contest = await Contest.findById(req.params.id).populate(
    'problems',
    'title slug difficulty tags'
  );
  if (!contest) {
    return res.status(404).json({ success: false, message: 'Contest not found.' });
  }
  res.json({ success: true, contest });
});

export const createContest = asyncHandler(async (req, res) => {
  const contest = await Contest.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, contest });
});
