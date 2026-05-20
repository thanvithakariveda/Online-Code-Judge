import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    code: { type: String, required: true },
    language: {
      type: String,
      enum: ['cpp', 'python', 'java', 'javascript'],
      required: true,
    },
    verdict: {
      type: String,
      enum: [
        'Pending',
        'Accepted',
        'Wrong Answer',
        'Time Limit Exceeded',
        'Runtime Error',
        'Compilation Error',
      ],
      default: 'Pending',
    },
    runtime: { type: Number }, // ms
    memory: { type: Number }, // KB
    errorMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

submissionSchema.index({ user: 1, createdAt: -1 });
submissionSchema.index({ problem: 1, createdAt: -1 });

export default mongoose.model('Submission', submissionSchema);
