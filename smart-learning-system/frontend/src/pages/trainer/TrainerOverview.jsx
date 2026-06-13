import { useState, useEffect, useContext } from 'react';
import { BookOpen, Users, ClipboardList, Star } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card card-hover flex items-center gap-4">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{label}</p>
      <p className="text-3xl font-bold">{value ?? '—'}</p>
    </div>
  </div>
);

const TrainerOverview = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/courses')])
      .then(([coursesRes]) => {
        const myCourses = coursesRes.data.filter(c => c.instructor?._id === user?._id || c.instructor === user?._id);
        setCourses(myCourses);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const totalStudents = courses.reduce((acc, c) => acc + (c.studentsEnrolled?.length || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Trainer Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}! Manage your courses and students.</p>
        </div>
        <span className="badge badge-purple">Trainer</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <StatCard icon={BookOpen} label="My Courses" value={courses.length} color="bg-purple-500" />
        <StatCard icon={Users} label="Total Students" value={totalStudents} color="bg-blue-500" />
        <StatCard icon={ClipboardList} label="Assignments" value={assignments.length} color="bg-pink-500" />
        <StatCard icon={Star} label="Active Courses" value={courses.length} color="bg-green-500" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-lg">My Courses</h2>
          <a href="/dashboard/my-courses" className="text-sm font-medium" style={{ color: 'hsl(221.2 83.2% 53.3%)' }}>View All →</a>
        </div>
        {loading ? (
          <div className="p-12 text-center" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Loading...</div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>You haven't created any courses yet.</p>
            <a href="/dashboard/my-courses" className="btn btn-primary mt-4 inline-flex">Create Your First Course</a>
          </div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Course</th><th>Category</th><th>Students</th><th>Modules</th></tr></thead>
            <tbody>
              {courses.slice(0, 5).map(c => (
                <tr key={c._id}>
                  <td className="font-medium">{c.title}</td>
                  <td><span className="badge badge-purple">{c.category}</span></td>
                  <td>{c.studentsEnrolled?.length || 0}</td>
                  <td>{c.modules?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TrainerOverview;
