import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { Activity, Award, UserCheck, Briefcase } from 'lucide-react';
import API from '../../utils/api';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/analytics')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'hsl(215.4 16.3% 46.9%)' }}>
        Loading analytics...
      </div>
    );
  }

  // Data for User Roles Pie Chart
  const userRolesData = [
    { name: 'Students', value: stats?.totalStudents || 0 },
    { name: 'Trainers', value: stats?.totalTrainers || 0 },
    { name: 'Admins', value: stats?.totalAdmins || 0 }
  ].filter(item => item.value > 0);

  const COLORS = ['hsl(221.2 83.2% 53.3%)', 'hsl(270 70% 50%)', 'hsl(0 84.2% 60.2%)'];

  // Data for System Assets Bar Chart
  const assetData = [
    { name: 'Courses', count: stats?.totalCourses || 0 },
    { name: 'Assignments', count: stats?.totalAssignments || 0 },
    { name: 'Jobs', count: stats?.totalJobs || 0 }
  ];

  // Data for Activity Level Area Chart
  const activityData = [
    { name: 'Submissions', count: stats?.totalSubmissions || 0 },
    { name: 'Job Apps', count: stats?.totalApplications || 0 }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">Real-time charts and reports on platform usage</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'hsl(221.2 83.2% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity style={{ color: 'hsl(221.2 83.2% 53.3%)', width: '24px', height: '24px' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', fontWeight: 500 }}>Total Submissions</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.totalSubmissions || 0}</p>
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'hsl(142 71% 92%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck style={{ color: 'hsl(142 71% 35%)', width: '24px', height: '24px' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', fontWeight: 500 }}>Total Applications</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.totalApplications || 0}</p>
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'hsl(270 70% 93%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award style={{ color: 'hsl(270 70% 45%)', width: '24px', height: '24px' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', fontWeight: 500 }}>Avg Submissions/Course</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {stats?.totalCourses ? (stats.totalSubmissions / stats.totalCourses).toFixed(1) : 0}
            </p>
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'hsl(38 92% 92%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase style={{ color: 'hsl(38 92% 35%)', width: '24px', height: '24px' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', fontWeight: 500 }}>Avg Apps/Job Posting</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {stats?.totalJobs ? (stats.totalApplications / stats.totalJobs).toFixed(1) : 0}
            </p>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
        
        {/* User Roles Pie Chart */}
        <div style={{ background: 'white', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>User Role Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRolesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userRolesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Users`, 'Count']} />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content & Job Assets Bar Chart */}
        <div style={{ background: 'white', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>System Assets Comparison</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }} />
                <Bar dataKey="count" fill="hsl(221.2 83.2% 53.3%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Engagement Metrics */}
        <div style={{ background: 'white', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Platform Engagement Overview</h3>
          <div style={{ height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(270 70% 50%)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(270 70% 50%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="hsl(270 70% 50%)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
