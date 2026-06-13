import { useState, useEffect } from 'react';
import { Search, Eye, ClipboardList, Clock } from 'lucide-react';
import API from '../../utils/api';
import { useToast } from '../../components/Toast';

const AdminAssignments = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    API.get('/courses')
      .then(({ data }) => {
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0]._id);
        }
      })
      .catch(() => showToast('Failed to load courses', 'error'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      API.get(`/assignments/course/${selectedCourse}`)
        .then(({ data }) => setAssignments(data))
        .catch(() => showToast('Failed to load assignments', 'error'));
    } else {
      setAssignments([]);
    }
  }, [selectedCourse]);

  return (
    <div>
      {ToastComponent}
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments Management</h1>
          <p className="page-subtitle">Oversee all course assignments and student submissions</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Course Selection */}
        <div style={{ background: 'white', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: '1rem', padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList className="w-4 h-4 text-primary" />
            Select Course
          </h3>
          {loading ? (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'hsl(215.4 16.3% 46.9%)', fontSize: '0.875rem' }}>Loading courses...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {courses.map(c => (
                <button
                  key={c._id}
                  onClick={() => setSelectedCourse(c._id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: selectedCourse === c._id ? 'hsl(221.2 83.2% 95%)' : 'transparent',
                    color: selectedCourse === c._id ? 'hsl(221.2 83.2% 45%)' : 'hsl(222.2 47.4% 11.2%)',
                    fontWeight: selectedCourse === c._id ? 600 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  className="card-hover"
                >
                  <p style={{ margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{c.title}</p>
                  <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: selectedCourse === c._id ? 'hsl(221.2 83.2% 50%)' : 'hsl(215.4 16.3% 55%)' }}>
                    Instructor: {c.instructor?.name || 'N/A'}
                  </p>
                </button>
              ))}
              {courses.length === 0 && (
                <p style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', textAlign: 'center' }}>No courses in system.</p>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Assignment List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {selectedCourse ? (
            assignments.length === 0 ? (
              <div style={{ background: 'white', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: '1rem', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                <ClipboardList style={{ width: '48px', height: '48px', color: 'hsl(215.4 16.3% 75%)', marginBottom: '1rem' }} />
                <p style={{ color: 'hsl(215.4 16.3% 46.9%)', fontWeight: 500 }}>No assignments found for this course.</p>
              </div>
            ) : (
              assignments.map(a => {
                const totalSub = a.submissions?.length || 0;
                const gradedSub = a.submissions?.filter(s => s.status === 'graded').length || 0;
                const pendingSub = totalSub - gradedSub;

                return (
                  <div key={a._id} className="stat-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, paddingRight: '1.5rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'hsl(222.2 84% 4.9%)' }}>{a.title}</h3>
                      <p style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', margin: '0.375rem 0 1rem 0', lineHeight: 1.4 }}>{a.description}</p>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-blue">Max: {a.totalMarks} marks</span>
                        <span className="badge badge-yellow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock style={{ width: '12px', height: '12px' }} />
                          Due: {new Date(a.dueDate).toLocaleDateString()}
                        </span>
                        <span className="badge badge-purple">{totalSub} Submissions</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'hsl(38 92% 95%)', color: 'hsl(38 92% 35%)', borderRadius: '0.75rem', width: '64px', height: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{pendingSub}</span>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 500 }}>Pending</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'hsl(142 71% 94%)', color: 'hsl(142 71% 30%)', borderRadius: '0.75rem', width: '64px', height: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{gradedSub}</span>
                          <span style={{ fontSize: '0.6875rem', fontWeight: 500 }}>Graded</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            <div style={{ background: 'white', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: '1rem', padding: '4rem 2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
              <p style={{ color: 'hsl(215.4 16.3% 46.9%)', fontWeight: 500 }}>Select a course to view assignments.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminAssignments;
