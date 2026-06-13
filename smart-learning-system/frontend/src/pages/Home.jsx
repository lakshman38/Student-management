import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Briefcase, Users, Star, ArrowRight } from 'lucide-react';

const Home = () => (
  <div>
    {/* Hero */}
    <div style={{ textAlign: 'center', padding: '5rem 1rem 4rem', maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'hsl(221.2 83.2% 93%)', color: 'hsl(221.2 83.2% 40%)', borderRadius: '9999px', padding: '0.375rem 1rem', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        <Star style={{ width: '14px', height: '14px' }} />New: AI-powered learning recommendations
      </div>
      <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
        Learn, Grow &amp; Land Your<br />
        <span style={{ background: 'linear-gradient(135deg, hsl(221.2 83.2% 53.3%), hsl(270 70% 60%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Career</span>
      </h1>
      <p style={{ fontSize: '1.125rem', color: 'hsl(215.4 16.3% 46.9%)', marginBottom: '2.5rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
        The all-in-one platform for students to learn from expert trainers, track progress, submit assignments, and connect with top employers.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/register" className="btn btn-primary btn-lg">
          Start Learning Free <ArrowRight style={{ width: '18px', height: '18px' }} />
        </Link>
        <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
      </div>
    </div>

    {/* Stats */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '4rem', background: 'white', borderRadius: '1.5rem', padding: '2rem', border: '1px solid hsl(214.3 31.8% 91.4%)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {[['1,200+', 'Active Students'], ['64+', 'Expert Courses'], ['120+', 'Placements'], ['50+', 'Companies']].map(([n, l]) => (
        <div key={l} style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, hsl(221.2 83.2% 53.3%), hsl(270 70% 60%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{n}</p>
          <p style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', fontWeight: 500 }}>{l}</p>
        </div>
      ))}
    </div>

    {/* Features */}
    <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Everything You Need to Succeed</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
      {[
        { icon: BookOpen, color: '#3b82f6', bg: '#eff6ff', title: 'Quality Courses', desc: 'Access expert-curated courses with video lectures, PDFs, and hands-on modules designed for real-world skills.' },
        { icon: GraduationCap, color: '#8b5cf6', bg: '#f5f3ff', title: 'Track Progress', desc: 'Monitor your learning journey with detailed progress tracking, assignment status, and performance analytics.' },
        { icon: Briefcase, color: '#10b981', bg: '#f0fdf4', title: 'Job Placement', desc: 'Browse hundreds of job openings from top companies and apply directly through our integrated placement portal.' },
        { icon: Users, color: '#f59e0b', bg: '#fffbeb', title: 'Expert Trainers', desc: 'Learn from industry professionals with real experience. Get feedback, grades, and personalized mentorship.' },
      ].map(({ icon: Icon, color, bg, title, desc }) => (
        <div key={title} className="card-hover" style={{ background: 'white', borderRadius: '1.25rem', padding: '1.75rem', border: '1px solid hsl(214.3 31.8% 91.4%)' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Icon style={{ width: '26px', height: '26px', color }} />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.5rem' }}>{title}</h3>
          <p style={{ color: 'hsl(215.4 16.3% 46.9%)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
        </div>
      ))}
    </div>

    {/* CTA */}
    <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, hsl(221.2 83.2% 53.3%), hsl(270 70% 60%))', borderRadius: '1.5rem', padding: '4rem 2rem', color: 'white' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to start your journey?</h2>
      <p style={{ opacity: 0.85, marginBottom: '2rem', fontSize: '1.0625rem' }}>Join thousands of students already learning on SmartLearn.</p>
      <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: 'hsl(221.2 83.2% 53.3%)', fontWeight: 700 }}>
        Create Free Account <ArrowRight style={{ width: '18px', height: '18px' }} />
      </Link>
    </div>
  </div>
);

export default Home;
