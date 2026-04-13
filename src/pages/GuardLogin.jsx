import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './GuardLogin.css';

export default function GuardLogin() {
  const [guardId, setGuardId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { guardLogin, user, restoreSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'guard') {
      navigate('/guard/dashboard', { replace: true });
    } else if (!user) {
      restoreSession('guard');
    }
  }, [user, navigate, restoreSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ok = await guardLogin(guardId, password, remember);
    setLoading(false);
    if (ok) {
      navigate('/guard/dashboard');
    } else {
      setError('Invalid Guard ID or password.');
    }
  };

  return (
    <div className="guard-login-page">
      <div className="guard-login-wrapper">

        {/* Card */}
        <form className="guard-login-card" onSubmit={handleSubmit}>

          {/* Branding Inside Card */}
          <div className="guard-login-brand" style={{ marginBottom: '8px', justifyContent: 'center' }}>
            <img src="/wuplogo.png" alt="VisiTrack Logo" className="guard-login-logo" style={{ width: '56px', height: '56px' }} />
            <span className="guard-login-brand-name">VisiTrack</span>
          </div>
          <p className="guard-login-tagline" style={{ textAlign: 'center', marginBottom: '32px' }}>Handle visitors without worries</p>

          {/* Heading */}
          <div className="guard-login-card-heading">
            <h1 className="guard-login-welcome">Guard Access</h1>
            <p className="guard-login-sub">Sign in to your guard terminal</p>
          </div>

          {/* ID Field */}
          <div className="guard-login-field">
            <label htmlFor="guard-id">Guard ID</label>
            <input
              id="guard-id"
              type="text"
              placeholder="Enter your Guard ID"
              value={guardId}
              onChange={e => setGuardId(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          {/* Password Field */}
          <div className="guard-login-field">
            <label htmlFor="guard-password">Password</label>
            <input
              id="guard-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>


          {/* Remember Me */}
          <div className="guard-login-remember" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '0 4px' }}>
            <input
              id="guard-remember"
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--color-gold)' }}
            />
            <label htmlFor="guard-remember" style={{ fontSize: '0.9rem', color: 'rgba(30, 40, 35, 0.8)', cursor: 'pointer' }}>Remember me</label>
          </div>

          {/* Error */}
          {error && <p className="guard-login-error">{error}</p>}

          {/* Submit */}
          <div className="guard-login-actions">
            <button
              id="guard-login-btn"
              type="submit"
              className="guard-login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>

          {/* Divider */}
          <div className="guard-login-divider">
            <span /><p>or</p><span />
          </div>
        </form>

        <p className="guard-login-hint" style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'rgba(30, 40, 35, 0.6)' }}>
          Default password for all guards: <strong>guard123</strong>
        </p>

        <p className="guard-login-guard-link-text">
          <Link to="/" className="guard-login-guard-link">← Back to Portal Selection</Link>
        </p>
      </div>
    </div>
  );
}
