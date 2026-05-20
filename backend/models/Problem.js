import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    difficulty: String,
    tags: [String],
    submissionCount: { type: Number, default: 0 },
    acceptedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Problem", problemSchema);