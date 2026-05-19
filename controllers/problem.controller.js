import Problem from '../models/Problem.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Strip hidden test cases for public API responses
const sanitizeProblem = (problem, includeHidden = false) => {
  const obj = problem.toObject ? problem.toObject() : { ...problem };
  if (!includeHidden) delete obj.hiddenTestCases;
  return obj;
};

export const getProblems = asyncHandler(async (req, res) => {
  const { difficulty, tag, search } = req.query;
  const filter = {};

  if (difficulty) filter.difficulty = difficulty;
  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const problems = await Problem.find(filter)
    .select('-hiddenTestCases')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: problems.length, problems });
});

export const getProblemById = asyncHandler(async (req, res) => {
  const isAdmin = req.user?.role === 'admin';
  const query = Problem.findById(req.params.id);
  if (!isAdmin) query.select('-hiddenTestCases');
  const problem = await query;
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }
  res.json({ success: true, problem });
});

export const getProblemBySlug = asyncHandler(async (req, res) => {
  const problem = await Problem.findOne({ slug: req.params.slug }).select('-hiddenTestCases');
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }
  res.json({ success: true, problem });
});

export const createProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, problem: sanitizeProblem(problem, true) });
});

export const updateProblem = asyncHandler(async (req, res) => {
  let problem = await Problem.findById(req.params.id);
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }

  problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, problem: sanitizeProblem(problem, true) });
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findByIdAndDelete(req.params.id);
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
  }
  res.json({ success: true, message: 'Problem deleted.' });
});
