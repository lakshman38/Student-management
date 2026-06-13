import express from 'express';
import {
  getAssignmentsForCourse,
  createAssignment,
  submitAssignment,
  gradeAssignment,
} from '../controllers/assignmentController.js';
import { protect, trainer } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, trainer, createAssignment);
router.route('/course/:courseId').get(protect, getAssignmentsForCourse);
router.route('/:id/submit').post(protect, submitAssignment);
router.route('/:id/grade/:submissionId').put(protect, trainer, gradeAssignment);

export default router;
