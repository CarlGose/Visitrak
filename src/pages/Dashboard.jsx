import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [activeLogs, setActiveLogs] = useState([]);
  const [totalGuards, setTotalGuards] = useState(0);
  const [activeGuardsToday, setActiveGuardsToday] = useState(0);
  const [activeGuards, setActiveGuards] = useState([]);
  const [loading, setLoading] = useState(true);

  // For realism, let's use actual current dates instead of hardcoded 10-11-2025
  const today = new Date();
  const currentDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const monthYear = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const todaysDateFormatted = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const isoDate = `${year}-${month}-${day}`;

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

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // Fetch visitor logs
    const { data: allLogs } = await supabase
      .from('visitor_logs')
      .select('*')
      .order('id', { ascending: false });

    if (allLogs) {
      setLogs(allLogs);
      setActiveLogs(allLogs.filter(L => L.is_active));
    }

    // Fetch guards data for analytics
    const { data: allGuards } = await supabase
      .from('guards')
      .select('*');

    if (allGuards) {
      setTotalGuards(allGuards.length);

      // Live online guards — used for both the stat card and the guard list
      const onlineGuards = allGuards.filter(g => g.is_online);
      setActiveGuards(onlineGuards);

      // "Active Guards Today" mirrors the live online count
      setActiveGuardsToday(onlineGuards.length);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();

    // Real-time subscription — re-fetch whenever any row changes
    const channel = supabase
      .channel('dashboard-visitor-logs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'visitor_logs' },
        () => { fetchDashboardData(); }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guards' },
        () => { fetchDashboardData(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const { totalVisitorsThisMonth, todaysVisitors } = useMemo(() => {
    if (!logs) return { totalVisitorsThisMonth: 0, todaysVisitors: 0 };
    
    // Very simple stat calculation
    const totalVisitorsThisMonthCount = logs.length; // placeholder for actual month query
    const todaysVisitorsCount = logs.filter(log => log.date === currentDate || log.date === isoDate).length;

    return {
      totalVisitorsThisMonth: totalVisitorsThisMonthCount,
      todaysVisitors: todaysVisitorsCount
    };
  }, [logs, currentDate, isoDate]);

  const recentLogs = useMemo(() => {
    return logs.filter(log => log.date === currentDate || log.date === isoDate);
  }, [logs, currentDate, isoDate]);

  return (
    <div className="dashboard-page">
      <Header />
      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard <span className="live-badge"><span className="live-dot"></span>Live</span></h1>
            <p>Monitor and manage campus visitors</p>
          </div>
        </div>

        {/* TOP SECTION: stat cards (left) + VIP Logs big table (right) */}
        <div className="dashboard-top-section">
          <div className="dashboard-stats">
            <div className="stat-card-row">
              <div className="stat-card blue">
                <svg className="card-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h3>Total Visitors This Month</h3>
                <div className="stat-value">{totalVisitorsThisMonth}</div>
                <div className="stat-date">{monthYear}</div>
              </div>
              <div className="stat-card yellow">
                <svg className="card-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <h3>Today's Visitors</h3>
                <div className="stat-value">{todaysVisitors}</div>
                <div className="stat-date">{todaysDateFormatted}</div>
              </div>
              <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #bbf7d0' }}>
                <svg className="card-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <circle cx="12" cy="11" r="3"></circle>
                </svg>
                <h3 style={{ color: '#166534' }}>Active Guards Today</h3>
                <div className="stat-value" style={{ color: '#14532d' }}>{activeGuardsToday}</div>
                <div className="stat-date" style={{ color: '#166534' }}>{todaysDateFormatted}</div>
              </div>
              <div className="stat-card" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', border: '1px solid #e9d5ff' }}>
                <svg className="card-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b21a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h3 style={{ color: '#6b21a8' }}>Total Guards</h3>
                <div className="stat-value" style={{ color: '#581c87' }}>{totalGuards}</div>
                <div className="stat-date" style={{ color: '#6b21a8' }}>Overall</div>
              </div>
            </div>
          </div>


        </div>

        {/* ACTIVE GUARD LIST — live section */}
        <div className="active-guard-section">
          <div className="active-guard-header">
            <div className="active-guard-title-area">
              <span className="live-badge" style={{ fontSize: '0.65rem' }}><span className="live-dot"></span>Live</span>
              <h2 className="active-guard-title">Active Guards On Duty</h2>
            </div>
            <span className="active-guard-count">
              {activeGuards.length} {activeGuards.length === 1 ? 'guard' : 'guards'} online
            </span>
          </div>

          {loading ? (
            <div className="active-guard-empty">Loading...</div>
          ) : activeGuards.length === 0 ? (
            <div className="active-guard-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p>No guards are currently online</p>
            </div>
          ) : (
            <div className="active-guard-list">
              {activeGuards.map((guard) => (
                <div key={guard.id} className="active-guard-card">
                  <div className="active-guard-avatar">
                    {guard.photo ? (
                      <img src={guard.photo} alt={guard.name} className="active-guard-photo" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26" style={{ color: '#6b8f7e' }}>
                        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
                      </svg>
                    )}
                    <span className="active-guard-dot"></span>
                  </div>
                  <div className="active-guard-info">
                    <span className="active-guard-name">{guard.name}</span>
                    <span className="active-guard-id">{guard.guard_id}</span>
                  </div>
                  <div className="active-guard-gate">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    {guard.gate || 'Unassigned'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Visitor Logs (left) + Currently In-Campus (right, small) */}
        <div className="dashboard-logs-row">
          <div className="dashboard-logs-section">
            <div className="logs-header">
              <div className="logs-title-area">
                <div className="logs-date-indicator">
                  <span className="logs-today">Today</span>
                  <span className="logs-date">{todaysDateFormatted}</span>
                </div>
                <h2>Visitor Logs</h2>
              </div>
              <button className="view-all-btn" onClick={() => navigate('/logs')}>
                View All
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

            <div className="table-container logs-table-container">
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table logs-table">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>TIME-IN</th>
                      <th>TIME-OUT</th>
                      <th>NAME</th>
                      <th>DESTINATION</th>
                      <th>GATE IN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6" style={{textAlign: 'center'}}>Loading...</td></tr>
                    ) : recentLogs.length === 0 ? (
                      <tr><td colSpan="6" style={{textAlign: 'center'}}>No visitors today</td></tr>
                    ) : recentLogs.map((log) => (
                      <tr key={`log-${log.id}`}>
                        <td>{formatDateDisplay(log.date)}</td>
                        <td>{log.time_in}</td>
                        <td className={log.time_out ? '' : 'time-out-active'}>
                          {log.time_out || 'Active'}
                        </td>
                        <td>{log.name}</td>
                        <td>{log.destination}</td>
                        <td>{log.gate_in || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Currently In-Campus — small section (bottom-right) */}
          <div className="dashboard-logs-section">
            <div className="logs-header">
              <div className="logs-title-area">
                <div className="logs-date-indicator">
                  <span className="logs-today">Today</span>
                  <span className="logs-date">{todaysDateFormatted}</span>
                </div>
                <h2>Currently In-Campus</h2>
              </div>
            </div>

            <div className="table-container logs-table-container">
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table logs-table">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>NAME</th>
                      <th>DESTINATION</th>
                      <th>TIME-IN</th>
                      <th>GATE IN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                       <tr><td colSpan="5" style={{textAlign: 'center'}}>Loading...</td></tr>
                    ) : activeLogs.length === 0 ? (
                       <tr><td colSpan="5" style={{textAlign: 'center'}}>No one in campus</td></tr>
                    ) : activeLogs.map((visitor) => (
                      <tr key={`incampus-log-${visitor.id}`}>
                        <td>{formatDateDisplay(visitor.date)}</td>
                        <td>{visitor.name}</td>
                        <td>{visitor.destination}</td>
                        <td>{visitor.time_in}</td>
                        <td>{visitor.gate_in || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
