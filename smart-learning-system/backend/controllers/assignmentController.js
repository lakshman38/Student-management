import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';

// @desc    Get assignments for a specific course
// @route   GET /api/assignments/course/:courseId
// @access  Private (Students enrolled or Instructor/Admin)
const getAssignmentsForCourse = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId }).populate('instructor', 'name');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private/Trainer/Admin
const createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, dueDate, totalMarks } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to create assignment for this course' });
    }

    const assignment = new Assignment({
      title,
      description,
      course: courseId,
      instructor: req.user._id,
      dueDate,
      totalMarks,
    });

    const createdAssignment = await assignment.save();
    res.status(201).json(createdAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
const submitAssignment = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if already submitted
    const alreadySubmitted = assignment.submissions.find(
      (sub) => sub.student.toString() === req.user._id.toString()
    );

    if (alreadySubmitted) {
      return res.status(400).json({ message: 'You have already submitted this assignment' });
    }

    const submission = {
      student: req.user._id,
      fileUrl,
      status: 'submitted',
    };

    assignment.submissions.push(submission);
    await assignment.save();

    res.status(201).json({ message: 'Assignment submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade an assignment submission
// @route   PUT /api/assignments/:id/grade/:submissionId
// @access  Private/Trainer/Admin
const gradeAssignment = async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to grade this assignment' });
    }

    const submission = assignment.submissions.id(req.params.submissionId);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = 'graded';

    await assignment.save();
    res.json({ message: 'Assignment graded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAssignmentsForCourse,
  createAssignment,
  submitAssignment,
  gradeAssignment,
};
