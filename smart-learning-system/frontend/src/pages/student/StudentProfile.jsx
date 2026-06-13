import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User, Mail, Lock, Shield, Check } from 'lucide-react';
import { useToast } from '../../components/Toast';

const StudentProfile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setUpdating(true);
    const result = await updateProfile({
      name,
      email,
      ...(password && { password })
    });
    setUpdating(false);

    if (result.success) {
      showToast('Profile updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
    } else {
      showToast(result.message || 'Failed to update profile', 'error');
    }
  };

  return (
    <div>
      {ToastComponent}
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile Settings</h1>
          <p className="page-subtitle">Manage your account information and credentials</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* User Card */}
        <div style={{ background: 'white', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: '1rem', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'hsl(221.2 83.2% 93%)', color: 'hsl(221.2 83.2% 53.3%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '2rem', margin: '0 auto 1.25rem' }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{user?.name}</h3>
          <p style={{ fontSize: '0.875rem', color: 'hsl(215.4 16.3% 46.9%)', margin: '0.25rem 0 1.25rem 0' }}>{user?.email}</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <span className={`badge ${user?.role === 'admin' ? 'badge-red' : user?.role === 'trainer' ? 'badge-purple' : 'badge-blue'}`} style={{ textTransform: 'capitalize' }}>
              {user?.role} Portal
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <div style={{ background: 'white', border: '1px solid hsl(214.3 31.8% 91.4%)', borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield className="w-5 h-5 text-primary" />
            Account Details
          </h2>
          
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Email Address</label>
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
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid hsl(214.3 31.8% 91.4%)', margin: '0.5rem 0' }} />

            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'hsl(222.2 84% 4.9%)', marginBottom: '0.25rem' }}>Change Password</h3>
              <p style={{ fontSize: '0.8125rem', color: 'hsl(215.4 16.3% 55%)', marginBottom: '1rem' }}>Leave blank to keep your current password</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '17px', height: '17px', color: 'hsl(215.4 16.3% 55%)' }} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '17px', height: '17px', color: 'hsl(215.4 16.3% 55%)' }} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'end', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={updating}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Check className="w-4 h-4" />
                {updating ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
