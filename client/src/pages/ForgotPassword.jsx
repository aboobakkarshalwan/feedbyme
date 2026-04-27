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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <img src="/logo.png" alt="FeedByMe Logo" className="auth-logo" />
            FeedByMe
          </Link>
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="alert alert-success" style={{ marginBottom: 24, padding: 16, backgroundColor: 'rgba(0, 136, 23, 0.1)', color: '#008817', borderRadius: 4, border: '1px solid #008817' }}>
              Check your email (or server console) for the reset link!
            </div>
            <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="auth-footer">
              Remember your password? <Link to="/login" className="auth-link">Sign in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
