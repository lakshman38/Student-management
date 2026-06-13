import { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Users } from 'lucide-react';
import API from '../../utils/api';
import { useToast } from '../../components/Toast';

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    API.get('/courses').then(({ data }) => setCourses(data)).catch(() => showToast('Failed to load courses', 'error')).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course permanently?')) return;
    try {
      await API.delete(`/admin/courses/${id}`);
      setCourses(prev => prev.filter(c => c._id !== id));
      showToast('Course deleted');
    } catch { showToast('Failed to delete course', 'error'); }
  };

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {ToastComponent}
      <div className="page-header">
        <div>
          <h1 className="page-title">Course Management</h1>
          <p className="page-subtitle">{courses.length} courses in the system</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: 'hsl(215.4 16.3% 55%)' }} />
          <input className="form-input pl-9" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Course</th><th>Category</th><th>Instructor</th><th>Students</th><th>Modules</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id}>
                    <td>
                      <div>
                        <p className="font-medium">{c.title}</p>
                        <p className="text-xs mt-0.5 truncate max-w-xs" style={{ color: 'hsl(215.4 16.3% 55%)' }}>{c.description}</p>
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{c.category}</span></td>
                    <td style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{c.instructor?.name || 'N/A'}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" style={{ color: 'hsl(215.4 16.3% 55%)' }} />
                        <span>{c.studentsEnrolled?.length || 0}</span>
                      </div>
                    </td>
                    <td>{c.modules?.length || 0}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="btn btn-sm btn-secondary"><Eye className="w-4 h-4" />View</button>
                        <button onClick={() => handleDelete(c._id)} className="btn btn-sm btn-danger"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>No courses found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseManagement;
