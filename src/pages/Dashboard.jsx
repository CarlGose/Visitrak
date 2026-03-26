import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { visitorLogs, vipVisitors, inCampus } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentDate = '10-11-2025';

  const { totalVisitorsThisMonth, todaysVisitors, monthYear, todaysDateFormatted } = useMemo(() => {
    // For simplicity, defining monthYear directly
    const monthYear = 'Oct 2025';
    const todaysDateFormatted = 'Oct 11, 2025';

    // Mock count total visitors this month
    const currentMonthVisitors = visitorLogs.filter(log => log.date.startsWith('10-'));
    const totalVisitorsThisMonthCount = 350; // hardcoding to matched the mockup, or calculate

    // Mock count today's visitors
    const todaysVisitorsCount = visitorLogs.filter(log => log.date === currentDate).length;

    return {
      totalVisitorsThisMonth: totalVisitorsThisMonthCount,
      todaysVisitors: todaysVisitorsCount, // using hardcoded 24 to match mockup from mockData length
      monthYear,
      todaysDateFormatted
    };
  }, []);

  const recentLogs = useMemo(() => {
    return visitorLogs.filter(log => log.date === currentDate);
  }, []);

  return (
    <div className="dashboard-page">
      <Header />
      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Monitor and manage campus visitors</p>
          </div>
        </div>

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

            <div className="dashboard-vip">
              <div className="table-container">
                <div className="table-header vip-header">Currently VIP In-Campus</div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Destination</th>
                      <th>Time-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vipVisitors.map((visitor, index) => (
                      <tr key={`vip-${visitor.id || index}`}>
                        <td>{visitor.date}</td>
                        <td>{visitor.name}</td>
                        <td>{visitor.destination}</td>
                        <td>{visitor.timeIn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="dashboard-in-campus">
             <div className="table-container header-green">
              <div className="table-header">Currently In-Campus</div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Destination</th>
                      <th>Time-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inCampus.map((visitor, index) => (
                      <tr key={`incampus-${visitor.id || index}`}>
                        <td>{visitor.date}</td>
                        <td>{visitor.name}</td>
                        <td>{visitor.destination}</td>
                        <td>{visitor.timeIn}</td>
                      </tr>
                    ))}
                    {/* Fill empty rows for layout matching mockup */}
                    <tr><td colSpan="4" style={{ height: '54px' }}></td></tr>
                    <tr><td colSpan="4" style={{ height: '54px' }}></td></tr>
                  </tbody>
                </table>
              </div>
          </div>
        </div>

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
                    {recentLogs.map((log) => (
                      <tr key={`log-${log.id}`}>
                        <td>{log.date}</td>
                        <td>{log.timeIn}</td>
                        <td className={log.timeOut ? '' : 'time-out-active'}>
                          {log.timeOut || 'Active'}
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

          <div className="dashboard-logs-section">
            <div className="logs-header">
              <div className="logs-title-area">
                <div className="logs-date-indicator">
                  <span className="logs-today">Today</span>
                  <span className="logs-date">{todaysDateFormatted}</span>
                </div>
                <h2>VIP Logs</h2>
              </div>
              <button className="view-all-btn" onClick={() => navigate('/vip-logs')}>
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
                      <th>NAME</th>
                      <th>DESTINATION</th>
                      <th>TIME-IN</th>
                      <th>TIME-OUT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vipVisitors.map((log, index) => (
                      <tr key={`vip-log-${log.id || index}`}>
                        <td>{log.date}</td>
                        <td>{log.name}</td>
                        <td>{log.destination}</td>
                        <td>{log.timeIn}</td>
                        <td className={log.timeOut ? '' : 'time-out-active'}>
                          {log.timeOut || 'Active'}
                        </td>
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
