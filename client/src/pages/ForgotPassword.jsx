import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setSubmitting(true);
    try {
      await api.post('/auth/forgotpassword', { email });
      setSuccess(true);
      toast.success('Reset link sent! (Check the server console)');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset link');
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
          }}>Reset Access</h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
            Don't worry, it happens to the best of us. Let's get you back in.
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
          }}>Forgot Password?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-2)', marginBottom: 32 }}>
            Enter your email to receive a reset link.
          </p>

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                marginBottom: 32, padding: '24px', 
                backgroundColor: 'var(--green-muted)', color: 'var(--green)', 
                borderRadius: '8px', border: '1px solid var(--green)',
                fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.6
              }}>
                Check your email (or server console) for the reset link!
              </div>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 28 }}>
                <label style={{
                  display: 'block', fontSize: '0.9rem', fontWeight: 700,
                  color: 'var(--text-2)', marginBottom: 6
                }}>Email address</label>
                <input
                  type="email"
                  className="form-input"
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    fontSize: '0.95rem',
                    border: '1px solid #d1d5db'
                  }}
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                {submitting ? 'Sending…' : 'Send Reset Link'}
              </button>

              <div style={{
                textAlign: 'center', marginTop: 32,
                fontSize: '1rem', color: 'var(--text-2)',
                borderTop: '1px solid var(--glass-border)', paddingTop: 24
              }}>
                Remembered it?{' '}
                <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in</Link>
              </div>
            </form>
          )}
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
