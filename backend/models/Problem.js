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
    hiddenTestCases: [testCaseSchema],
    timeLimit: { type: Number, default: 2000 },
    memoryLimit: { type: Number, default: 128000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submissionCount: { type: Number, default: 0 },
    acceptedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/** Build URL-safe slug from title */
export function slugifyTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

problemSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugifyTitle(this.title);
  }
  next();
});

export default mongoose.model('Problem', problemSchema);
