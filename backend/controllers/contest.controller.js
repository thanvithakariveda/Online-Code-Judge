import Contest from '../models/Contest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { validateContestBody } from '../validators/problem.validator.js';

export const getContests = asyncHandler(async (req, res) => {
  const contests = await Contest.find()
    .populate('problems', 'title slug difficulty')
    .sort({ startTime: -1 });

  sendSuccess(res, {
    message: 'Contests fetched successfully',
    data: { contests },
  });
});

export const getContestById = asyncHandler(async (req, res) => {
  const contest = await Contest.findById(req.params.id).populate(
    'problems',
    'title slug difficulty tags'
  );

  if (!contest) {
    return sendError(res, { message: 'Contest not found.', statusCode: 404 });
  }

  sendSuccess(res, {
    message: 'Contest fetched successfully',
    data: { contest },
  });
});

export const createContest = asyncHandler(async (req, res) => {
  const { errors, data } = validateContestBody(req.body);
  if (errors.length) {
    return sendError(res, { message: errors[0], statusCode: 400 });
  }

  const contest = await Contest.create({ ...data, createdBy: req.user._id });

  sendSuccess(res, {
    message: 'Contest created successfully',
    data: { contest },
    statusCode: 201,
  });
});
