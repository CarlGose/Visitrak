import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [activeLogs, setActiveLogs] = useState([]);
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
    const { data: allLogs } = await supabase
      .from('visitor_logs')
      .select('*')
      .order('id', { ascending: false });

    if (allLogs) {
      setLogs(allLogs);
      setActiveLogs(allLogs.filter(L => L.is_active));
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
            </div>
          </div>


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
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" style={{textAlign: 'center'}}>Loading...</td></tr>
                    ) : recentLogs.length === 0 ? (
                      <tr><td colSpan="5" style={{textAlign: 'center'}}>No visitors today</td></tr>
                    ) : recentLogs.map((log) => (
                      <tr key={`log-${log.id}`}>
                        <td>{formatDateDisplay(log.date)}</td>
                        <td>{log.time_in}</td>
                        <td className={log.time_out ? '' : 'time-out-active'}>
                          {log.time_out || 'Active'}
                        </td>
                        <td>{log.name}</td>
                        <td>{log.destination}</td>
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
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                       <tr><td colSpan="4" style={{textAlign: 'center'}}>Loading...</td></tr>
                    ) : activeLogs.length === 0 ? (
                       <tr><td colSpan="4" style={{textAlign: 'center'}}>No one in campus</td></tr>
                    ) : activeLogs.map((visitor) => (
                      <tr key={`incampus-log-${visitor.id}`}>
                        <td>{formatDateDisplay(visitor.date)}</td>
                        <td>{visitor.name}</td>
                        <td>{visitor.destination}</td>
                        <td>{visitor.time_in}</td>
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
