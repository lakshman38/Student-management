import { useState, useEffect, useContext } from 'react';
import { Users, GraduationCap, ClipboardList, CheckCircle, Search, Mail } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import { useToast } from '../../components/Toast';

const TrainerStudents = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    API.get('/courses')
      .then(({ data }) => {
        const myCourses = data.filter(c => c.instructor?._id === user?._id || c.instructor === user?._id);
        setCourses(myCourses);
        if (myCourses.length > 0) {
          setSelectedCourse(myCourses[0]._id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        showToast('Failed to load courses', 'error');
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!selectedCourse) return;
    setLoading(true);

    // Fetch both course details (for enrolled students list) and assignments for progress calculation
    Promise.all([
      API.get(`/courses/${selectedCourse}`),
      API.get(`/assignments/course/${selectedCourse}`)
    ])
      .then(([courseRes, assignmentsRes]) => {
        setStudents(courseRes.data.studentsEnrolled || []);
        setAssignments(assignmentsRes.data || []);
      })
      .catch(() => showToast('Failed to load student progress data', 'error'))
      .finally(() => setLoading(false));
  }, [selectedCourse]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to count completed assignments for a student
  const getProgress = (studentId) => {
    if (assignments.length === 0) return { completed: 0, total: 0, percentage: 0 };
    let completed = 0;
    assignments.forEach(asg => {
      const isSubmitted = asg.submissions?.some(sub => sub.student === studentId || sub.student?._id === studentId);
      if (isSubmitted) completed++;
    });
    return {
      completed,
      total: assignments.length,
      percentage: Math.round((completed / assignments.length) * 100)
    };
  };

  return (
    <div>
      {ToastComponent}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Students</h1>
          <p className="page-subtitle">Monitor students enrolled in your courses and track their assignment progress</p>
        </div>
      </div>

      {/* Select Course Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: '1rem', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'hsl(215.4 16.3% 46.9%)', marginBottom: '0.5rem' }}>Select Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="form-input"
            style={{ width: '100%', border: '1px solid hsl(214.3 31.8% 85%)' }}
          >
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.title}</option>
            ))}
            {courses.length === 0 && <option value="">No courses created yet</option>}
          </select>
        </div>

        <div style={{ background: 'white', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: '1rem', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215.4 16.3% 46.9%)' }}>Enrolled Students</p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.75rem', fontWeight: 700, color: 'hsl(221.2 83.2% 53.3%)' }}>{students.length}</p>
        </div>

        <div style={{ background: 'white', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: '1rem', padding: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'hsl(215.4 16.3% 46.9%)' }}>Course Assignments</p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.75rem', fontWeight: 700, color: 'hsl(270 70% 50%)' }}>{assignments.length}</p>
        </div>
      </div>

      {/* Main Student list card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid hsl(214.3 31.8% 91.4%)', display: 'flex', alignItems: 'center', justifyContent: 'between', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Enrolled Students</h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'hsl(215.4 16.3% 55%)' }} />
            <input
              className="form-input"
              style={{ paddingLeft: '2.25rem', width: '100%' }}
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textCenter: 'center', color: 'hsl(215.4 16.3% 46.9%)', display: 'flex', justifyContent: 'center' }}>
            Loading students information...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'hsl(215.4 16.3% 46.9%)' }}>
            <Users style={{ width: '48px', height: '48px', color: 'hsl(215.4 16.3% 75%)', margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 500 }}>No students found in this course.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Email Address</th>
                  <th>Assignment Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => {
                  const progress = getProgress(student._id);
                  return (
                    <tr key={student._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'hsl(221.2 83.2% 93%)', color: 'hsl(221.2 83.2% 53.3%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600 }}>{student.name}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(215.4 16.3% 46.9%)' }}>
                          <Mail className="w-4 h-4" />
                          <span>{student.email}</span>
                        </div>
                      </td>
                      <td>
                        {progress.total === 0 ? (
                          <span className="badge badge-gray">No assignments</span>
                        ) : progress.completed === progress.total ? (
                          <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle className="w-3.5 h-3.5" /> All Submitted
                          </span>
                        ) : (
                          <span className="badge badge-blue">
                            {progress.completed} of {progress.total} Submitted
                          </span>
                        )}
                      </td>
                      <td style={{ width: '250px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ flex: 1, height: '8px', background: 'hsl(210 40% 93%)', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{ width: `${progress.percentage}%`, height: '100%', background: progress.percentage === 100 ? 'hsl(142 71% 45%)' : 'hsl(221.2 83.2% 53.3%)', borderRadius: '9999px' }} />
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'hsl(215.4 16.3% 46.9%)', minWidth: '32px', textAlign: 'right' }}>
                            {progress.percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerStudents;
