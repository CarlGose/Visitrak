import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLanding.css';

export default function UserLanding() {
  const navigate = useNavigate();

  return (
    <div className="ul-page">
      <header className="ul-header">
        <div className="ul-brand-container">
          <img src="/wuplogo.png" alt="University Logo" className="ul-logo" />
          <h1 className="ul-brand-name">VisiTrack</h1>
        </div>
        <button className="ul-menu-button" aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="#253529" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      <main className="ul-main">
        <div className="ul-card">
          <h2 className="ul-welcome">Welcome</h2>
          <p className="ul-subtitle">asdasdasd</p>
          <button className="ul-visit-btn" onClick={() => navigate('/fill-out')}>
            VISIT
          </button>
        </div>
      </main>
    </div>
  );
}
