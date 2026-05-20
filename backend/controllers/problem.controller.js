import Problem from "../models/Problem.js";

export const getProblems = async (req, res) => {
  try {
    const { difficulty, search } = req.query;

    const filter = {};

    if (difficulty) filter.difficulty = difficulty;

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const problems = await Problem.find(filter);

    res.json({
      success: true,
      data: problems,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};