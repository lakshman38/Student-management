import { useState, useEffect, useContext } from 'react';
import { Plus, CheckCircle, Clock, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import { useToast } from '../../components/Toast';

const TrainerAssignments = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', courseId: '', dueDate: '', totalMarks: 100 });
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    API.get('/courses').then(({ data }) => {
      const mine = data.filter(c => c.instructor?._id === user?._id || c.instructor === user?._id);
      setCourses(mine);
      if (mine.length > 0) { setSelectedCourse(mine[0]._id); setForm(f => ({ ...f, courseId: mine[0]._id })); }
    });
  }, [user]);

  useEffect(() => {
    if (selectedCourse) {
      API.get(`/assignments/course/${selectedCourse}`).then(({ data }) => setAssignments(data)).catch(() => {});
    }
  }, [selectedCourse]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/assignments', form);
      setAssignments(prev => [data, ...prev]);
      setShowModal(false);
      showToast('Assignment created!');
    } catch { showToast('Failed to create assignment', 'error'); }
  };

  return (
    <div>
      {ToastComponent}
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">Create and manage course assignments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" />Create Assignment</button>
      </div>

      {courses.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex gap-3 flex-wrap">
          {courses.map(c => (
            <button key={c._id} onClick={() => setSelectedCourse(c._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCourse === c._id ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {c.title}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <p style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>No assignments for this course yet.</p>
          </div>
        ) : (
          assignments.map(a => {
            const pending = a.submissions?.filter(s => s.status === 'submitted').length || 0;
            const graded = a.submissions?.filter(s => s.status === 'graded').length || 0;
            return (
              <div key={a._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base">{a.title}</h3>
                    <p className="text-sm mt-1" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{a.description}</p>
                    <div className="flex gap-3 mt-3">
                      <span className="badge badge-blue">Max: {a.totalMarks} marks</span>
                      <span className="badge badge-yellow flex items-center gap-1"><Clock className="w-3 h-3" />Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                      <span className="badge badge-purple">{a.submissions?.length || 0} Submissions</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-center ml-4">
                    <div className="bg-yellow-50 rounded-xl p-3 min-w-16">
                      <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                      <p className="text-xs text-yellow-500 font-medium">Pending</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 min-w-16">
                      <p className="text-2xl font-bold text-green-600">{graded}</p>
                      <p className="text-xs text-green-500 font-medium">Graded</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Create Assignment</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Select Course*</label>
                <select required className="form-input" value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})}>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium mb-1">Assignment Title*</label><input required className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Build a Todo App" /></div>
              <div><label className="block text-sm font-medium mb-1">Description*</label><textarea required className="form-input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Due Date*</label><input required type="date" className="form-input" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Total Marks*</label><input required type="number" className="form-input" value={form.totalMarks} onChange={e => setForm({...form, totalMarks: Number(e.target.value)})} /></div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerAssignments;
