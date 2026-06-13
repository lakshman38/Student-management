import { useState, useEffect, useContext } from 'react';
import { Search, BookOpen, Users, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../utils/api';
import { useToast } from '../../components/Toast';

const BrowseCourses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    API.get('/courses').then(({ data }) => setCourses(data)).finally(() => setLoading(false));
  }, []);

  const isEnrolled = (course) =>
    course.studentsEnrolled?.some(s => s === user?._id || s?._id === user?._id);

  const handleEnroll = async (courseId) => {
    try {
      await API.post(`/courses/${courseId}/enroll`);
      setCourses(prev => prev.map(c => c._id === courseId ? { ...c, studentsEnrolled: [...(c.studentsEnrolled || []), user._id] } : c));
      showToast('Successfully enrolled!');
    } catch (err) { showToast(err.response?.data?.message || 'Failed to enroll', 'error'); }
  };

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {ToastComponent}
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Courses</h1>
          <p className="page-subtitle">{courses.length} courses available</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: 'hsl(215.4 16.3% 55%)' }} />
          <input className="form-input pl-9" placeholder="Search courses by title or category..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading && <div className="col-span-3 text-center py-16" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>Loading courses...</div>}
        {!loading && filtered.length === 0 && (
          <div className="col-span-3 text-center py-16">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>No courses found</p>
          </div>
        )}
        {filtered.map(c => {
          const enrolled = isEnrolled(c);
          return (
            <div key={c._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover flex flex-col">
              <div className="h-2 w-full" style={{ background: enrolled ? 'hsl(142 71% 45%)' : 'hsl(221.2 83.2% 53.3%)' }} />
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <span className="badge badge-blue">{c.category}</span>
                  {c.price === 0 ? <span className="badge badge-green">Free</span> : <span className="badge badge-yellow">₹{c.price}</span>}
                </div>
                <h3 className="font-semibold text-base mt-2 mb-1">{c.title}</h3>
                <p className="text-sm line-clamp-2 flex-1" style={{ color: 'hsl(215.4 16.3% 46.9%)' }}>{c.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-sm" style={{ color: 'hsl(215.4 16.3% 55%)' }}>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{c.studentsEnrolled?.length || 0}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{c.modules?.length || 0} modules</span>
                  </div>
                  {enrolled ? (
                    <button className="btn btn-sm btn-success" disabled><Plus className="w-3.5 h-3.5" />Enrolled</button>
                  ) : (
                    <button className="btn btn-sm btn-primary" onClick={() => handleEnroll(c._id)}>Enroll Now</button>
                  )}
                </div>
                {c.modules?.length > 0 && (
                  <button onClick={() => setExpandedCourse(expandedCourse === c._id ? null : c._id)} className="mt-3 text-xs flex items-center gap-1 font-medium" style={{ color: 'hsl(221.2 83.2% 53.3%)' }}>
                    {expandedCourse === c._id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {expandedCourse === c._id ? 'Hide' : 'View'} modules
                  </button>
                )}
                {expandedCourse === c._id && (
                  <div className="mt-3 space-y-1">
                    {c.modules.map((m, i) => (
                      <div key={i} className="text-xs p-2 rounded-lg flex items-center gap-2" style={{ background: 'hsl(210 40% 98%)' }}>
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">{i+1}</span>
                        {m.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrowseCourses;
