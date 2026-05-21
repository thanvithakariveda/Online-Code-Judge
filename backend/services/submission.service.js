import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { formatUser } from '../utils/userDto.js';
import {
  runCode,
  LANGUAGE_IDS,
  mapVerdict,
  normalizeOutput,
} from './codeRunner.service.js';

const SCORE_PER_SOLVE = 10;

/**
 * Run all test cases via Judge0 and update submission + user score.
 */
export async function evaluateSubmission({ submission, problem, code, language, userId }) {
  const testCases = [
    { input: problem.sampleInput, output: problem.sampleOutput },
    ...(problem.hiddenTestCases || []),
  ].filter((tc) => tc.input != null && tc.output != null && tc.output !== '');

  let finalVerdict = 'Accepted';
  let runtime = 0;
  let memory = 0;
  let errorMessage = '';

  try {
    for (const testCase of testCases) {
      const result = await runCode({
        sourceCode: code,
        languageId: LANGUAGE_IDS[language],
        language,
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
        errorMessage = [
          'Your output does not match the expected result.',
          '',
          'Expected:',
          expected || '(empty)',
          '',
          'Your output:',
          actual || '(empty)',
        ].join('\n');
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

  let scoreAwarded = 0;
  let userProfile = null;

  if (finalVerdict === 'Accepted') {
    problem.acceptedCount += 1;
    await problem.save();

    const user = await User.findById(userId);
    const problemIdStr = problem._id.toString();
    const alreadySolved = (user.solvedProblems || []).some(
      (pid) => pid.toString() === problemIdStr
    );

    if (!alreadySolved) {
      const updated = await User.findByIdAndUpdate(
        userId,
        {
          $push: { solvedProblems: problem._id },
          $inc: { score: SCORE_PER_SOLVE },
        },
        { new: true }
      );
      scoreAwarded = SCORE_PER_SOLVE;
      userProfile = formatUser(updated);
    } else {
      userProfile = formatUser(user);
    }
  }

  return { submission, scoreAwarded, user: userProfile };
}

export { LANGUAGE_IDS };
