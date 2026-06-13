import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  applyJob,
  updateApplicationStatus,
} from '../controllers/jobController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getJobs).post(protect, admin, createJob);
router.route('/:id').get(getJobById);
router.route('/:id/apply').post(protect, applyJob);
router.route('/:id/applications/:appId').put(protect, admin, updateApplicationStatus);

export default router;
