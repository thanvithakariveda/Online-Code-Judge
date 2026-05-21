import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { validateSubmissionBody } from '../validators/problem.validator.js';
import { evaluateSubmission, LANGUAGE_IDS } from '../services/submission.service.js';

export const createSubmission = asyncHandler(async (req, res) => {
  const { errors, data } = validateSubmissionBody(req.body);
  if (errors.length) {
    return sendError(res, { message: errors[0], statusCode: 400 });
  }

  const { problemId, code, language } = data;

  if (!LANGUAGE_IDS[language]) {
    return sendError(res, { message: 'Unsupported language.', statusCode: 400 });
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    return sendError(res, { message: 'Problem not found.', statusCode: 404 });
  }

  const submission = await Submission.create({
    user: req.user._id,
    problem: problemId,
    code,
    language,
    verdict: 'Pending',
  });

  problem.submissionCount += 1;
  await problem.save();

  const { submission: result, scoreAwarded, user: updatedUser } = await evaluateSubmission({
    submission,
    problem,
    code,
    language,
    userId: req.user._id,
  });

  sendSuccess(res, {
    message:
      result.verdict === 'Accepted'
        ? scoreAwarded > 0
          ? `Accepted! +${scoreAwarded} points`
          : 'Accepted!'
        : 'Submission evaluated',
    data: { submission: result, scoreAwarded, user: updatedUser },
    statusCode: 201,
  });
});

export const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ user: req.user._id })
    .populate('problem', 'title slug difficulty')
    .sort({ createdAt: -1 })
    .limit(100);

  sendSuccess(res, {
    message: 'Submissions fetched successfully',
    data: { submissions },
  });
});

export const getSubmissionsByProblem = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({
    user: req.user._id,
    problem: req.params.problemId,
  })
    .sort({ createdAt: -1 })
    .limit(50);

  sendSuccess(res, {
    message: 'Submissions fetched successfully',
    data: { submissions },
  });
});

export const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id)
    .populate('problem', 'title slug')
    .populate('user', 'username');

  if (!submission) {
    return sendError(res, { message: 'Submission not found.', statusCode: 404 });
  }

  if (
    submission.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return sendError(res, { message: 'Access denied.', statusCode: 403 });
  }

  sendSuccess(res, {
    message: 'Submission fetched successfully',
    data: { submission },
  });
});
