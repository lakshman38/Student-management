import { useState, useEffect, useContext } from 'react';
import { ClipboardList, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import { useToast } from '../../components/Toast';

const StudentAssignments = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [submitModal, setSubmitModal] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    API.get('/courses').then(({ data }) => {
      const enrolled = data.filter(c => c.studentsEnrolled?.some(s => s === user?._id || s?._id === user?._id));
      setCourses(enrolled);
      if (enrolled.length > 0) setSelectedCourse(enrolled[0]._id);
    });
  }, [user]);

  useEffect(() => {
    if (selectedCourse) {
      API.get(`/assignments/course/${selectedCourse}`).then(({ data }) => setAssignments(data)).catch(() => {});
    }
  }, [selectedCourse]);

  const mySubmission = (a) => a.submissions?.find(s => s.student === user?._id || s.student?._id === user?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/assignments/${submitModal._id}/submit`, { fileUrl });
      const { data } = await API.get(`/assignments/course/${selectedCourse}`);
      setAssignments(data);
      setSubmitModal(null);
      showToast('Assignment submitted!');
    } catch (err) { showToast(err.response?.data?.message || 'Failed to submit', 'error'); }
  };

  const overdue = (a) => new Date(a.dueDate) < new Date();

  return (
    <div>
      {ToastComponent}
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">View and submit your course assignments</p>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Enroll in courses to see assignments.</p>
          <a href="/dashboard/courses" className="btn btn-primary mt-4 inline-flex">Browse Courses</a>
        </div>
      ) : (
        <>
          <div className="flex gap-3 mb-6 flex-wrap">
            {courses.map(c => (
              <button key={c._id} onClick={() => setSelectedCourse(c._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCourse === c._id ? 'bg-blue-500 text-white' : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                {c.title}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {assignments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>
                No assignments for this course yet.
              </div>
            ) : assignments.map(a => {
              const sub = mySubmission(a);
              const isOverdue = overdue(a);
              return (
                <div key={a._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold">{a.title}</h3>
                        {sub ? (
                          sub.status === 'graded' ? (
                            <span className="badge badge-green flex items-center gap-1"><CheckCircle className="w-3 h-3" />Graded</span>
                          ) : (
                            <span className="badge badge-blue flex items-center gap-1"><CheckCircle className="w-3 h-3" />Submitted</span>
                          )
                        ) : isOverdue ? (
                          <span className="badge badge-red flex items-center gap-1"><AlertCircle className="w-3 h-3" />Overdue</span>
                        ) : (
                          <span className="badge badge-yellow flex items-center gap-1"><Clock className="w-3 h-3" />Pending</span>
                        )}
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{a.description}</p>
                      <div className="flex gap-3 mt-3 text-sm" style={{ color: 'hsl(215.4 16.3% 55%)' }}>
                        <span>Max Marks: <strong className="text-gray-800">{a.totalMarks}</strong></span>
                        <span>Due: <strong className={isOverdue && !sub ? 'text-red-500' : 'text-gray-800'}>{new Date(a.dueDate).toLocaleDateString()}</strong></span>
                      </div>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      {sub?.status === 'graded' ? (
                        <div>
                          <p className="text-3xl font-bold text-green-600">{sub.marks}</p>
                          <p className="text-xs" style={{ color: 'hsl(215.4 16.3% 55%)' }}>out of {a.totalMarks}</p>
                          {sub.feedback && <p className="text-xs mt-1 max-w-36 text-right" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{sub.feedback}</p>}
                        </div>
                      ) : !sub && !isOverdue ? (
                        <button className="btn btn-primary btn-sm" onClick={() => { setSubmitModal(a); setFileUrl(''); }}>
                          Submit
                        </button>
                      ) : sub ? (
                        <span className="text-xs" style={{ color: 'hsl(215.4 16.3% 55%)' }}>Awaiting grade</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {submitModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSubmitModal(null)}>
          <div className="modal-box">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">Submit Assignment</h2>
              <button onClick={() => setSubmitModal(null)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm mb-5" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{submitModal.title}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Submission File URL*</label>
                <input required className="form-input" value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="Link to your submission (Google Drive, GitHub, etc.)" />
                <p className="text-xs mt-1" style={{ color: 'hsl(215.4 16.3% 55%)' }}>Upload your file to Google Drive/GitHub and paste the link here.</p>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-secondary" onClick={() => setSubmitModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
