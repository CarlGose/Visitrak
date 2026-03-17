import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitorLogs } from '../data/mockData';
import './UsersPage.css';

export default function UsersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const activeVisitors  = visitorLogs.filter(v => v.isActive);
  const totalToday      = visitorLogs.filter(v => v.date === '10-11-2025').length;

  const filtered = visitorLogs.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.destination.toLowerCase().includes(search.toLowerCase()) ||
    v.purpose.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="up-page">
      {/* Header */}
      <header className="up-header">
        <button className="up-back-btn" onClick={() => navigate('/')} id="users-back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <img src="/wuplogo.png" alt="VisiTrack" className="up-header-logo" />
        <span className="up-header-brand">VisiTrack</span>
        <span className="up-header-sub">Visitor Records</span>
      </header>

      <div className="up-body">
        {/* Date */}
        <p className="up-date">{today}</p>

        {/* Stat cards */}
        <div className="up-stats">
          <div className="up-stat up-stat--blue">
            <span className="up-stat-label">Active Now</span>
            <span className="up-stat-value">{activeVisitors.length}</span>
          </div>
          <div className="up-stat up-stat--yellow">
            <span className="up-stat-label">Today's Visitors</span>
            <span className="up-stat-value">{totalToday}</span>
          </div>
          <div className="up-stat up-stat--green">
            <span className="up-stat-label">Total Records</span>
            <span className="up-stat-value">{visitorLogs.length}</span>
          </div>
        </div>

        {/* Active visitors */}
        {activeVisitors.length > 0 && (
          <div className="up-section">
            <h2 className="up-section-title up-section-title--active">
              <span className="up-dot" /> Currently On Campus
            </h2>
            <div className="up-active-list">
              {activeVisitors.map(v => (
                <div key={v.id} className="up-active-row">
                  <div className="up-active-avatar">{v.name.charAt(0)}</div>
                  <div className="up-active-info">
                    <p className="up-active-name">{v.name}</p>
                    <p className="up-active-meta">{v.destination} · {v.purpose}</p>
                    <p className="up-active-time">Time in: {v.timeIn}</p>
                  </div>
                  <span className="up-active-badge">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All visitor logs */}
        <div className="up-section">
          <div className="up-section-header">
            <h2 className="up-section-title">All Visitor Logs</h2>
            {/* Search */}
            <div className="up-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                id="users-search"
                type="text"
                placeholder="Search name, destination…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="up-table-wrap">
            <table className="up-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Destination</th>
                  <th>Purpose</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="8" className="up-empty">No records found.</td></tr>
                ) : (
                  filtered.map((v, i) => (
                    <tr key={v.id} className={v.isActive ? 'up-row--active' : ''}>
                      <td>{i + 1}</td>
                      <td className="up-name-cell">{v.name}</td>
                      <td>{v.destination}</td>
                      <td>{v.purpose}</td>
                      <td>{v.timeIn}</td>
                      <td>{v.timeOut || <span className="up-pending">—</span>}</td>
                      <td>{v.date}</td>
                      <td>
                        {v.isActive
                          ? <span className="up-badge up-badge--active">Active</span>
                          : <span className="up-badge up-badge--done">Done</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
