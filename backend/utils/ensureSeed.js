import User from '../models/User.js';
import Problem, { slugifyTitle } from '../models/Problem.js';

const SAMPLE_PROBLEMS = [
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
  },
  {
    title: 'Reverse String',
    description: 'Given a string, print the reversed string.',
    sampleInput: 'hello',
    sampleOutput: 'olleh',
    difficulty: 'Easy',
    tags: ['string'],
    hiddenTestCases: [{ input: 'abc', output: 'cba' }],
  },
  {
    title: 'Maximum Subarray',
    description: 'Find the contiguous subarray with the largest sum and print the sum.',
    sampleInput: '9\n-2 1 -3 4 -1 2 1 -5 4',
    sampleOutput: '6',
    difficulty: 'Medium',
    tags: ['array', 'dynamic-programming'],
    hiddenTestCases: [{ input: '1\n5', output: '5' }],
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string of brackets, print "true" if valid else "false".',
    sampleInput: '()[]{}',
    sampleOutput: 'true',
    difficulty: 'Medium',
    tags: ['stack', 'string'],
    hiddenTestCases: [{ input: '(]', output: 'false' }],
  },
];

/** Fix problems missing slug (from old broken insertMany seed) */
async function repairMissingSlugs() {
  const broken = await Problem.find({
    $or: [{ slug: null }, { slug: '' }, { slug: { $exists: false } }],
  });

  for (const doc of broken) {
    const base = slugifyTitle(doc.title || 'problem');
    doc.slug = `${base}-${doc._id.toString().slice(-6)}`;
    await doc.save();
    console.log(`Auto-seed: fixed slug for "${doc.title}"`);
  }
}

/**
 * Ensures sample problems exist. Uses Problem.create() so slugs are set correctly.
 * Never crashes the server — logs errors and continues.
 */
export async function ensureSampleProblems() {
  try {
    await repairMissingSlugs();

    const count = await Problem.countDocuments();
    if (count >= SAMPLE_PROBLEMS.length) {
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

    for (const sample of SAMPLE_PROBLEMS) {
      const slug = slugifyTitle(sample.title);
      const exists = await Problem.findOne({ slug });
      if (exists) continue;

      await Problem.create({ ...sample, slug, createdBy: admin._id });
      console.log(`Auto-seed: created "${sample.title}"`);
    }

    console.log(`Problems in DB: ${await Problem.countDocuments()}`);
  } catch (err) {
    console.error('Auto-seed warning (server will still start):', err.message);
  }
}
