import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, MapPin, Building, Clock } from 'lucide-react';
import API from '../../utils/api';
import { useToast } from '../../components/Toast';

const AdminJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ title: '', company: '', description: '', location: '', salary: '', jobType: 'Full-time', eligibilityCriteria: '', deadline: '' });
  const { showToast, ToastComponent } = useToast();

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try { const { data } = await API.get('/jobs'); setJobs(data); }
    catch { showToast('Failed to load jobs', 'error'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/jobs', form);
      setJobs(prev => [data, ...prev]);
      setShowModal(false);
      setForm({ title: '', company: '', description: '', location: '', salary: '', jobType: 'Full-time', eligibilityCriteria: '', deadline: '' });
      showToast('Job posted successfully!');
    } catch { showToast('Failed to post job', 'error'); }
  };

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {ToastComponent}
      <div className="page-header">
        <div>
          <h1 className="page-title">Job Management</h1>
          <p className="page-subtitle">{jobs.length} jobs posted</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />Post New Job
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: 'hsl(215.4 16.3% 55%)' }} />
          <input className="form-input pl-9" placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? <div className="col-span-3 text-center py-12" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Loading...</div> :
          filtered.map(j => (
            <div key={j._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-base">{j.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-sm" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>
                    <Building className="w-3.5 h-3.5" />{j.company}
                  </div>
                </div>
                <span className={`badge ${j.jobType === 'Internship' ? 'badge-yellow' : j.jobType === 'Part-time' ? 'badge-purple' : 'badge-green'}`}>{j.jobType}</span>
              </div>
              <div className="flex items-center gap-3 text-sm mb-3" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{j.location}</span>
                {j.salary && <span>💰 {j.salary}</span>}
              </div>
              <p className="text-sm line-clamp-2 mb-4" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{j.description}</p>
              <div className="flex items-center justify-between">
                <span className="badge badge-blue">{j.applications?.length || 0} Applications</span>
                {j.deadline && <span className="text-xs flex items-center gap-1" style={{ color: 'hsl(215.4 16.3% 55%)' }}><Clock className="w-3 h-3" />Due: {new Date(j.deadline).toLocaleDateString()}</span>}
              </div>
            </div>
          ))}
        {!loading && filtered.length === 0 && <div className="col-span-3 text-center py-16" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>No jobs posted yet. Post your first job!</div>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <h2 className="text-xl font-bold mb-5">Post New Job</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Job Title*</label><input required className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Frontend Developer" /></div>
                <div><label className="block text-sm font-medium mb-1">Company*</label><input required className="form-input" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Company name" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Description*</label><textarea required className="form-input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Job description..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Location*</label><input required className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="City or Remote" /></div>
                <div><label className="block text-sm font-medium mb-1">Salary</label><input className="form-input" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} placeholder="e.g. ₹5-8 LPA" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Job Type</label>
                  <select className="form-input" value={form.jobType} onChange={e => setForm({...form, jobType: e.target.value})}>
                    <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Deadline</label><input type="date" className="form-input" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Eligibility Criteria</label><input className="form-input" value={form.eligibilityCriteria} onChange={e => setForm({...form, eligibilityCriteria: e.target.value})} placeholder="e.g. B.Tech in CS, min 6.5 CGPA" /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobManagement;
