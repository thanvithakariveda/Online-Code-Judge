import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      score: user.score,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Email or username already in use.' });
  }

  const user = await User.create({ username, email, password });
  sendTokenResponse(user, 201, res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  user.password = undefined;
  sendTokenResponse(user, 200, res);
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('solvedProblems', 'title slug difficulty');
  res.json({ success: true, user });
});
