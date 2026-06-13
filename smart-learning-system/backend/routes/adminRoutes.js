import express from 'express';
import { getAllUsers, toggleUserStatus, deleteUser, getAnalytics, adminDeleteCourse } from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/analytics', protect, admin, getAnalytics);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/status', protect, admin, toggleUserStatus);
router.delete('/users/:id', protect, admin, deleteUser);
router.delete('/courses/:id', protect, admin, adminDeleteCourse);

export default router;
