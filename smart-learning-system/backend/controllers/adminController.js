import User from '../models/User.js';
import Course from '../models/Course.js';
import Assignment from '../models/Assignment.js';
import Job from '../models/Job.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalCourses = await Course.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalAssignments = await Assignment.countDocuments();

    // Count total submissions across all assignments
    const assignmentsWithSubs = await Assignment.find({}, 'submissions');
    const totalSubmissions = assignmentsWithSubs.reduce((acc, a) => acc + a.submissions.length, 0);

    // Count total job applications
    const jobsWithApps = await Job.find({}, 'applications');
    const totalApplications = jobsWithApps.reduce((acc, j) => acc + j.applications.length, 0);

    // Recent users (last 5)
    const recentUsers = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(5);

    res.json({
      totalStudents,
      totalTrainers,
      totalAdmins,
      totalCourses,
      totalJobs,
      totalAssignments,
      totalSubmissions,
      totalApplications,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a course (admin override)
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
const adminDeleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllUsers, toggleUserStatus, deleteUser, getAnalytics, adminDeleteCourse };
