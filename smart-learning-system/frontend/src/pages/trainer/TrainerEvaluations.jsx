import { useState, useEffect, useContext } from 'react';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import { useToast } from '../../components/Toast';

const TrainerEvaluations = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [gradeModal, setGradeModal] = useState(null); // { assignmentId, submissionId, studentName }
  const [gradeForm, setGradeForm] = useState({ marks: '', feedback: '' });
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    API.get('/courses').then(({ data }) => {
      const mine = data.filter(c => c.instructor?._id === user?._id || c.instructor === user?._id);
      setCourses(mine);
      if (mine.length > 0) setSelectedCourse(mine[0]._id);
    });
  }, [user]);

  useEffect(() => {
    if (selectedCourse) {
      API.get(`/assignments/course/${selectedCourse}`).then(({ data }) => setAssignments(data)).catch(() => {});
    }
  }, [selectedCourse]);

  const handleGrade = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/assignments/${gradeModal.assignmentId}/grade/${gradeModal.submissionId}`, gradeForm);
      showToast('Graded successfully!');
      setGradeModal(null);
      // Refresh assignments
      const { data } = await API.get(`/assignments/course/${selectedCourse}`);
      setAssignments(data);
    } catch { showToast('Failed to grade', 'error'); }
  };

  const pendingSubmissions = assignments.flatMap(a =>
    (a.submissions || []).filter(s => s.status === 'submitted').map(s => ({ ...s, assignment: a }))
  );

  const gradedSubmissions = assignments.flatMap(a =>
    (a.submissions || []).filter(s => s.status === 'graded').map(s => ({ ...s, assignment: a }))
  );

  return (
    <div>
      {ToastComponent}
      <div className="page-header">
        <div>
          <h1 className="page-title">Evaluations</h1>
          <p className="page-subtitle">Grade student assignment submissions</p>
        </div>
        <div className="flex gap-3">
          <span className="badge badge-yellow">{pendingSubmissions.length} Pending</span>
          <span className="badge badge-green">{gradedSubmissions.length} Graded</span>
        </div>
      </div>

      {courses.length > 0 && (
        <div className="flex gap-3 mb-6 flex-wrap">
          {courses.map(c => (
            <button key={c._id} onClick={() => setSelectedCourse(c._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCourse === c._id ? 'bg-purple-500 text-white' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'}`}>
              {c.title}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {pendingSubmissions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-yellow-100 bg-yellow-50 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <h2 className="font-semibold">Pending Grading ({pendingSubmissions.length})</h2>
            </div>
            <table className="data-table">
              <thead><tr><th>Student</th><th>Assignment</th><th>Submitted</th><th>File</th><th>Action</th></tr></thead>
              <tbody>
                {pendingSubmissions.map((s, i) => (
                  <tr key={i}>
                    <td className="font-medium">{s.student?.name || 'Student'}</td>
                    <td>{s.assignment.title}</td>
                    <td style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td><a href={s.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">View File</a></td>
                    <td>
                      <button className="btn btn-sm btn-primary"
                        onClick={() => { setGradeModal({ assignmentId: s.assignment._id, submissionId: s._id, studentName: s.student?.name }); setGradeForm({ marks: '', feedback: '' }); }}>
                        <Star className="w-3.5 h-3.5" />Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {gradedSubmissions.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-green-100 bg-green-50 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h2 className="font-semibold">Graded ({gradedSubmissions.length})</h2>
            </div>
            <table className="data-table">
              <thead><tr><th>Student</th><th>Assignment</th><th>Marks</th><th>Feedback</th></tr></thead>
              <tbody>
                {gradedSubmissions.map((s, i) => (
                  <tr key={i}>
                    <td className="font-medium">{s.student?.name || 'Student'}</td>
                    <td>{s.assignment.title}</td>
                    <td><span className="badge badge-green font-bold">{s.marks}/{s.assignment.totalMarks}</span></td>
                    <td className="max-w-xs truncate" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{s.feedback || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pendingSubmissions.length === 0 && gradedSubmissions.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
            <p className="font-medium">All caught up!</p>
            <p className="text-sm mt-1" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>No submissions to grade for this course yet.</p>
          </div>
        )}
      </div>

      {gradeModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-1">Grade Submission</h2>
            <p className="text-sm mb-5" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Student: {gradeModal.studentName}</p>
            <form onSubmit={handleGrade} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Marks*</label><input required type="number" className="form-input" value={gradeForm.marks} onChange={e => setGradeForm({...gradeForm, marks: e.target.value})} placeholder="e.g. 85" /></div>
              <div><label className="block text-sm font-medium mb-1">Feedback</label><textarea className="form-input" rows={3} value={gradeForm.feedback} onChange={e => setGradeForm({...gradeForm, feedback: e.target.value})} placeholder="Write feedback for the student..." /></div>
              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-secondary" onClick={() => setGradeModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-success"><Star className="w-4 h-4" />Submit Grade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerEvaluations;
