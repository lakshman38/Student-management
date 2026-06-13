import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Users, BookOpen, Briefcase, ClipboardList, TrendingUp, Activity } from 'lucide-react';
import API from '../../utils/api';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="stat-card card-hover flex items-center gap-4">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{label}</p>
      <p className="text-3xl font-bold" style={{ color: 'hsl(222.2 84% 4.9%)' }}>{value ?? '—'}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'hsl(215.4 16.3% 55%)' }}>{sub}</p>}
    </div>
  </div>
);

const AdminOverview = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/analytics')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const roleColor = { admin: 'text-red-500', trainer: 'text-purple-500', student: 'text-blue-500' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name} — here's your system overview</p>
        </div>
        <span className="badge badge-red">Admin</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="stat-card h-24 animate-pulse bg-gray-100 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            <StatCard icon={Users} label="Total Students" value={stats?.totalStudents} color="bg-blue-500" />
            <StatCard icon={Activity} label="Total Trainers" value={stats?.totalTrainers} color="bg-purple-500" />
            <StatCard icon={BookOpen} label="Total Courses" value={stats?.totalCourses} color="bg-green-500" />
            <StatCard icon={Briefcase} label="Active Jobs" value={stats?.totalJobs} color="bg-orange-500" />
            <StatCard icon={ClipboardList} label="Assignments" value={stats?.totalAssignments} color="bg-pink-500" />
            <StatCard icon={TrendingUp} label="Submissions" value={stats?.totalSubmissions} color="bg-cyan-500" />
            <StatCard icon={Users} label="Applications" value={stats?.totalApplications} color="bg-yellow-500" />
            <StatCard icon={Users} label="Total Admins" value={stats?.totalAdmins} color="bg-red-500" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg" style={{ color: 'hsl(222.2 84% 4.9%)' }}>Recent Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentUsers?.map(u => (
                    <tr key={u._id}>
                      <td className="font-medium">{u.name}</td>
                      <td style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{u.email}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-red' : u.role === 'trainer' ? 'badge-purple' : 'badge-blue'}`}>{u.role}</span></td>
                      <td><span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOverview;
