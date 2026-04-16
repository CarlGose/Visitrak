import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scanner } from '@yudiel/react-qr-scanner';
import { supabase } from '../supabaseClient';
import './GuardDashboard.css';

// Icons
const VipIcon = () => (
  <span className="menu-badge">VIP</span>
);
const QrIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h2v2h-2zM16 16h2v2h-2zM18 18h3v3h-3zM14 18h2v2h-2zM18 14h3v2h-3z" />
  </svg>
);
const LogsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="15" y2="11" />
    <line x1="9" y1="15" x2="13" y2="15" />
  </svg>
);
const QueueIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
const ActiveIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
  </svg>
);
const PowerIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    <line x1="12" y1="2" x2="12" y2="12" />
  </svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
    <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [y, m, d] = dateStr.split('-');
    return `${m}/${d}/${y}`;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const mn = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    const yr = d.getFullYear();
    return `${mn}/${dy}/${yr}`;
  }
  return dateStr;
};

export default function GuardDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null); // null=menu , 'vip'=VIP form, 'logs'=logs

  const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleLogout = () => {
    logout();
    navigate('/guard/login');
  };

  if (activeSection === 'vip') return <VipForm onBack={() => setActiveSection(null)} />;
  if (activeSection === 'logs') return <GuardLogs onBack={() => setActiveSection(null)} />;
  if (activeSection === 'qr') return <QrScanner onBack={() => setActiveSection(null)} />;
  if (activeSection === 'vip_queue') return <VipQueueList onBack={() => setActiveSection(null)} />;
  if (activeSection === 'active') return <ActiveVisitorsScreen onBack={() => setActiveSection(null)} />;

  return (
    <div className="gd-page">
      {/* ── Header ── */}
      <header className="gd-header">
        <img src="/wuplogo.png" alt="VisiTrack" className="gd-header-logo" />
        <span className="gd-header-brand">VisiTrack</span>
        <button id="guard-logout-btn" className="gd-header-logout" onClick={handleLogout}>
          <PowerIcon />
          <span>Log out</span>
        </button>
      </header>

      <div className="gd-body">
        {/* Dashboard title */}
        <h1 className="gd-title">Dashboard</h1>

        {/* Guard profile card */}
        <div className="gd-profile-card">
          <div className="gd-avatar">
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="44" height="44">
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
              </svg>
            )}
          </div>
          <div className="gd-profile-info">
            <p className="gd-profile-row"><span className="gd-label">Guard ID:</span> {user?.guardId || '—'}</p>
            <p className="gd-profile-row"><span className="gd-label">Name:</span> {user?.name || 'Guard'}</p>
            <p className="gd-profile-row"><span className="gd-label">Date:</span> {todayStr}</p>
          </div>
        </div>

        {/* Menu buttons */}
        <div className="gd-menu">
          <button className="gd-menu-btn" id="gd-vip-btn" onClick={() => setActiveSection('vip')}>
            <div className="gd-btn-icon-container"><VipIcon /></div>
            <span className="gd-btn-label">VIP/CAR</span>
            <div className="gd-btn-arrow"><ArrowRight /></div>
          </button>
          <button className="gd-menu-btn" id="gd-qr-btn" onClick={() => setActiveSection('qr')}>
            <div className="gd-btn-icon-container"><QrIcon /></div>
            <span className="gd-btn-label">SCAN QR</span>
            <div className="gd-btn-arrow"><ArrowRight /></div>
          </button>
          <button className="gd-menu-btn" id="gd-logs-btn" onClick={() => setActiveSection('logs')}>
            <div className="gd-btn-icon-container"><LogsIcon /></div>
            <span className="gd-btn-label">VIEW LOGS</span>
            <div className="gd-btn-arrow"><ArrowRight /></div>
          </button>
          <button className="gd-menu-btn" id="gd-queue-btn" onClick={() => setActiveSection('vip_queue')}>
            <div className="gd-btn-icon-container"><QueueIcon /></div>
            <span className="gd-btn-label">VIP QUEUES</span>
            <div className="gd-btn-arrow"><ArrowRight /></div>
          </button>
          <button className="gd-menu-btn" id="gd-active-btn" onClick={() => setActiveSection('active')}>
            <div className="gd-btn-icon-container"><ActiveIcon /></div>
            <span className="gd-btn-label">ACTIVE VISITORS</span>
            <div className="gd-btn-arrow"><ArrowRight /></div>
          </button>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   VIP / CAR Entry Form sub-screen
───────────────────────────────────── */
function VipForm({ onBack }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', plate: '', personToVisit: '', date: '' });
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.plate || !form.personToVisit || !form.date) return;

    const { error } = await supabase.from('vip_queue').insert([{
      name: form.name,
      plate: form.plate,
      person_to_visit: form.personToVisit,
      date: form.date,
      added_by: user?.name,
      timestamp: new Date().toLocaleTimeString()
    }]);

    if (!error) {
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setForm({ name: '', plate: '', personToVisit: '', date: '' }); }, 2000);
    } else {
      console.error(error);
      alert("Error adding VIP");
    }
  };

  return (
    <div className="vp-page-override">
      <div className="vp-wrapper">
        <form className="vp-form-card" onSubmit={handleAdd}>
          <div className="vp-brand">
            <img src="/wuplogo.png" alt="VisiTrack Logo" className="vp-logo" />
            <span className="vp-brand-name">VisiTrack</span>
          </div>
          <p className="vp-tagline">Handle visitors without worries</p>

          <div className="vp-form-heading">
            <h1 className="vp-form-title">VIP Details</h1>
            <p className="vp-form-sub">Log a secure VIP entry pass</p>
          </div>

          {submitted && (
            <div className="vp-success">✓ VIP entry logged successfully!</div>
          )}

          <div className="vp-form">
            <div className="vp-field">
              <label htmlFor="vip-name">Name <span className="req">*</span></label>
              <input id="vip-name" type="text" placeholder="Visitor's full name" value={form.name} onChange={set('name')} required />
            </div>
            <div className="vp-field">
              <label htmlFor="vip-plate">Plate No. <span className="req">*</span></label>
              <input id="vip-plate" type="text" placeholder="Vehicle plate number" value={form.plate} onChange={set('plate')} required />
            </div>
            <div className="vp-field">
              <label htmlFor="vip-person">Person to Visit <span className="req">*</span></label>
              <input id="vip-person" type="text" placeholder="Whom they are visiting" value={form.personToVisit} onChange={set('personToVisit')} required />
            </div>
            <div className="vp-field" style={{ marginBottom: '12px' }}>
              <label htmlFor="vip-date">Date <span className="req">*</span></label>
              <input id="vip-date" type="date" value={form.date} onChange={set('date')} required />
            </div>
            <button id="vip-add-btn" type="submit" className="vp-add-btn">Log Info</button>
          </div>
        </form>

        <div className="vp-back-link">
          <button className="vp-back-link-btn" onClick={onBack}>← Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   Guard Logs sub-screen
───────────────────────────────────── */
function GuardLogs({ onBack }) {
  const [showVip, setShowVip] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Helper to convert mockData dates like '10-11-2025' or '10-9-2025' to 'YYYY-MM-DD'
  const normalizeDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const d = String(parsedDate.getDate()).padStart(2, '0');
      const y = parsedDate.getFullYear();
      return `${y}-${m}-${d}`;
    }
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      let [m, d, y] = parts;
      if (m.length === 1) m = '0' + m;
      if (d.length === 1) d = '0' + d;
      if (y.length === 2) y = '20' + y;
      return `${y}-${m}-${d}`;
    }
    return dateStr;
  };

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchLogs();
  }, [showVip]);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visitor_logs')
      .select('*')
      .eq('is_vip', showVip)
      .order('id', { ascending: false });
    
    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  const filteredLogs = logs.filter(log => {
    if (!showVip && log.is_active) return false;
    const term = searchTerm.toLowerCase();
    const searchMatch = !term || (
      log.name?.toLowerCase().includes(term) ||
      log.destination?.toLowerCase().includes(term) ||
      log.purpose?.toLowerCase().includes(term)
    );
    const dateMatch = !selectedDate || normalizeDate(log.date) === selectedDate;
    return searchMatch && dateMatch;
  });

  return (
    <div className="gd-page">
      <header className="gd-header">
        <img src="/wuplogo.png" alt="VisiTrack" className="gd-header-logo" />
        <span className="gd-header-brand">VisiTrack</span>
      </header>
      <div className="gd-body">
        <div className="vip-back-row" style={{ alignItems: 'center' }}>
          <button className="vp-back-link-btn" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1a2820', fontWeight: '700', fontSize: '1rem', padding: 0, margin: 0, border: 'none', background: 'none', cursor: 'pointer' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
             Back
          </button>
          <h2 className="gl-title">View Logs</h2>
          <span className="gl-date">{today}</span>
        </div>

        <div className="gl-toggle-container">
          <button
            className={`gl-toggle-btn ${!showVip ? 'active' : ''}`}
            onClick={() => setShowVip(false)}
          >
            Regular Logs
          </button>
          <button
            className={`gl-toggle-btn ${showVip ? 'active' : ''}`}
            onClick={() => setShowVip(true)}
          >
            VIP Logs
          </button>
        </div>

        <div className="gl-filters">
          <input
            type="text"
            className="gl-search-input"
            placeholder="Search by name, destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            className="gl-date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="gl-list">
          {loading ? (
            <p className="gd-no-active" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading logs...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="gd-no-active" style={{ textAlign: 'center', marginTop: '2rem' }}>No {showVip ? 'VIP' : 'visitor'} logs found</p>
          ) : (
            filteredLogs.map(v => (
              <div key={v.id} className="gl-row" style={showVip ? { borderLeftColor: '#fbc02d' } : {}}>
                <div className="gl-left">
                  <p className="gl-name">{v.name}</p>
                  <p className="gl-sub"><strong>Time in:</strong> {v.time_in}</p>
                  <p className="gl-sub" style={{ color: '#555' }}>Time Out: {v.time_out || '—'}</p>
                </div>
                <div className="gl-right">
                  <p className="gl-rdate">{formatDateDisplay(v.date)}</p>
                  <p className="gl-rdest">{v.destination} {v.purpose ? `– ${v.purpose}` : ''}</p>
                </div>
              </div>
            ))
          )}
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

  const handleScan = async (detectedCodes) => {
    if (scanResult) return;
    if (detectedCodes && detectedCodes.length > 0) {
      const raw = detectedCodes[0].rawValue;
      try {
        const parsed = JSON.parse(raw);

        const dateToCheck = parsed.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Fetch logs relevant to this user
        const { data: userLogs, error } = await supabase
          .from('visitor_logs')
          .select('*')
          .eq('name', parsed.name);
          
        if (error) throw error;

        const existingActive = userLogs?.find(v => v.is_active);
        const alreadyLoggedToday = userLogs?.find(v => !v.is_active && v.date === dateToCheck && v.time_in && v.time_out);

        let actionMsg = '';
        if (alreadyLoggedToday) {
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
        } else if (existingActive) {
          await supabase
            .from('visitor_logs')
            .update({ time_out: timeString, is_active: false })
            .eq('id', existingActive.id);
            
          actionMsg = `TIME OUT SUCCESSFUL at ${timeString}`;
        } else {
          await supabase
            .from('visitor_logs')
            .insert([{
              name: parsed.name,
              destination: parsed.destination || 'Campus',
              purpose: parsed.purpose || 'Visit',
              date: parsed.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              time_in: timeString,
              time_out: null,
              is_active: true,
              address: parsed.address || '',
              is_vip: false
            }]);
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
      } catch (err) { }
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

/* ─────────────────────────────────────
   VIP Queue List sub-screen
───────────────────────────────────── */
function VipQueueList({ onBack }) {
  const [queue, setQueue] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  React.useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    const { data } = await supabase.from('vip_queue').select('*').order('id', { ascending: false });
    if (data) setQueue(data);
    setLoading(false);
  };

  const handleArrived = async (vip) => {
    // Delete from queue
    await supabase.from('vip_queue').delete().eq('id', vip.id);

    // Insert to visitor_logs
    await supabase.from('visitor_logs').insert([{
      name: vip.name,
      destination: vip.person_to_visit || vip.destination || 'VIP Visit',
      purpose: 'VIP',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time_in: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      time_out: null,
      is_active: true,
      is_vip: true
    }]);

    fetchQueue();
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to remove this VIP from the queue?")) return;
    await supabase.from('vip_queue').delete().eq('id', id);
    fetchQueue();
  };

  return (
    <div className="vp-page-override">
      {/* Branding top left */}
      <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/wuplogo.png" alt="VisiTrack Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1a2820', background: 'linear-gradient(135deg, #2d3e2e 0%, #4a6b3a 40%, #c9a227 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VisiTrack</span>
      </div>

      <div className="vp-wrapper" style={{ maxWidth: '1400px', width: '95%', height: '90vh', margin: 'auto' }}>
        <div className="vp-form-card" style={{ padding: '40px', height: '100%', maxHeight: 'none', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
             <button className="vp-back-link-btn" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1a2820', fontWeight: '700', fontSize: '1.1rem', padding: 0, margin: 0 }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
               Back
             </button>
             <h2 className="vp-form-title" style={{ margin: 0, fontSize: '2.2rem', textAlign: 'center' }}>VIP Queues</h2>
             <span style={{ color: '#1a2820', fontWeight: '600', fontSize: '1rem' }}>{today}</span>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {loading ? (
              <p className="vp-form-sub" style={{ textAlign: 'center', margin: '40px 0' }}>Loading VIP queue...</p>
            ) : queue.length === 0 ? (
              <p className="vp-form-sub" style={{ textAlign: 'center', margin: '40px 0' }}>No VIPs queued currently</p>
            ) : (
              queue.map(v => (
                <div key={v.id} style={{ backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '16px', padding: '24px', borderLeft: '6px solid #dcb353', boxShadow: '0 6px 16px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                    <div>
                      <p style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1a2820', margin: '0 0 8px' }}>{v.name}</p>
                      <p style={{ margin: '0 0 6px', fontSize: '1rem', color: '#444' }}><strong>Plate No:</strong> {v.plate}</p>
                      <p style={{ margin: 0, fontSize: '1rem', color: '#444' }}><strong>Logged By:</strong> {v.added_by} {v.timestamp ? `at ${v.timestamp}` : ''}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 8px', color: '#c62828', fontWeight: '800', fontSize: '1rem' }}>Expected: {formatDateDisplay(v.date)}</p>
                      <p style={{ margin: '0 0 10px', fontSize: '1rem', color: '#444' }}>
                        {v.person_to_visit ? `Visiting: ${v.person_to_visit}` : v.destination}
                      </p>
                      <span style={{ backgroundColor: '#fff8e1', color: '#f57f17', border: '1px solid #ffe082', borderRadius: '20px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: '800', display: 'inline-block' }}>VIP STATUS</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginTop: '24px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '20px' }}>
                    <button
                      onClick={() => handleArrived(v)}
                      style={{ flex: 1, padding: '14px', backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.05rem' }}>
                      ✓ Mark Arrived
                    </button>
                    <button
                      onClick={() => handleCancel(v.id)}
                      style={{ flex: 1, padding: '14px', backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.05rem' }}>
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────
   Active Visitors sub-screen
───────────────────────────────────── */
function ActiveVisitorsScreen({ onBack }) {
  const [showVip, setShowVip] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [activeLogs, setActiveLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  React.useEffect(() => {
    fetchActiveLogs();
  }, [showVip]);

  const fetchActiveLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('visitor_logs')
      .select('*')
      .eq('is_active', true)
      .eq('is_vip', showVip)
      .order('id', { ascending: false });
    
    if (data) setActiveLogs(data);
    setLoading(false);
  };

  const handleManualTimeOut = async (log) => {
    if (!window.confirm(`Are you sure you want to manually time out ${log.name}?`)) return;
    
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const { error } = await supabase
      .from('visitor_logs')
      .update({ time_out: timeString, is_active: false })
      .eq('id', log.id);
      
    if (!error) {
      fetchActiveLogs();
    } else {
      alert("Error timing out visitor");
    }
  };

  const normalizeDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const d = String(parsedDate.getDate()).padStart(2, '0');
      const y = parsedDate.getFullYear();
      return `${y}-${m}-${d}`;
    }
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      let [m, d, y] = parts;
      if (m.length === 1) m = '0' + m;
      if (d.length === 1) d = '0' + d;
      if (y.length === 2) y = '20' + y;
      return `${y}-${m}-${d}`;
    }
    return dateStr;
  };

  const filteredLogs = activeLogs.filter(log => {
    const term = searchTerm.toLowerCase();
    const searchMatch = !term || (
      log.name?.toLowerCase().includes(term) ||
      log.destination?.toLowerCase().includes(term) ||
      log.purpose?.toLowerCase().includes(term)
    );
    const dateMatch = !selectedDate || normalizeDate(log.date) === selectedDate;
    return searchMatch && dateMatch;
  });

  return (
    <div className="gd-page">
      <header className="gd-header">
        <img src="/wuplogo.png" alt="VisiTrack" className="gd-header-logo" />
        <span className="gd-header-brand">VisiTrack</span>
      </header>
      <div className="gd-body">
        <div className="vip-back-row" style={{ alignItems: 'center' }}>
          <button className="vp-back-link-btn" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1a2820', fontWeight: '700', fontSize: '1rem', padding: 0, margin: 0, border: 'none', background: 'none', cursor: 'pointer' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
             Back
          </button>
          <h2 className="gl-title">Active Visitors</h2>
          <span className="gl-date">{today}</span>
        </div>

        <div className="gl-toggle-container">
          <button
            className={`gl-toggle-btn ${!showVip ? 'active' : ''}`}
            onClick={() => setShowVip(false)}
          >
            Regular
          </button>
          <button
            className={`gl-toggle-btn ${showVip ? 'active' : ''}`}
            onClick={() => setShowVip(true)}
          >
            VIP
          </button>
        </div>

        <div className="gl-filters">
          <input
            type="text"
            className="gl-search-input"
            placeholder="Search by name, destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            className="gl-date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="gl-list">
          {loading ? (
            <p className="gd-no-active" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading active visitors...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="gd-no-active" style={{ textAlign: 'center', marginTop: '2rem' }}>No active {showVip ? 'VIPs' : 'visitors'} found</p>
          ) : (
            filteredLogs.map(v => (
              <div key={v.id} className="gl-row gl-row--active" style={showVip ? { borderLeftColor: '#fbc02d' } : {}}>
                <div className="gl-left">
                  <p className="gl-name">{v.name}</p>
                  <p className="gl-sub"><strong>Time in:</strong> {v.time_in}</p>
                  <p className="gl-sub gl-timeout">Time Out: —</p>
                </div>
                <div className="gl-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p className="gl-rdate">{formatDateDisplay(v.date)}</p>
                    <p className="gl-rdest">{v.destination} {v.purpose ? `– ${v.purpose}` : ''}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                    <span className="gl-badge" style={showVip ? { backgroundColor: '#fff8e1', color: '#f57f17', border: '1px solid #ffe082' } : {}}>Active</span>
                    <button 
                      onClick={() => handleManualTimeOut(v)}
                      style={{ padding: '6px 14px', fontSize: '0.8rem', fontWeight: '800', border: '1px solid #ddd', backgroundColor: '#fff', borderRadius: '8px', cursor: 'pointer', color: '#555', transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.target.style.backgroundColor = '#f1f3f5'; e.target.style.borderColor = '#ccc'; }}
                      onMouseLeave={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.borderColor = '#ddd'; }}
                    >
                      Time Out
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
