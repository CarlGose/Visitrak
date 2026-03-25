import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './UserLanding.css';

export default function UserLanding() {
  const navigate = useNavigate();

  return (
    <div className="ul-page">
      <header className="ul-header">
        <img src="/wuplogo.png" alt="University Logo" className="ul-logo" />
        <h1 className="ul-brand-name">VisiTrack</h1>
        <Link to="/" className="guard-login-admin-link">← Portal Selection</Link>
      </header>

      <main className="ul-main">
        <div className="ul-card">
          <h2 className="ul-welcome">Welcome</h2>
          <p className="ul-subtitle">Make your visit hassle-free with VisiTack</p>
          <button className="ul-visit-btn" onClick={() => navigate('/fill-out')}>
            Proceed
          </button>
        </div>
      </main>
    </div>
  );
}
