import User from '../models/User.js';
import Problem from '../models/Problem.js';

/**
 * Ensures sample problems exist in the database (runs once on server start if empty).
 * Safe for production — only inserts when Problem collection is empty.
 */
export async function ensureSampleProblems() {
  const count = await Problem.countDocuments();
  if (count > 0) {
    console.log(`Problems in DB: ${count}`);
    return;
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@codejudge.com';
  let admin = await User.findOne({ email: adminEmail });

  if (!admin) {
    admin = await User.create({
      username: 'admin',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
    });
    console.log('Auto-seed: admin user created');
  }

  await Problem.insertMany([
    {
      title: 'Two Sum',
      description:
        'Given an array of integers, return indices of two numbers that add up to the target.',
      constraints: '2 <= nums.length <= 10^4',
      sampleInput: '4\n2 7 11 15\n9',
      sampleOutput: '0 1',
      difficulty: 'Easy',
      tags: ['array', 'hash-map'],
      hiddenTestCases: [
        { input: '3\n3 2 4\n6', output: '1 2' },
        { input: '2\n3 3\n6', output: '0 1' },
      ],
      createdBy: admin._id,
    },
    {
      title: 'Reverse String',
      description: 'Given a string, print the reversed string.',
      sampleInput: 'hello',
      sampleOutput: 'olleh',
      difficulty: 'Easy',
      tags: ['string'],
      hiddenTestCases: [{ input: 'abc', output: 'cba' }],
      createdBy: admin._id,
    },
    {
      title: 'Maximum Subarray',
      description: 'Find the contiguous subarray with the largest sum and print the sum.',
      sampleInput: '9\n-2 1 -3 4 -1 2 1 -5 4',
      sampleOutput: '6',
      difficulty: 'Medium',
      tags: ['array', 'dynamic-programming'],
      hiddenTestCases: [{ input: '1\n5', output: '5' }],
      createdBy: admin._id,
    },
    {
      title: 'Valid Parentheses',
      description: 'Given a string of brackets, print "true" if valid else "false".',
      sampleInput: '()[]{}',
      sampleOutput: 'true',
      difficulty: 'Medium',
      tags: ['stack', 'string'],
      hiddenTestCases: [{ input: '(]', output: 'false' }],
      createdBy: admin._id,
    },
  ]);

  console.log('Auto-seed: sample problems created');
}
