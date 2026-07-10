import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const { login, user, restoreSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/dashboard', { replace: true });
    } else if (!user) {
      restoreSession('admin');
    }
  }, [user, navigate, restoreSession]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ok = await login(id, password, remember);
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

        {/* Card */}
        <form className="login-card" onSubmit={handleSubmit}>

          {/* Branding Inside Card */}
          <div className="login-brand" style={{ marginBottom: '8px', justifyContent: 'center' }}>
            <img src="/wuplogo.png" alt="VisiTrack Logo" className="login-logo" style={{ width: '56px', height: '56px' }} />
            <span className="login-brand-name">VisiTrack</span>
          </div>
          <p className="login-tagline" style={{ textAlign: 'center', marginBottom: '32px' }}>Handle visitors without worries</p>

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

          <div className="forgot-password-text" onClick={() => setShowDevModal(true)}>
            Forgot Password?
          </div>

          {/* Divider */}
          <div className="login-divider">
            <span /><p>or</p><span />
          </div>
        </form>

        <p className="login-guard-link-text">
          <Link to="/staff" className="login-guard-link">← Back to Staff Portal</Link>
        </p>
      </div>

      {showDevModal && (
        <div className="dev-modal-overlay" onClick={() => setShowDevModal(false)}>
          <div className="dev-modal-content" onClick={e => e.stopPropagation()}>
            <button className="dev-modal-close" onClick={() => setShowDevModal(false)}>&times;</button>
            <h2 className="dev-modal-title">Contact IT / Developers</h2>
            <p className="dev-modal-desc">To protect system security, passwords cannot be reset here. Please contact one of the developers below.</p>

            <div className="dev-list">
              <div className="dev-card">
                <img src="/wuplogo.png" alt="Dev 1" className="dev-avatar" />
                <div className="dev-info">
                  <h3 className="dev-name">Carl James Gose</h3>
                  <p className="dev-role">Lead Developer/Frontend Developer/Backend Developer</p>
                  <p className="dev-contact">✉️ cjgose2000@gmail.com</p>
                  <p className="dev-contact">📞 0993 481 7042 (Viber)</p>
                </div>
              </div>

              <div className="dev-card">
                <img src="/wuplogo.png" alt="Dev 2" className="dev-avatar" />
                <div className="dev-info">
                  <h3 className="dev-name">Khurstian Shane Estares</h3>
                  <p className="dev-role">Frontend Developer/Backend Developer/Database Admin</p>
                  <p className="dev-contact">✉️ dev2@school.edu.ph</p>
                  <p className="dev-contact">📞 0998 765 4321</p>
                </div>
              </div>

              <div className="dev-card">
                <img src="/wuplogo.png" alt="Dev 3" className="dev-avatar" />
                <div className="dev-info">
                  <h3 className="dev-name">Angelo Abel Cruz</h3>
                  <p className="dev-role">Frontend Developer/Backend Developer</p>
                  <p className="dev-contact">✉️ dev3@school.edu.ph</p>
                  <p className="dev-contact">📞 0955 111 2222</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
