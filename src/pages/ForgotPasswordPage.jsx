import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import teraLogo from '../assets/tera-logo.png';
import './Auth.css';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.trim()) {
      setError('Email address is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSubmitted(true);
      showToast('Reset link sent to your email!', 'success');
    } catch (err) {
      setError(err.message || 'Unable to send reset instructions.');
      showToast('Error sending reset link.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <Link to="/" className="auth-header__logo" aria-label="TERA Home">
            <img src={teraLogo} alt="TERA Logo" />
          </Link>
          <h1 className="auth-header__title">Reset Password</h1>
          <p className="auth-header__subtitle">
            Enter your account email and we'll send you a password recovery link.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#ECFDF5',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px' }}>
              Check Your Inbox
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: '0 0 24px' }}>
              We've dispatched recovery instructions to{' '}
              <strong style={{ color: '#0F172A' }}>{email}</strong>. Please check your spam folder
              if you do not see it within a few minutes.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                className="auth-submit-btn"
                onClick={() => setSubmitted(false)}
                style={{ background: '#F8FAFC', color: '#334155', borderColor: '#CBD5E1' }}
              >
                Send Another Link
              </button>
              <Link
                to="/login"
                className="auth-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '12px',
                }}
              >
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="auth-alert auth-alert--error" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="auth-group">
              <label className="auth-label" htmlFor="forgot-email">
                Registered Email Address
              </label>
              <div className="auth-input-wrapper">
                <Mail className="auth-input-icon" size={18} />
                <input
                  id="forgot-email"
                  type="email"
                  className={`auth-input ${error ? 'auth-input--error' : ''}`}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Sending Link…' : 'Send Reset Instructions'}
            </button>

            <div className="auth-footer" style={{ borderTop: 'none', paddingTop: '8px' }}>
              <Link
                to="/login"
                className="auth-link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={16} /> Return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

