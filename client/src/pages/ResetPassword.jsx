import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setSubmitting(true);
    try {
      await api.put(`/auth/resetpassword/${token}`, { password });
      toast.success('Password reset successful! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid or expired token');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg-surface)'
    }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 45%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        background: 'var(--accent)',
        padding: '40px', position: 'relative',
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 360, textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '12px',
            margin: '0 auto 24px', background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: '#ffffff',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <img src="/logo.png" alt="F" onError={(e) => e.target.style.display = 'none'} style={{
              width: '100%', height: '100%', objectFit: 'contain'
            }} />
            <span style={{ position: 'absolute' }}>F</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800,
            marginBottom: 12, color: '#ffffff', letterSpacing: '-0.02em'
          }}>Secure Reset</h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
            Set a strong new password to keep your feedback and data safe.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', background: '#ffffff'
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800,
            marginBottom: 8, color: 'var(--text-1)'
          }}>New Password</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-2)', marginBottom: 32 }}>
            Final step—choose a new password for your account.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: '0.9rem', fontWeight: 700,
                color: 'var(--text-2)', marginBottom: 6
              }}>New Password</label>
              <input
                type="password"
                className="form-input"
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  fontSize: '0.95rem',
                  border: '1px solid #d1d5db'
                }}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{
                display: 'block', fontSize: '0.9rem', fontWeight: 700,
                color: 'var(--text-2)', marginBottom: 6
              }}>Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  fontSize: '0.95rem',
                  border: '1px solid #d1d5db'
                }}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              {submitting ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="flex: 0 0 45%"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
