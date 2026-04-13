import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PortalSelect.css';

const portals = [
  {
    id: 'user-landing',
    label: 'User Gateway',
    description: 'Get your WU-P QR entry pass',
    route: '/user-landing',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
    accent: '#c28d5a',
    accentLight: '#fcf0e3',
  },
  {
    id: 'admin',
    label: 'Admin Portal',
    description: 'Manage visitors, view logs, and oversee guards',
    route: '/login',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    accent: '#5b8fb9',
    accentLight: '#e6f0fa',
  },
  {
    id: 'guard',
    label: 'Guard Access',
    description: 'Log visitors, and record VIP entries',
    route: '/guard/login',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    accent: '#9d7bb0',
    accentLight: '#f0e6f5',
  },

];

export default function PortalSelect() {
  const navigate = useNavigate();

  return (
    <div className="ps-page">
      {/* Background decoration */}
      <div className="ps-bg-blob ps-bg-blob--1" />
      <div className="ps-bg-blob ps-bg-blob--2" />

      <div className="ps-inner">
        {/* Branding */}
        <div className="ps-brand">
          <img src="/wuplogo.png" alt="VisiTrack Logo" className="ps-logo" />
          <div>
            <h1 className="ps-brand-name">VisiTrack</h1>
            <p className="ps-brand-tagline">Handle visitors without worries</p>
          </div>
        </div>

        <p className="ps-prompt">Select a portal to continue</p>

        {/* Portal cards */}
        <div className="ps-cards">
          {portals.map((p, i) => (
            <button
              key={p.id}
              id={`portal-${p.id}`}
              className="ps-card"
              style={{ '--accent': p.accent, '--accent-light': p.accentLight, '--delay': `${i * 0.1}s` }}
              onClick={() => navigate(p.route)}
            >
              <div className="ps-card-icon">{p.icon}</div>
              <div className="ps-card-text">
                <span className="ps-card-label">{p.label}</span>
                <span className="ps-card-desc">{p.description}</span>
              </div>
              <div className="ps-card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <p className="ps-footer">© {new Date().getFullYear()} VisiTrack —A Smart QR-Powered Visitor Entry Pass and
          Tracking System for Enhanced Safety and Efficiency in

          Wesleyan University-Philippines </p>
      </div>
    </div>
  );
}
