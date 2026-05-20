import Problem from '../models/Problem.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { validateProblemBody } from '../validators/problem.validator.js';

/**
 * Remove sensitive fields before sending response
 */
const sanitizeProblem = (problem, includeHidden = false) => {
  const obj = problem.toObject ? problem.toObject() : { ...problem };

  if (!includeHidden) {
    delete obj.hiddenTestCases;
  }

  return obj;
};

/**
 * GET ALL PROBLEMS
 * FIXED: returns simple array in data (no nesting confusion)
 */
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

  return sendSuccess(res, {
    message: 'Problems fetched successfully',
    data: problems,   // ✅ IMPORTANT FIX (SIMPLE ARRAY)
  });
});

/**
 * GET SINGLE PROBLEM BY ID
 */
export const getProblemById = asyncHandler(async (req, res) => {
  const isAdmin = req.user?.role === 'admin';

  const query = Problem.findById(req.params.id);
  if (!isAdmin) query.select('-hiddenTestCases');

  const problem = await query;

  if (!problem) {
    return sendError(res, {
      message: 'Problem not found.',
      statusCode: 404,
    });
  }

  return sendSuccess(res, {
    message: 'Problem fetched successfully',
    data: sanitizeProblem(problem),
  });
});

/**
 * GET PROBLEM BY SLUG
 */
export const getProblemBySlug = asyncHandler(async (req, res) => {
  const problem = await Problem.findOne({
    slug: req.params.slug,
  }).select('-hiddenTestCases');

  if (!problem) {
    return sendError(res, {
      message: 'Problem not found.',
      statusCode: 404,
    });
  }

  return sendSuccess(res, {
    message: 'Problem fetched successfully',
    data: sanitizeProblem(problem),
  });
});

/**
 * CREATE PROBLEM
 */
export const createProblem = asyncHandler(async (req, res) => {
  const { errors, data } = validateProblemBody(req.body);

  if (errors.length) {
    return sendError(res, {
      message: errors[0],
      statusCode: 400,
    });
  }

  const problem = await Problem.create({
    ...data,
    createdBy: req.user._id,
  });

  return sendSuccess(res, {
    message: 'Problem created successfully',
    data: sanitizeProblem(problem, true),
    statusCode: 201,
  });
});

/**
 * UPDATE PROBLEM
 */
export const updateProblem = asyncHandler(async (req, res) => {
  const existing = await Problem.findById(req.params.id);

  if (!existing) {
    return sendError(res, {
      message: 'Problem not found.',
      statusCode: 404,
    });
  }

  const { errors, data } = validateProblemBody(req.body, {
    partial: true,
  });

  if (errors.length) {
    return sendError(res, {
      message: errors[0],
      statusCode: 400,
    });
  }

  // Prevent updating system fields
  delete data.submissionCount;
  delete data.acceptedCount;
  delete data.createdBy;

  const problem = await Problem.findByIdAndUpdate(
    req.params.id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  return sendSuccess(res, {
    message: 'Problem updated successfully',
    data: sanitizeProblem(problem, true),
  });
});

/**
 * DELETE PROBLEM
 */
export const deleteProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findByIdAndDelete(req.params.id);

  if (!problem) {
    return sendError(res, {
      message: 'Problem not found.',
      statusCode: 404,
    });
  }

  return sendSuccess(res, {
    message: 'Problem deleted successfully',
    data: {},
  });
});