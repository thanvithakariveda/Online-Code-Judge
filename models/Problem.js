import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    constraints: { type: String, default: '' },
    inputFormat: { type: String, default: '' },
    outputFormat: { type: String, default: '' },
    sampleInput: { type: String, default: '' },
    sampleOutput: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    tags: [{ type: String, trim: true }],
    // Hidden from clients in list/detail APIs
    hiddenTestCases: [testCaseSchema],
    timeLimit: { type: Number, default: 2000 }, // ms for Judge0
    memoryLimit: { type: Number, default: 128000 }, // KB
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submissionCount: { type: Number, default: 0 },
    acceptedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title
problemSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Problem', problemSchema);
