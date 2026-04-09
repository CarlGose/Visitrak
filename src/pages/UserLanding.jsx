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
        <Link to="/" className="guard-login-admin-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Portal Selection
        </Link>
      </header>

      <main className="ul-main">
        <div className="ul-card">
          <h2 className="ul-welcome">Welcome</h2>
          <p className="ul-subtitle">Make your visit hassle-free with VisiTrack</p>
          <button className="ul-visit-btn" onClick={() => navigate('/fill-out')}>
            Proceed
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </main>
    </div>
  );
}
