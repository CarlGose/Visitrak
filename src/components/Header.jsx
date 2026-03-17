import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <img src="/wuplogo.png" alt="VisiTrack Logo" className="header-logo" />
        <span className="header-brand">VisiTrack</span>
        <nav className="header-nav" aria-label="Main navigation">
          <NavLink id="nav-dashboard" to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </NavLink>
          <NavLink id="nav-logs" to="/logs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Logs
          </NavLink>
          <NavLink id="nav-manage" to="/manage" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Manage
          </NavLink>
        </nav>
      </div>

      <div className="header-right">
        <div className="header-user">
          <div className="header-avatar" aria-label="User avatar">{user?.name?.charAt(0) || 'G'}</div>
          <div className="header-user-info">
            <span className="header-user-name">{user?.name || 'Admin'}</span>
            <span className="header-user-role">{user?.role || 'admin'}</span>
          </div>
        </div>
        <button id="logout-btn" className="header-logout" onClick={handleLogout} title="Logout" aria-label="Logout">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
