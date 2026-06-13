import { useState, useEffect, useContext } from 'react';
import { BookOpen, CheckCircle, Clock, Briefcase, TrendingUp } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';

const StudentOverview = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/courses'), API.get('/jobs')])
      .then(([cRes, jRes]) => {
        const enrolled = cRes.data.filter(c => c.studentsEnrolled?.includes(user?._id) || c.studentsEnrolled?.some(s => s._id === user?._id || s === user?._id));
        setCourses(enrolled);
        const applied = jRes.data.filter(j => j.applications?.some(a => a.student === user?._id || a.student?._id === user?._id));
        setJobs(applied);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}! Keep learning and growing.</p>
        </div>
        <span className="badge badge-blue">Student</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <div className="stat-card card-hover flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center"><BookOpen className="w-7 h-7 text-white" /></div>
          <div><p className="text-sm font-medium" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Enrolled Courses</p><p className="text-3xl font-bold">{courses.length}</p></div>
        </div>
        <div className="stat-card card-hover flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center"><CheckCircle className="w-7 h-7 text-white" /></div>
          <div><p className="text-sm font-medium" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Courses Active</p><p className="text-3xl font-bold">{courses.length}</p></div>
        </div>
        <div className="stat-card card-hover flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center"><Briefcase className="w-7 h-7 text-white" /></div>
          <div><p className="text-sm font-medium" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Job Applications</p><p className="text-3xl font-bold">{jobs.length}</p></div>
        </div>
        <div className="stat-card card-hover flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center"><TrendingUp className="w-7 h-7 text-white" /></div>
          <div><p className="text-sm font-medium" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Progress</p><p className="text-3xl font-bold">—</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Enrolled Courses</h2>
            <a href="/dashboard/my-courses" className="text-sm font-medium" style={{ color: 'hsl(221.2 83.2% 53.3%)' }}>View All →</a>
          </div>
          {courses.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No courses enrolled. <a href="/dashboard/courses" className="text-blue-500 hover:underline">Browse courses</a></p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {courses.slice(0, 4).map(c => (
                <div key={c._id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-sm">{c.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215.4 16.3% 55%)' }}>{c.category}</p>
                  </div>
                  <span className="badge badge-blue">{c.modules?.length || 0} modules</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Job Applications</h2>
            <a href="/dashboard/jobs" className="text-sm font-medium" style={{ color: 'hsl(221.2 83.2% 53.3%)' }}>View All →</a>
          </div>
          {jobs.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>
              <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No applications yet. <a href="/dashboard/jobs" className="text-blue-500 hover:underline">Browse jobs</a></p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {jobs.slice(0, 4).map(j => {
                const myApp = j.applications?.find(a => a.student === user?._id || a.student?._id === user?._id);
                return (
                  <div key={j._id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-sm">{j.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'hsl(215.4 16.3% 55%)' }}>{j.company}</p>
                    </div>
                    <span className={`badge ${myApp?.status === 'hired' ? 'badge-green' : myApp?.status === 'rejected' ? 'badge-red' : myApp?.status === 'shortlisted' ? 'badge-purple' : 'badge-yellow'}`}>
                      {myApp?.status || 'applied'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
