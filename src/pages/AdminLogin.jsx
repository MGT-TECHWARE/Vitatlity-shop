import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al">
      {/* Subtle grid background */}
      <div className="al-grid" />

      <form className="al-card" onSubmit={handleSubmit}>
        {/* Logo mark */}
        <div className="al-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#000" />
            <path d="M10 22V10h2.4l3.6 7.2L19.6 10H22v12h-2v-8.1L16.8 20h-1.6L12 13.9V22H10z" fill="#fff" />
          </svg>
        </div>

        <h1 className="al-title">Welcome back</h1>
        <p className="al-subtitle">Sign in to your admin dashboard</p>

        {error && (
          <div className="al-error">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 4.5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        <div className="al-field">
          <label className="al-label" htmlFor="al-email">Email address</label>
          <input
            id="al-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="al-input"
            placeholder="you@company.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="al-field">
          <div className="al-label-row">
            <label className="al-label" htmlFor="al-password">Password</label>
            <button type="button" className="al-forgot" tabIndex={-1}>
              Forgot password?
            </button>
          </div>
          <div className="al-input-wrap">
            <input
              id="al-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="al-input"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="al-eye"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button type="submit" className="al-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="al-spinner" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>

        <div className="al-divider">
          <span>or</span>
        </div>

        <Link to="/" className="al-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="8" x2="4" y2="8" />
            <polyline points="7 5 4 8 7 11" />
          </svg>
          Back to store
        </Link>
      </form>

      <p className="al-footer">Nexora Peptides &middot; Admin Portal</p>
    </div>
  );
}
