export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user._id,
    });

    res.json({
      submissions,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};