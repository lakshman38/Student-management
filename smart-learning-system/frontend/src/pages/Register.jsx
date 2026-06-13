import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, AlertCircle, GraduationCap } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await register(name, email, password, role);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: 'white', borderRadius: '1.5rem', border: '1px solid hsl(214.3 31.8% 91.4%)', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', padding: '2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '52px', height: '52px', background: 'hsl(221.2 83.2% 53.3%)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <GraduationCap style={{ width: '28px', height: '28px', color: 'white' }} />
          </div>
          <h2 style={{ fontSize: '1.625rem', fontWeight: 700, marginBottom: '0.375rem' }}>Create an Account</h2>
          <p style={{ color: 'hsl(215.4 16.3% 46.9%)', fontSize: '0.875rem' }}>Join SmartLearn to start managing & learning</p>
        </div>

        {error && (
          <div style={{ background: 'hsl(0 84.2% 97%)', border: '1px solid hsl(0 84.2% 85%)', color: 'hsl(0 84.2% 45%)', padding: '0.875rem 1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '17px', height: '17px', color: 'hsl(215.4 16.3% 55%)' }} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '17px', height: '17px', color: 'hsl(215.4 16.3% 55%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '17px', height: '17px', color: 'hsl(215.4 16.3% 55%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>I want to register as a...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  padding: '0.625rem',
                  borderRadius: '0.5rem',
                  border: `2px solid ${role === 'student' ? 'hsl(221.2 83.2% 53.3%)' : 'hsl(214.3 31.8% 91.4%)'}`,
                  background: role === 'student' ? 'hsl(221.2 83.2% 97%)' : 'transparent',
                  color: role === 'student' ? 'hsl(221.2 83.2% 45%)' : 'hsl(222.2 47.4% 11.2%)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('trainer')}
                style={{
                  padding: '0.625rem',
                  borderRadius: '0.5rem',
                  border: `2px solid ${role === 'trainer' ? 'hsl(221.2 83.2% 53.3%)' : 'hsl(214.3 31.8% 91.4%)'}`,
                  background: role === 'trainer' ? 'hsl(221.2 83.2% 97%)' : 'transparent',
                  color: role === 'trainer' ? 'hsl(221.2 83.2% 45%)' : 'hsl(222.2 47.4% 11.2%)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Trainer
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'hsl(221.2 83.2% 53.3%)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
