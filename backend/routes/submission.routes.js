import express from 'express';
import {
  createSubmission,
  getMySubmissions,
  getSubmissionsByProblem,
  getSubmissionById,
} from '../controllers/submission.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createSubmission);
router.get('/me', getMySubmissions);
router.get('/problem/:problemId', getSubmissionsByProblem);
router.get('/:id', getSubmissionById);

export default router;
