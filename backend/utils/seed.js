import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import { connectDB } from '../config/db.js';

dotenv.config();

/**
 * Seed database with admin user and sample problems.
 * Run: npm run seed
 */
const seed = async () => {
  await connectDB();

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@codejudge.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      username: 'admin',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created: admin@codejudge.com / admin123');
  }

  const count = await Problem.countDocuments();
  if (count === 0) {
    const samples = [
      {
        title: 'Two Sum',
        description:
          'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume each input has exactly one solution.',
        constraints: '2 <= nums.length <= 10^4',
        inputFormat: 'First line: n\nSecond line: n integers\nThird line: target',
        outputFormat: 'Two space-separated indices (0-based)',
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
        description: 'Given a string `s`, print the reversed string.',
        constraints: '1 <= s.length <= 10^5',
        inputFormat: 'A single string',
        outputFormat: 'Reversed string',
        sampleInput: 'hello',
        sampleOutput: 'olleh',
        difficulty: 'Easy',
        tags: ['string'],
        hiddenTestCases: [{ input: 'abc', output: 'cba' }],
        createdBy: admin._id,
      },
    ];

    for (const sample of samples) {
      await Problem.create(sample);
    }
    console.log('Sample problems seeded.');
  }

  console.log('Seed complete.');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
