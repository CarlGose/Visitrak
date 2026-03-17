import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { visitorLogs, DESTINATIONS, PURPOSES } from '../data/mockData';
import './GuardDashboard.css';

// Icons
const VipIcon = () => (
  <span className="menu-badge">VIP</span>
);
const QrIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <path d="M14 14h2v2h-2zM16 16h2v2h-2zM18 18h3v3h-3zM14 18h2v2h-2zM18 14h3v2h-3z"/>
  </svg>
);
const LogsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/>
    <line x1="9" y1="7" x2="15" y2="7"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
    <line x1="9" y1="15" x2="13" y2="15"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const PowerIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
    <line x1="12" y1="2" x2="12" y2="12"/>
  </svg>
);

export default function GuardDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null); // null=menu , 'vip'=VIP form, 'logs'=logs

  const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const activeVisitors = visitorLogs.filter(v => v.isActive);

  const handleLogout = () => {
    logout();
    navigate('/guard/login');
  };

  if (activeSection === 'vip') return <VipForm onBack={() => setActiveSection(null)} gate={user?.gate} />;
  if (activeSection === 'logs') return <GuardLogs onBack={() => setActiveSection(null)} />;

  return (
    <div className="gd-page">
      {/* ── Header ── */}
      <header className="gd-header">
        <img src="/wuplogo.png" alt="VisiTrack" className="gd-header-logo" />
        <span className="gd-header-brand">VisiTrack</span>
      </header>

      <div className="gd-body">
        {/* Dashboard title */}
        <h1 className="gd-title">Dashboard</h1>

        {/* Guard profile card */}
        <div className="gd-profile-card">
          <div className="gd-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor" width="44" height="44">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z"/>
            </svg>
          </div>
          <div className="gd-profile-info">
            <p className="gd-profile-row"><span className="gd-label">Guard ID:</span> {user?.guardId || '—'}</p>
            <p className="gd-profile-row"><span className="gd-label">Name:</span> {user?.name || 'Guard'}</p>
            <p className="gd-profile-row"><span className="gd-label">Date:</span> {todayStr}</p>
            <p className="gd-profile-row gd-gate-badge">{user?.gate || 'Main Gate'}</p>
          </div>
        </div>

        {/* Menu buttons */}
        <div className="gd-menu">
          <button className="gd-menu-btn" id="gd-vip-btn" onClick={() => setActiveSection('vip')}>
            <VipIcon /> <span>VIP/CAR</span>
          </button>
          <button className="gd-menu-btn gd-menu-btn--disabled" id="gd-qr-btn" title="Coming soon">
            <QrIcon /> <span>SCAN QR</span>
          </button>
          <button className="gd-menu-btn" id="gd-logs-btn" onClick={() => setActiveSection('logs')}>
            <LogsIcon /> <span>VIEW LOGS</span>
          </button>
          <button className="gd-menu-btn gd-menu-btn--disabled" id="gd-calendar-btn" title="Coming soon">
            <CalendarIcon /> <span>CALENDAR</span>
          </button>
        </div>

        {/* Active visitors */}
        <div className="gd-active-section">
          <h2 className="gd-active-title">Active</h2>
          {activeVisitors.length === 0 ? (
            <p className="gd-no-active">No active visitors</p>
          ) : (
            activeVisitors.map(v => (
              <div key={v.id} className="gd-visitor-row">
                <div className="gd-visitor-main">
                  <p className="gd-visitor-name">{v.name}</p>
                  <p className="gd-visitor-sub"><strong>Time in:</strong> {v.timeIn}</p>
                  <p className="gd-visitor-sub gd-time-out">Time Out: —</p>
                </div>
                <div className="gd-visitor-right">
                  <p className="gd-visitor-date">{v.date}</p>
                  <p className="gd-visitor-dest">{v.destination} – {v.purpose}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Logout */}
        <button id="guard-logout-btn" className="gd-logout" onClick={handleLogout}>
          <PowerIcon />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   VIP / CAR Entry Form sub-screen
───────────────────────────────────── */
function VipForm({ onBack, gate }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', plate: '', destination: '', purpose: '' });
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.destination || !form.purpose) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ name: '', plate: '', destination: '', purpose: '' }); }, 2000);
  };

  return (
    <div className="gd-page">
      <header className="gd-header">
        <img src="/wuplogo.png" alt="VisiTrack" className="gd-header-logo" />
        <span className="gd-header-brand">VisiTrack</span>
      </header>
      <div className="gd-body">
        <div className="vip-back-row">
          <button className="gd-back-btn" onClick={onBack}>← Back</button>
        </div>
        <div className="vip-form-card">
          <h2 className="vip-form-title">V.I.P.</h2>

          {submitted && (
            <div className="vip-success">✓ Entry logged successfully!</div>
          )}

          <form className="vip-form" onSubmit={handleAdd} noValidate>
            <div className="vip-field">
              <label htmlFor="vip-name">NAME <span className="req">*</span></label>
              <input id="vip-name" type="text" value={form.name} onChange={set('name')} required placeholder="Full name" />
            </div>
            <div className="vip-field">
              <label htmlFor="vip-plate">Car/Plate Number <span className="req">*</span></label>
              <input id="vip-plate" type="text" value={form.plate} onChange={set('plate')} placeholder="e.g. ABC 1234 (optional)" />
            </div>
            <div className="vip-field">
              <label htmlFor="vip-dest">Destination <span className="req">*</span></label>
              <select id="vip-dest" value={form.destination} onChange={set('destination')} required>
                <option value="">— Select —</option>
                {DESTINATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="vip-field">
              <label htmlFor="vip-purpose">PURPOSE <span className="req">*</span></label>
              <select id="vip-purpose" value={form.purpose} onChange={set('purpose')} required>
                <option value="">— Select —</option>
                {PURPOSES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <button id="vip-add-btn" type="submit" className="vip-add-btn">Add</button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   Guard Logs sub-screen
───────────────────────────────────── */
function GuardLogs({ onBack }) {
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const logs = visitorLogs.slice(0, 12);

  return (
    <div className="gd-page">
      <header className="gd-header">
        <img src="/wuplogo.png" alt="VisiTrack" className="gd-header-logo" />
        <span className="gd-header-brand">VisiTrack</span>
      </header>
      <div className="gd-body">
        <div className="vip-back-row">
          <button className="gd-back-btn" onClick={onBack}>← Back</button>
          <h2 className="gl-title">View Logs</h2>
          <span className="gl-date">{today}</span>
        </div>
        <div className="gl-list">
          {logs.map(v => (
            <div key={v.id} className={`gl-row ${v.isActive ? 'gl-row--active' : ''}`}>
              <div className="gl-left">
                <p className="gl-name">{v.name}</p>
                <p className="gl-sub"><strong>Time in:</strong> {v.timeIn}</p>
                <p className="gl-sub gl-timeout">{v.timeOut ? `Time Out: ${v.timeOut}` : 'Time Out: —'}</p>
              </div>
              <div className="gl-right">
                <p className="gl-rdate">{v.date}</p>
                <p className="gl-rdest">{v.destination} – {v.purpose}</p>
                {v.isActive && <span className="gl-badge">Active</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
