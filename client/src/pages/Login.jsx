import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Fill all fields');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
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
          <img src="/logo.png" alt="FeedByMe Logo" style={{
            width: '64px', height: '64px', borderRadius: '4px',
            margin: '0 auto 24px', border: '2px solid rgba(255,255,255,0.3)'
          }} />
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800,
            marginBottom: 12, color: '#ffffff'
          }}>FeedByMe</h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
            Collect, organize, and act on user feedback — all in one place.
          </p>

          {/* Testimonial */}
          <div style={{
            marginTop: 48, padding: '24px', borderRadius: 4,
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'left'
          }}>
            <p style={{ fontSize: '0.95rem', color: '#ffffff', lineHeight: 1.6, fontStyle: 'italic' }}>
              "We shipped 3x faster after switching to FeedByMe. Finally, feedback that's actionable."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700, color: '#ffffff'
              }}>AK</div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>Alex Kim</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Product Lead, Acme Inc</div>
              </div>
            </div>
          </div>
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
          }}>Welcome back</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-2)', marginBottom: 32 }}>
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: '1rem', fontWeight: 700,
                color: 'var(--text-1)', marginBottom: 8
              }}>Email address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                id="login-email"
                autoComplete="email"
                required
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{
                  display: 'block', fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)'
                }}>Password</label>
                <Link to="/forgotpassword" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                id="login-password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              id="login-submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: 28,
            fontSize: '1rem', color: 'var(--text-2)',
            borderTop: '1px solid var(--glass-border)', paddingTop: 24
          }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700 }}>Create one</Link>
          </p>
        </div>
      </div>

      {/* Mobile: hide left panel */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="flex: 0 0 45%"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
