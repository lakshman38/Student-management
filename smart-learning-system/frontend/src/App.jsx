import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin pages
import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import AdminCourseManagement from './pages/admin/AdminCourseManagement';
import AdminJobManagement from './pages/admin/AdminJobManagement';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminAssignments from './pages/admin/AdminAssignments';

// Trainer pages
import TrainerOverview from './pages/trainer/TrainerOverview';
import TrainerCourses from './pages/trainer/TrainerCourses';
import TrainerAssignments from './pages/trainer/TrainerAssignments';
import TrainerEvaluations from './pages/trainer/TrainerEvaluations';
import TrainerStudents from './pages/trainer/TrainerStudents';

// Student pages
import StudentOverview from './pages/student/StudentOverview';
import BrowseCourses from './pages/student/BrowseCourses';
import StudentAssignments from './pages/student/StudentAssignments';
import JobPortal from './pages/student/JobPortal';
import StudentProfile from './pages/student/StudentProfile';

// Protected dashboard layout
const DashboardLayout = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '1.125rem', color: 'hsl(215.4 16.3% 46.9%)' }}>
      Loading...
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-content">
          <Routes>
            {user.role === 'admin' && (
              <>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="courses" element={<AdminCourseManagement />} />
                <Route path="assignments" element={<AdminAssignments />} />
                <Route path="jobs" element={<AdminJobManagement />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="*" element={<AdminOverview />} />
              </>
            )}
            {user.role === 'trainer' && (
              <>
                <Route index element={<TrainerOverview />} />
                <Route path="my-courses" element={<TrainerCourses />} />
                <Route path="assignments" element={<TrainerAssignments />} />
                <Route path="evaluations" element={<TrainerEvaluations />} />
                <Route path="students" element={<TrainerStudents />} />
                <Route path="*" element={<TrainerOverview />} />
              </>
            )}
            {user.role === 'student' && (
              <>
                <Route index element={<StudentOverview />} />
                <Route path="courses" element={<BrowseCourses />} />
                <Route path="my-courses" element={<BrowseCourses />} />
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="jobs" element={<JobPortal />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="*" element={<StudentOverview />} />
              </>
            )}
          </Routes>
        </div>
      </main>
    </div>
  );
};

// Public layout with Navbar
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
      {children}
    </main>
  </>
);

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <PublicLayout><Register /></PublicLayout>} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
