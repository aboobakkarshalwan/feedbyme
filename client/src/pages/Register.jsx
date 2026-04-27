import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Fill all fields');
    if (form.password.length < 6) return toast.error('Min. 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords don\'t match');
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
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
            Join teams building better products through structured user feedback.
          </p>

          {/* Stats */}
          <div style={{
            marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12
          }}>
            {[
              { val: '12k+', label: 'Feedback items' },
              { val: '500+', label: 'Teams' },
              { val: '94%', label: 'Resolved' },
              { val: '4.9★', label: 'Rating' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '16px', borderRadius: 4,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.4rem',
                  fontWeight: 800, color: '#ffffff'
                }}>{s.val}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
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
          }}>Create your account</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-2)', marginBottom: 32 }}>
            Free forever. No credit card needed.
          </p>

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full name', type: 'text', key: 'name', ph: 'Your full name', ac: 'name' },
              { label: 'Email address', type: 'email', key: 'email', ph: 'you@company.com', ac: 'email' },
              { label: 'Password', type: 'password', key: 'password', ph: 'Min. 6 characters', ac: 'new-password' },
              { label: 'Confirm password', type: 'password', key: 'confirmPassword', ph: 'Repeat password', ac: 'new-password' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block', fontSize: '1rem', fontWeight: 700,
                  color: 'var(--text-1)', marginBottom: 8
                }}>{field.label}</label>
                <input
                  type={field.type}
                  className="form-input"
                  placeholder={field.ph}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  id={`register-${field.key}`}
                  autoComplete={field.ac}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              id="register-submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 4 }}
            >
              {submitting ? 'Creating…' : 'Create account'}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: 28,
            fontSize: '1rem', color: 'var(--text-2)',
            borderTop: '1px solid var(--glass-border)', paddingTop: 24
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in</Link>
          </p>
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
