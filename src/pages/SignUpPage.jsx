import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import teraLogo from '../assets/tera-logo.png';
import './Auth.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', class: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd) && /[a-zA-Z]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', class: 'weak' };
    if (score <= 3) return { level: 2, label: 'Medium', class: 'medium' };
    return { level: 3, label: 'Strong', class: 'strong' };
  };

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errs.terms = 'You must agree to the Terms & Privacy Policy';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) return;

    setLoading(true);
    try {
      await signup({ name: name.trim(), email: email.trim(), password });
      showToast('Account created successfully! Welcome to TERA.', 'success');
      navigate('/account', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Could not create account. Please try again.');
      showToast('Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setFormError('');
    try {
      await loginWithGoogle();
      showToast('Google sign-up successful! Welcome.', 'success');
      navigate('/account', { replace: true });
    } catch (err) {
      setFormError('Google sign-up could not be completed.');
      showToast('Google sign-up error', 'error');
    } finally {
      setGoogleLoading(false);
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
          <h1 className="auth-header__title">Create an Account</h1>
          <p className="auth-header__subtitle">
            Join thousands of makers and engineers building with TERA.
          </p>
        </div>

        {/* Global Error Banner */}
        {formError && (
          <div className="auth-alert auth-alert--error" role="alert">
            <AlertCircle size={18} />
            <span>{formError}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          className="auth-google-btn"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          aria-label="Sign up with Google"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{googleLoading ? 'Connecting…' : 'Sign up with Google'}</span>
        </button>

        {/* Divider */}
        <div className="auth-divider">
          <span>Or sign up with email</span>
        </div>

        {/* Signup Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name Field */}
          <div className="auth-group">
            <label className="auth-label" htmlFor="signup-name">
              Full Name
            </label>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" size={18} />
              <input
                id="signup-name"
                type="text"
                className={`auth-input ${errors.name ? 'auth-input--error' : ''}`}
                placeholder="Kavin"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                autoComplete="name"
                required
              />
            </div>
            {errors.name && <span className="auth-error-msg">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="auth-group">
            <label className="auth-label" htmlFor="signup-email">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input
                id="signup-email"
                type="email"
                className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                autoComplete="email"
                required
              />
            </div>
            {errors.email && <span className="auth-error-msg">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="auth-group">
            <label className="auth-label" htmlFor="signup-password">
              Password
            </label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input ${errors.password ? 'auth-input--error' : ''}`}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-toggle-pwd"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && (
              <div className="password-strength">
                <div
                  className={`password-strength__bar ${
                    strength.level >= 1 ? `password-strength__bar--active-${strength.class}` : ''
                  }`}
                />
                <div
                  className={`password-strength__bar ${
                    strength.level >= 2 ? `password-strength__bar--active-${strength.class}` : ''
                  }`}
                />
                <div
                  className={`password-strength__bar ${
                    strength.level >= 3 ? `password-strength__bar--active-${strength.class}` : ''
                  }`}
                />
                <span className="password-strength__text" style={{ color: strength.level === 3 ? '#10B981' : strength.level === 2 ? '#F59E0B' : '#EF4444' }}>
                  {strength.label}
                </span>
              </div>
            )}
            {errors.password && <span className="auth-error-msg">{errors.password}</span>}
          </div>

          {/* Confirm Password Field */}
          <div className="auth-group">
            <label className="auth-label" htmlFor="signup-confirm-password">
              Confirm Password
            </label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`auth-input ${errors.confirmPassword ? 'auth-input--error' : ''}`}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-toggle-pwd"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="auth-error-msg">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="auth-group">
            <label className="auth-checkbox-label" style={{ fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                }}
              />
              <span>
                I agree to TERA's <span className="auth-link">Terms of Service</span> and{' '}
                <span className="auth-link">Privacy Policy</span>
              </span>
            </label>
            {errors.terms && <span className="auth-error-msg">{errors.terms}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <span>Creating Account…</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

