import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
} from '../controllers/courseController.js';
import { protect, trainer } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCourses).post(protect, trainer, createCourse);
router
  .route('/:id')
  .get(getCourseById)
  .put(protect, trainer, updateCourse)
  .delete(protect, trainer, deleteCourse);

router.post('/:id/enroll', protect, enrollCourse);

export default router;
