import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid hsl(214.3 31.8% 91.4%)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'hsl(221.2 83.2% 53.3%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.125rem', background: 'linear-gradient(135deg, hsl(221.2 83.2% 53.3%), hsl(270 70% 60%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SmartLearn</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary btn-sm">
                <LayoutDashboard style={{ width: '16px', height: '16px' }} />Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-sm" style={{ color: 'hsl(0 84.2% 55%)', background: 'hsl(0 84.2% 97%)' }}>
                <LogOut style={{ width: '16px', height: '16px' }} />Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
