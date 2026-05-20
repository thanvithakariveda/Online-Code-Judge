import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { formatUser } from '../utils/userDto.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js';

/**
 * Create a signed JWT for the user id.
 * Token payload: { id } — verified by auth middleware.
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/** Register a new user and return JWT + user profile */
export const register = asyncHandler(async (req, res) => {
  const errors = validateRegister(req.body);
  if (errors.length) {
    return sendError(res, { message: errors[0], statusCode: 400 });
  }

  const { username, email, password } = req.body;
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim().toLowerCase();

  const exists = await User.findOne({
    $or: [{ email: trimmedEmail }, { username: trimmedUsername }],
  });

  if (exists) {
    return sendError(res, { message: 'Email or username already in use.', statusCode: 400 });
  }

  const user = await User.create({
    username: trimmedUsername,
    email: trimmedEmail,
    password,
  });

  const token = signToken(user._id);

  sendSuccess(res, {
    message: 'Account created successfully',
    data: { token, user: formatUser(user) },
    statusCode: 201,
  });
});

/** Login with email + password */
export const login = asyncHandler(async (req, res) => {
  const errors = validateLogin(req.body);
  if (errors.length) {
    return sendError(res, { message: errors[0], statusCode: 400 });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return sendError(res, { message: 'Invalid credentials.', statusCode: 401 });
  }

  const token = signToken(user._id);

  sendSuccess(res, {
    message: 'Logged in successfully',
    data: { token, user: formatUser(user) },
  });
});

/** Return current user profile (requires JWT) */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'solvedProblems',
    'title slug difficulty'
  );

  sendSuccess(res, {
    message: 'Profile fetched successfully',
    data: { user: formatUser(user) },
  });
});
