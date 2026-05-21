import express from 'express';
import {
  getProblems,
  getProblemById,
  getProblemBySlug,
  createProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/problem.controller.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

const router = express.Router();

router.get('/', getProblems);
router.get('/slug/:slug', getProblemBySlug);
router.get('/:id', optionalAuth, getProblemById);
router.post('/', protect, adminOnly, createProblem);
router.put('/:id', protect, adminOnly, updateProblem);
router.delete('/:id', protect, adminOnly, deleteProblem);

export default router;
