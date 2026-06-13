import { useState, useEffect, useContext } from 'react';
import { Search, Briefcase, MapPin, Building, Clock, CheckCircle, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import { useToast } from '../../components/Toast';

const JobPortal = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [applyModal, setApplyModal] = useState(null);
  const [applyForm, setApplyForm] = useState({ resumeUrl: '', coverLetter: '' });
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    API.get('/jobs').then(({ data }) => setJobs(data)).finally(() => setLoading(false));
  }, []);

  const hasApplied = (job) =>
    job.applications?.some(a => a.student === user?._id || a.student?._id === user?._id);

  const myApplication = (job) =>
    job.applications?.find(a => a.student === user?._id || a.student?._id === user?._id);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/jobs/${applyModal._id}/apply`, applyForm);
      setJobs(prev => prev.map(j => j._id === applyModal._id ? {
        ...j, applications: [...(j.applications || []), { student: user._id, ...applyForm, status: 'applied' }]
      } : j));
      setApplyModal(null);
      showToast('Application submitted successfully!');
    } catch (err) { showToast(err.response?.data?.message || 'Failed to apply', 'error'); }
  };

  const statusColor = { applied: 'badge-yellow', under_review: 'badge-blue', shortlisted: 'badge-purple', rejected: 'badge-red', hired: 'badge-green' };

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || j.jobType === filterType;
    return matchSearch && matchType;
  });

  return (
    <div>
      {ToastComponent}
      <div className="page-header">
        <div>
          <h1 className="page-title">Job Portal</h1>
          <p className="page-subtitle">{jobs.length} opportunities available</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: 'hsl(215.4 16.3% 55%)' }} />
          <input className="form-input pl-9" placeholder="Search jobs or companies..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['all', 'Full-time', 'Part-time', 'Internship', 'Contract'].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterType === t ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading && <div className="col-span-2 text-center py-16" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Loading jobs...</div>}
        {!loading && filtered.length === 0 && (
          <div className="col-span-2 text-center py-16">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>No jobs found</p>
          </div>
        )}
        {filtered.map(j => {
          const applied = hasApplied(j);
          const myApp = myApplication(j);
          return (
            <div key={j._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{j.title}</h3>
                    <p className="text-sm" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{j.company}</p>
                  </div>
                </div>
                <span className={`badge ${j.jobType === 'Internship' ? 'badge-yellow' : j.jobType === 'Part-time' ? 'badge-purple' : 'badge-green'}`}>{j.jobType}</span>
              </div>

              <p className="text-sm line-clamp-2 flex-1 mb-3" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{j.description}</p>

              <div className="flex flex-wrap gap-2 mb-4 text-xs" style={{ color: 'hsl(215.4 16.3% 55%)' }}>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{j.location}</span>
                {j.salary && <span>💰 {j.salary}</span>}
                {j.deadline && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Deadline: {new Date(j.deadline).toLocaleDateString()}</span>}
              </div>

              {j.eligibilityCriteria && (
                <div className="text-xs p-2 rounded-lg mb-4" style={{ background: 'hsl(210 40% 98%)', color: 'hsl(215.4 16.3% 46.9%)' }}>
                  <span className="font-medium">Eligibility: </span>{j.eligibilityCriteria}
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                <span className="text-xs" style={{ color: 'hsl(215.4 16.3% 55%)' }}>{j.applications?.length || 0} applicants</span>
                {applied ? (
                  <span className={`badge ${statusColor[myApp?.status] || 'badge-yellow'} flex items-center gap-1`}>
                    <CheckCircle className="w-3 h-3" />Applied · {myApp?.status?.replace('_', ' ')}
                  </span>
                ) : (
                  <button className="btn btn-sm btn-primary" onClick={() => { setApplyModal(j); setApplyForm({ resumeUrl: '', coverLetter: '' }); }}>
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {applyModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setApplyModal(null)}>
          <div className="modal-box">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold">Apply for Job</h2>
              <button onClick={() => setApplyModal(null)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm mb-5" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{applyModal.title} at {applyModal.company}</p>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Resume URL*</label>
                <input required className="form-input" value={applyForm.resumeUrl} onChange={e => setApplyForm({...applyForm, resumeUrl: e.target.value})} placeholder="Link to your resume (Google Drive, etc.)" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cover Letter</label>
                <textarea className="form-input" rows={4} value={applyForm.coverLetter} onChange={e => setApplyForm({...applyForm, coverLetter: e.target.value})} placeholder="Why are you a good fit for this role?" />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-secondary" onClick={() => setApplyModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPortal;
