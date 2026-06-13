import { useState, useEffect, useContext } from 'react';
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import { useToast } from '../../components/Toast';

const emptyForm = { title: '', description: '', category: '', price: 0, modules: [] };

const TrainerCourses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await API.get('/courses');
      setCourses(data.filter(c => c.instructor?._id === user?._id || c.instructor === user?._id));
    } catch { showToast('Failed to load courses', 'error'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c) => { setEditId(c._id); setForm({ title: c.title, description: c.description, category: c.category, price: c.price, modules: c.modules || [] }); setShowModal(true); };

  const addModule = () => setForm(f => ({ ...f, modules: [...f.modules, { title: '', description: '', videoUrl: '', pdfUrl: '' }] }));
  const updateModule = (i, key, val) => setForm(f => { const m = [...f.modules]; m[i] = { ...m[i], [key]: val }; return { ...f, modules: m }; });
  const removeModule = (i) => setForm(f => ({ ...f, modules: f.modules.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const { data } = await API.put(`/courses/${editId}`, form);
        setCourses(prev => prev.map(c => c._id === editId ? data : c));
        showToast('Course updated!');
      } else {
        const { data } = await API.post('/courses', form);
        setCourses(prev => [data, ...prev]);
        showToast('Course created!');
      }
      setShowModal(false);
    } catch { showToast('Failed to save course', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await API.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c._id !== id));
      showToast('Course deleted');
    } catch { showToast('Failed to delete course', 'error'); }
  };

  return (
    <div>
      {ToastComponent}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Courses</h1>
          <p className="page-subtitle">{courses.length} courses you manage</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus className="w-4 h-4" />Create Course</button>
      </div>

      <div className="space-y-4">
        {loading && <div className="text-center py-16" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Loading...</div>}
        {!loading && courses.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <p className="text-lg font-medium mb-2">No courses yet</p>
            <p className="text-sm mb-4" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Create your first course to get started.</p>
            <button className="btn btn-primary" onClick={openCreate}><Plus className="w-4 h-4" />Create Course</button>
          </div>
        )}
        {courses.map(c => (
          <div key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-base">{c.title}</h3>
                  <span className="badge badge-purple">{c.category}</span>
                  <span className="badge badge-blue">{c.studentsEnrolled?.length || 0} students</span>
                  <span className="badge badge-gray">{c.modules?.length || 0} modules</span>
                </div>
                <p className="text-sm mt-1 truncate" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{c.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <button className="btn btn-sm btn-secondary" onClick={() => openEdit(c)}><Edit2 className="w-3.5 h-3.5" />Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}><Trash2 className="w-3.5 h-3.5" /></button>
                <button className="btn btn-sm btn-ghost" onClick={() => setExpandedCourse(expandedCourse === c._id ? null : c._id)}>
                  {expandedCourse === c._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {expandedCourse === c._id && c.modules?.length > 0 && (
              <div className="border-t border-gray-100 px-5 pb-5">
                <h4 className="text-sm font-semibold mt-4 mb-3" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>MODULES</h4>
                <div className="space-y-2">
                  {c.modules.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'hsl(210 40% 98%)' }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white bg-purple-500 flex-shrink-0">{i + 1}</div>
                      <div>
                        <p className="text-sm font-medium">{m.title}</p>
                        {m.description && <p className="text-xs" style={{ color: 'hsl(215.4 16.3% 55%)' }}>{m.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box" style={{ maxWidth: '640px' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{editId ? 'Edit Course' : 'Create New Course'}</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Course Title*</label><input required className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Advanced React Patterns" /></div>
              <div><label className="block text-sm font-medium mb-1">Description*</label><textarea required className="form-input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Category*</label><input required className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Development" /></div>
                <div><label className="block text-sm font-medium mb-1">Price (₹)</label><input type="number" className="form-input" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} /></div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Modules</label>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={addModule}><Plus className="w-3.5 h-3.5" />Add Module</button>
                </div>
                <div className="space-y-3 max-h-52 overflow-y-auto">
                  {form.modules.map((m, i) => (
                    <div key={i} className="p-3 rounded-lg border border-gray-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center flex-shrink-0">{i+1}</span>
                        <input className="form-input flex-1" placeholder="Module title" value={m.title} onChange={e => updateModule(i, 'title', e.target.value)} />
                        <button type="button" onClick={() => removeModule(i)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                      </div>
                      <input className="form-input" placeholder="Module description" value={m.description} onChange={e => updateModule(i, 'description', e.target.value)} />
                      <div className="grid grid-cols-2 gap-2">
                        <input className="form-input" placeholder="Video URL (optional)" value={m.videoUrl} onChange={e => updateModule(i, 'videoUrl', e.target.value)} />
                        <input className="form-input" placeholder="PDF URL (optional)" value={m.pdfUrl} onChange={e => updateModule(i, 'pdfUrl', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editId ? 'Update Course' : 'Create Course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerCourses;
