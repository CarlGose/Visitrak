import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scanner } from '@yudiel/react-qr-scanner';
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
  if (activeSection === 'qr') return <QrScanner onBack={() => setActiveSection(null)} />;

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
          <button className="gd-menu-btn" id="gd-qr-btn" onClick={() => setActiveSection('qr')}>
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
  const [form, setForm] = useState({ name: '', plate: '', destination: '', date: '' });
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.plate || !form.destination || !form.date) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ name: '', plate: '', destination: '', date: '' }); }, 2000);
  };

  return (
    <div className="gd-page vip-page-override">
      <header className="gd-header vip-header-centered">
        <img src="/wuplogo.png" alt="VisiTrack Logo" className="gd-header-logo" />
      </header>
      <div className="gd-body vip-body-override">
        <div className="vip-back-row">
          <button className="gd-back-btn-icon" onClick={onBack}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
        </div>
        <div className="vip-form-card">
          <h2 className="vip-form-title">VIP INFO</h2>

          {submitted && (
            <div className="vip-success">✓ Entry logged successfully!</div>
          )}

          <form className="vip-form" onSubmit={handleAdd}>
            <div className="vip-field">
              <label htmlFor="vip-name">Name <span className="req">*</span></label>
              <input id="vip-name" type="text" value={form.name} onChange={set('name')} required />
            </div>
            <div className="vip-field">
              <label htmlFor="vip-plate">Plate No. <span className="req">*</span></label>
              <input id="vip-plate" type="text" value={form.plate} onChange={set('plate')} required />
            </div>
            <div className="vip-field">
              <label htmlFor="vip-dest">Destination <span className="req">*</span></label>
              <select id="vip-dest" value={form.destination} onChange={set('destination')} required>
                <option value=""></option>
                {DESTINATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="vip-field">
              <label htmlFor="vip-date">Date <span className="req">*</span></label>
              <input id="vip-date" type="date" value={form.date} onChange={set('date')} required />
            </div>
            <button id="vip-add-btn" type="submit" className="vip-add-btn">SUBMIT</button>
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

/* ─────────────────────────────────────
   QR Scanner sub-screen
───────────────────────────────────── */
function QrScanner({ onBack }) {
  const [scanResult, setScanResult] = useState(null);
  const [scanMessage, setScanMessage] = useState('');

  React.useEffect(() => {
    let timeoutId;
    if (scanMessage && scanResult && scanMessage.includes('WARNING')) {
        const speakWarning = () => {
            if (!('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Warning. User logged twice. Access denied.");
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v => v.name.toLowerCase().match(/(female|zira|samantha|victoria|luciana|karen)/));
            if (femaleVoice) utterance.voice = femaleVoice;
            utterance.pitch = 1.3;
            utterance.rate = 0.95;
            utterance.onend = () => {
                timeoutId = setTimeout(speakWarning, 1200);
            };
            window.speechSynthesis.speak(utterance);
        };
        speakWarning();
    }
    return () => {
        clearTimeout(timeoutId);
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [scanMessage, scanResult]);

  const handleScan = (detectedCodes) => {
    if (scanResult) return;
    if (detectedCodes && detectedCodes.length > 0) {
      const raw = detectedCodes[0].rawValue;
      try {
        const parsed = JSON.parse(raw);
        
        const dateToCheck = parsed.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const existingLogIndex = visitorLogs.findIndex(v => v.name === parsed.name && v.isActive);
        const alreadyLoggedIndex = visitorLogs.findIndex(v => v.name === parsed.name && !v.isActive && v.date === dateToCheck && v.timeIn && v.timeOut);
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let actionMsg = '';
        if (alreadyLoggedIndex >= 0) {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const playBeep = (freq, startTime, duration) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'square';
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
                    osc.start(ctx.currentTime + startTime);
                    osc.stop(ctx.currentTime + startTime + duration);
                };
                playBeep(300, 0, 0.15);
                playBeep(300, 0.25, 0.15);
            } catch (err) { console.error(err); }
            actionMsg = 'WARNING: VISITOR ALREADY LOGGED TODAY!';
        } else if (existingLogIndex >= 0) {
            visitorLogs[existingLogIndex].timeOut = timeString;
            visitorLogs[existingLogIndex].isActive = false;
            actionMsg = `TIME OUT SUCCESSFUL at ${timeString}`;
        } else {
            const newLog = {
                id: Date.now(),
                name: parsed.name,
                destination: parsed.destination || 'Campus',
                purpose: parsed.purpose || 'Visit',
                date: parsed.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                timeIn: timeString,
                timeOut: null,
                isActive: true
            };
            visitorLogs.unshift(newLog);
            actionMsg = `TIME IN SUCCESSFUL at ${timeString}`;
        }
        setScanMessage(actionMsg);
        setScanResult(parsed);
      } catch (e) {
        setScanResult({ rawText: raw });
        setScanMessage('Invalid QR Code');
      }
    }
  };

  const inputRef = React.useRef(null);

  React.useEffect(() => {
    const lockFocus = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus({ preventScroll: true });
      }
    };
    lockFocus();
    window.addEventListener('click', lockFocus);
    const interval = setInterval(lockFocus, 250);
    return () => {
      clearInterval(interval);
      window.removeEventListener('click', lockFocus);
    };
  }, []);

  const handleHardwareScanChange = (e) => {
    let val = e.target.value.trim();
    if (val.includes('{') && val.includes('}')) {
      const jsonStr = val.substring(val.indexOf('{'), val.lastIndexOf('}') + 1);
      try {
        JSON.parse(jsonStr);
        handleScan([{ rawValue: jsonStr }]);
        e.target.value = '';
      } catch(err) {}
    }
  };

  const handleHardwareScanKey = (e) => {
    if (e.key === 'Enter') {
      let val = e.target.value.trim();
      if (val.includes('{')) {
          val = val.substring(val.indexOf('{'));
      }
      if (val.length > 5) handleScan([{ rawValue: val }]);
      e.target.value = '';
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  return (
    <div className="gd-page vip-page-override">
      <input 
        ref={inputRef}
        type="text"
        onChange={handleHardwareScanChange}
        onKeyDown={handleHardwareScanKey}
        style={{ position: 'absolute', top: -9999, left: -9999, opacity: 0 }}
      />
      <header className="gd-header vip-header-centered">
        <img src="/wuplogo.png" alt="VisiTrack Logo" className="gd-header-logo" />
      </header>
      <div className="gd-body vip-body-override">
        <div className="vip-back-row">
          <button className="gd-back-btn-icon" onClick={onBack}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
        </div>
        <div className="vip-form-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="vip-form-title">SCAN QR</h2>
          
          {!scanResult ? (
            <div style={{ width: '100%', maxWidth: '350px', margin: '0 auto', overflow: 'hidden', borderRadius: '12px', border: '2px solid #eaeaea' }}>
              <Scanner 
                onScan={handleScan}
                onError={handleError}
                components={{
                  audio: true,
                  onOff: true,
                  torch: true,
                  zoom: true,
                  finder: true,
                }}
              />
              <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666', fontSize: '14px' }}>
                Point camera at visitor's QR code
              </p>
            </div>
          ) : (
             <div style={{ textAlign: 'center', width: '100%', padding: '1rem' }}>
                <div className="vip-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: scanMessage.includes('WARNING') ? 'rgba(244, 67, 54, 0.15)' : (scanMessage.includes('OUT') ? 'rgba(33, 150, 243, 0.15)' : 'rgba(76,175,80,0.25)'), color: scanMessage.includes('WARNING') ? '#d32f2f' : (scanMessage.includes('OUT') ? '#0d47a1' : '#c8f5ca') }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  {scanMessage || 'Scan Successful!'}
                </div>
                
                <div style={{ 
                  padding: '1.5rem', 
                  background: '#f8f9fa', 
                  borderRadius: '12px', 
                  border: '1px solid #e9ecef',
                  wordBreak: 'break-all',
                  marginBottom: '2rem',
                  fontSize: '16px',
                  color: '#333'
                }}>
                  <strong style={{ display: 'block', marginBottom: '8px', color: '#6c757d', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Scanned Data</strong>
                  {scanResult.name ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#555', paddingRight: '1rem' }}>Name:</span>
                        <span style={{ textAlign: 'right' }}>{scanResult.name}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#555', paddingRight: '1rem' }}>Address:</span>
                        <span style={{ textAlign: 'right' }}>{scanResult.address}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#555', paddingRight: '1rem' }}>Destination:</span>
                        <span style={{ textAlign: 'right' }}>{scanResult.destination}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#555', paddingRight: '1rem' }}>Purpose:</span>
                        <span style={{ textAlign: 'right' }}>{scanResult.purpose}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600', color: '#555', paddingRight: '1rem' }}>Date:</span>
                        <span style={{ textAlign: 'right' }}>{scanResult.date}</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ wordBreak: 'break-all', textAlign: 'center' }}>
                      {scanResult.rawText}
                    </div>
                  )}
                </div>
                
                <button 
                  className="vip-add-btn" 
                  onClick={() => setScanResult(null)}
                  style={{ width: '100%', maxWidth: '250px' }}
                >
                  SCAN ANOTHER
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
