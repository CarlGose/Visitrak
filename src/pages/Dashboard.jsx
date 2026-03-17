import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { visitorLogs, vipVisitors, inCampus } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentDate = '10-11-2025';

  const { totalVisitorsThisMonth, todaysVisitors, monthYear } = useMemo(() => {
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
          <h1>Dashboard</h1>
          <p>Monitor and manage campus visitors</p>
        </div>

        <div className="dashboard-top-section">
          <div className="dashboard-stats">
            <div className="stat-card-row">
              <div className="stat-card blue">
                <h3>Total Visitors This Month</h3>
                <div className="stat-value">{totalVisitorsThisMonth}</div>
                <div className="stat-date">{monthYear}</div>
              </div>
              <div className="stat-card yellow">
                <h3>Today's Visitors</h3>
                <div className="stat-value">24</div>
                <div className="stat-date">Oct 11, 2025</div>
              </div>
            </div>

            <div className="dashboard-vip">
              <div className="table-header vip-header">Vip</div>
              <div className="table-container">
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
                    <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
                    <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
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
                <span className="logs-date">October 11, 2025</span>
              </div>
              <h2>Visitor Logs</h2>
            </div>
            <button className="view-all-btn" onClick={() => navigate('/logs')}>View All</button>
          </div>
          
          <div className="table-container logs-table-container">
            <table className="data-table logs-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>TIME-IN</th>
                  <th>TIME-OUT</th>
                  <th>NAME</th>
                  <th>ADDRESS</th>
                  <th>DESTINATION</th>
                  <th>PURPOSE</th>
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
                    <td>{log.address}</td>
                    <td>{log.destination}</td>
                    <td>{log.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
