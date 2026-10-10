import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PortalSelect.css';

const portals = [
  {
    id: 'admin',
    label: 'Admin Portal',
    badge: 'Management & Records',
    description: 'Manage visitors, view logs, oversee guards, and export reports',
    route: '/login',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    accent: '#1b6348',
    accentLight: '#eaf5ef',
    glowColor: 'rgba(27, 99, 72, 0.25)',
  },
  {
    id: 'guard',
    label: 'Guard Access',
    badge: 'Campus Gate Security',
    description: 'Log visitors in real-time, scan QR passes, and record VIP entries',
    route: '/guard/login',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    accent: '#c99014',
    accentLight: '#fdf7e7',
    glowColor: 'rgba(201, 144, 20, 0.25)',
  },
];

export default function PortalSelect() {
  const navigate = useNavigate();

  return (
    <div className="ps-page">
      {/* Animated Background Layers */}
      <div className="ps-bg-container" aria-hidden="true">
        <div className="ps-bg-image" />
        <div className="ps-bg-gradient-overlay" />
        <div className="ps-bg-vignette" />
        <div className="ps-orb ps-orb--1" />
        <div className="ps-orb ps-orb--2" />
        <div className="ps-orb ps-orb--3" />
        <div className="ps-light-shimmer" />
      </div>

      {/* Top Status Bar */}
      <nav className="ps-nav-bar">
        <div className="ps-status-pill">
          <span className="ps-pulse-dot" />
          <span>WUP Authorized Access</span>
        </div>
      </nav>

      <div className="ps-inner">
        {/* University & Brand Header */}
        <div className="ps-header">
          <div className="ps-brand">
            <img src="/wuplogo.png" alt="WUP Logo" className="ps-logo ps-logo--wup" />
            <div className="ps-brand-text">
              <span className="ps-univ-tag">WESLEYAN UNIVERSITY-PHILIPPINES</span>
              <h1 className="ps-brand-name">VisiTrack</h1>
              <p className="ps-brand-tagline">Campus Security & Visitor Management System</p>
            </div>
            <img src="/visitrak-badge.png" alt="VisiTrack Badge" className="ps-logo ps-logo--visitrak" />
          </div>
        </div>

        <div className="ps-prompt-wrapper">
          <div className="ps-prompt-divider" />
          <span className="ps-prompt">Select Your Portal</span>
          <div className="ps-prompt-divider" />
        </div>

        {/* Portal Cards */}
        <div className="ps-cards">
          {portals.map((p, i) => (
            <button
              key={p.id}
              id={`portal-${p.id}`}
              className="ps-card"
              style={{
                '--accent': p.accent,
                '--accent-light': p.accentLight,
                '--glow-color': p.glowColor,
                '--delay': `${0.12 * i}s`,
              }}
              onClick={() => navigate(p.route)}
            >
              <div className="ps-card-icon-container">
                <div className="ps-card-icon">{p.icon}</div>
              </div>
              <div className="ps-card-text">
                <div className="ps-card-heading-row">
                  <span className="ps-card-label">{p.label}</span>
                  <span className="ps-card-badge">{p.badge}</span>
                </div>
                <span className="ps-card-desc">{p.description}</span>
              </div>
              <div className="ps-card-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <footer className="ps-footer">
          <div className="ps-footer-crest" aria-hidden="true">
            <span className="ps-crest-line" />
            <span className="ps-crest-star">★</span>
            <span className="ps-crest-line" />
          </div>
          <p className="ps-footer-text">
            © {new Date().getFullYear()} Wesleyan University-Philippines • VisiTrack Security Access
          </p>
          <p className="ps-footer-subtext">
            A Smart QR-Powered Visitor Entry Pass and Tracking System
          </p>
        </footer>
      </div>
    </div>
  );
}

