import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GATE_OPTIONS } from '../data/mockData';
import './GuardLogin.css';

export default function GuardLogin() {
  const [guardId, setGuardId] = useState('');
  const [password, setPassword] = useState('');
  const [gate, setGate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { guardLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!gate) { setError('Please select a gate.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const ok = guardLogin(guardId, password, gate);
    setLoading(false);
    if (ok) {
      navigate('/guard/dashboard');
    } else {
      setError('Invalid Guard ID or password.');
    }
  };

  return (
    <div className="guard-login-page">
      <header className="guard-login-header">
        <img src="/wuplogo.png" alt="VisiTrack Logo" className="guard-login-header-logo" />
        <span className="guard-login-header-brand">VisiTrack</span>
        <Link to="/" className="guard-login-admin-link">← Portal Selection</Link>
      </header>

      <div className="guard-login-body">
        <form className="guard-login-card" onSubmit={handleSubmit}>
          <h1 className="guard-login-title">Guard Login</h1>

          <div className="guard-login-field">
            <label htmlFor="guard-id">ID</label>
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

          <div className="guard-login-field">
            <label htmlFor="guard-gate">Gate Number</label>
            <select
              id="guard-gate"
              value={gate}
              onChange={e => setGate(e.target.value)}
              required
            >
              <option value="">— Select Gate —</option>
              {GATE_OPTIONS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {error && <p className="guard-login-error">{error}</p>}

          <div className="guard-login-actions">
            <button
              id="guard-login-btn"
              type="submit"
              className="guard-login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'login'}
            </button>
          </div>
        </form>

        <p className="guard-login-hint">
          Default password for all guards: <strong>guard123</strong>
        </p>
      </div>
    </div>
  );
}
