import express from 'express';
import { getContests, getContestById, createContest } from '../controllers/contest.controller.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getContests);
router.get('/:id', getContestById);
router.post('/', protect, adminOnly, createContest);

export default router;
