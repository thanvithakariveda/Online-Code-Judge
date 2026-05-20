import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  runCode,
  mapVerdict,
  normalizeOutput,
  LANGUAGE_IDS,
} from '../services/judge0.service.js';

const SCORE_PER_SOLVE = 10;

export const createSubmission = asyncHandler(async (req, res) => {
  const { problemId, code, language } = req.body;

  if (!problemId || !code || !language) {
    return res.status(400).json({ success: false, message: 'problemId, code, and language are required.' });
  }

  if (!LANGUAGE_IDS[language]) {
    return res.status(400).json({ success: false, message: 'Unsupported language.' });
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json({ success: false, message: 'Problem not found.' });
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

  // Evaluate against all test cases (sample + hidden)
  const testCases = [
    { input: problem.sampleInput, output: problem.sampleOutput },
    ...problem.hiddenTestCases,
  ].filter((tc) => tc.input != null && tc.output != null);

  let finalVerdict = 'Accepted';
  let runtime = 0;
  let memory = 0;
  let errorMessage = '';

  try {
    for (const testCase of testCases) {
      const result = await runCode({
        sourceCode: code,
        languageId: LANGUAGE_IDS[language],
        stdin: testCase.input,
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit,
      });

      const mapped = mapVerdict(result);

      if (mapped.verdict !== 'Accepted') {
        finalVerdict = mapped.verdict;
        errorMessage = mapped.errorMessage || '';
        runtime = parseFloat(result.time) || 0;
        memory = result.memory || 0;
        break;
      }

      const actual = normalizeOutput(result.stdout);
      const expected = normalizeOutput(testCase.output);

      if (actual !== expected) {
        finalVerdict = 'Wrong Answer';
        errorMessage = 'Output does not match expected for a test case.';
        runtime = parseFloat(result.time) || 0;
        memory = result.memory || 0;
        break;
      }

      runtime = Math.max(runtime, parseFloat(result.time) || 0);
      memory = Math.max(memory, result.memory || 0);
    }
  } catch (err) {
    finalVerdict = 'Runtime Error';
    errorMessage = err.message || 'Execution service unavailable.';
  }

  submission.verdict = finalVerdict;
  submission.runtime = runtime;
  submission.memory = memory;
  submission.errorMessage = errorMessage;
  await submission.save();

  if (finalVerdict === 'Accepted') {
    problem.acceptedCount += 1;
    await problem.save();

    const user = await User.findById(req.user._id);
    const alreadySolved = user.solvedProblems.some(
      (id) => id.toString() === problemId.toString()
    );
    if (!alreadySolved) {
      user.solvedProblems.push(problemId);
      user.score += SCORE_PER_SOLVE;
      await user.save();
    }
  }

  res.status(201).json({ success: true, submission });
});

export const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ user: req.user._id })
    .populate('problem', 'title slug difficulty')
    .sort({ createdAt: -1 })
    .limit(100);

  res.json({ success: true, submissions });
});

export const getSubmissionsByProblem = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({
    user: req.user._id,
    problem: req.params.problemId,
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, submissions });
});

export const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id)
    .populate('problem', 'title slug')
    .populate('user', 'username');

  if (!submission) {
    return res.status(404).json({ success: false, message: 'Submission not found.' });
  }

  if (
    submission.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  res.json({ success: true, submission });
});
