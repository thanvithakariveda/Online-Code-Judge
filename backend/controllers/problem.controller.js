import Problem from "../models/Problem.js";

export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find();

    res.json({
      success: true,
      data: problems,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};