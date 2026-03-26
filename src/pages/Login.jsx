import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ok = login(id, password, remember);
    setLoading(false);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Invalid ID or password. Try admin / admin123');
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* Branding */}
        <div className="login-brand">
          <img src="/wuplogo.png" alt="VisiTrack Logo" className="login-logo" />
          <span className="login-brand-name">VisiTrack</span>
        </div>
        <p className="login-tagline">Handle visitors without worries</p>

        {/* Card */}
        <form className="login-card" onSubmit={handleSubmit}>

          {/* Admin Badge */}
          <span className="login-admin-badge">Admin Portal</span>

          {/* Heading */}
          <div className="login-card-heading">
            <h1 className="login-welcome">Welcome back</h1>
            <p className="login-sub">Sign in to your admin account</p>
          </div>

          {/* ID Field */}
          <div className="login-field">
            <label htmlFor="login-id">Admin ID</label>
            <input
              id="login-id"
              type="text"
              placeholder="Enter your admin ID"
              value={id}
              onChange={e => setId(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          {/* Password Field */}
          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="login-remember">
            <input
              id="login-remember"
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <label htmlFor="login-remember">Remember me</label>
          </div>

          {/* Error */}
          {error && <p className="login-error">{error}</p>}

          {/* Submit */}
          <div className="login-actions">
            <button
              id="login-submit-btn"
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>

          {/* Divider */}
          <div className="login-divider">
            <span /><p>or</p><span />
          </div>
        </form>

        <p className="login-guard-link-text">
          <Link to="/" className="login-guard-link">← Back to Portal Selection</Link>
        </p>
      </div>
    </div>
  );
}
