import React, { useState } from 'react';
import Header from '../components/Header';
import { visitorLogs } from '../data/mockData';
import './Logs.css';

export default function Logs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(''); // 'YYYY-MM-DD'
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Helper to convert mockData dates like '10-11-2025' or '10-9-2025' to 'YYYY-MM-DD'
  const normalizeDate = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    let [m, d, y] = parts;
    if (m.length === 1) m = '0' + m;
    if (d.length === 1) d = '0' + d;
    if (y.length === 2) y = '20' + y;
    return `${y}-${m}-${d}`;
  };

  // Filter logs based on search term and selected date
  const filteredLogs = visitorLogs.filter(log => {
    const matchesSearch = 
      log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate ? normalizeDate(log.date) === selectedDate : true;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="logs-page">
      <Header />
      <main className="logs-content">
        <div className="logs-container">
          
          <div className="logs-header-section">
            <div className="search-bar">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="search by name" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <h1 className="logs-page-title">Visitor Logs</h1>
            
            <div className="calendar-container">
              <button className={`calendar-btn ${selectedDate ? 'active-date' : ''}`} aria-label="Select Date">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </button>
              <input 
                type="date" 
                className="calendar-date-input" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                title="Filter by date"
              />
              {selectedDate && (
                <button className="clear-date-btn" onClick={() => setSelectedDate('')} title="Clear Date">
                  &times;
                </button>
              )}
            </div>
          </div>

          <div className="logs-table-wrapper">
            <table className="logs-data-table">
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
                {filteredLogs.map((log) => (
                  <tr key={`log-${log.id}`}>
                    <td>{log.date}</td>
                    <td>{log.timeIn}</td>
                    <td>{log.timeOut || 'Active'}</td>
                    <td>{log.name}</td>
                    <td>{log.address}</td>
                    <td>{log.destination}</td>
                    <td>{log.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="logs-footer">
            <div className="export-container">
              <button className="export-btn" onClick={() => setExportMenuOpen(!exportMenuOpen)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export
              </button>
              
              {exportMenuOpen && (
                <div className="export-dropdown">
                  <button onClick={() => setExportMenuOpen(false)}>Days</button>
                  <button onClick={() => setExportMenuOpen(false)}>Weeks</button>
                  <button onClick={() => setExportMenuOpen(false)}>Months</button>
                  <button onClick={() => setExportMenuOpen(false)}>Year</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
