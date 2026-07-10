import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Star, 
  Users, 
  Shield, 
  Archive, 
  Menu, 
  X, 
  Sun, 
  Moon,
  ChevronsLeft,
  ChevronsRight,
  LogOut
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState(user?.name || 'Admin');
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Mobile menu visibility
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sidebar collapsed state (desktop only)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    // Dynamically fetch the real admin name from Supabase instead of relying on cached session
    if (user?.role === 'admin') {
      const fetchAdminProfile = async () => {
        const { data } = await supabase
          .from('admin_users')
          .select('name')
          .limit(1)
          .single();

        if (data && data.name) {
          // Temporarily override the name as requested
          if (data.name === 'Admin_OIC Guard' || data.name === 'Admin_OIC') {
            setAdminName('Guard_OIC_Admin1');
          } else {
            setAdminName(data.name);
          }
        }
      };
      fetchAdminProfile();
    } else if (user?.name) {
      setAdminName(user.name);
    }
  }, [user]);

  // Sync theme to document body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Sync collapsed state to document body (drives CSS variable for page margins)
  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    localStorage.setItem('sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle navigation menu"
        title="Toggle menu"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop overlay for mobile menu */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar aside panel */}
      <aside className={`app-sidebar ${isMobileOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand-container">
            <img src="/wuplogo.png" alt="WUP Logo" className="sidebar-logo wup-logo" />
            <span className="sidebar-brand sidebar-text">VisiTrack</span>
            <img src="/visitrak-badge.png" alt="VisiTrack Badge" className="sidebar-logo visitrak-badge sidebar-text" />
          </div>

          <nav className="sidebar-nav" aria-label="Main navigation">
            <NavLink 
              id="nav-dashboard" 
              to="/dashboard" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setIsMobileOpen(false)}
              title="Dashboard"
            >
              <LayoutDashboard size={20} />
              <span className="sidebar-text">Dashboard</span>
            </NavLink>
            <NavLink 
              id="nav-logs" 
              to="/logs" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setIsMobileOpen(false)}
              title="Logs"
            >
              <ClipboardList size={20} />
              <span className="sidebar-text">Logs</span>
            </NavLink>
            <NavLink 
              id="nav-vip-logs" 
              to="/vip-logs" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setIsMobileOpen(false)}
              title="VIP Logs"
            >
              <Star size={20} />
              <span className="sidebar-text">VIP Logs</span>
            </NavLink>
            <NavLink 
              id="nav-vip-queue" 
              to="/vip-queue" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setIsMobileOpen(false)}
              title="VIP Queue"
            >
              <Users size={20} />
              <span className="sidebar-text">VIP Queue</span>
            </NavLink>
            <NavLink 
              id="nav-archives" 
              to="/archives" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setIsMobileOpen(false)}
              title="Archives"
            >
              <Archive size={20} />
              <span className="sidebar-text">Archives</span>
            </NavLink>
            <NavLink 
              id="nav-manage" 
              to="/manage" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setIsMobileOpen(false)}
              title="Manage"
            >
              <Shield size={20} />
              <span className="sidebar-text">Manage</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-bottom">
          {/* Collapse / Expand toggle */}
          <button 
            className="sidebar-collapse-btn"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            <span className="sidebar-text">{isCollapsed ? 'Expand' : 'Collapse'}</span>
          </button>

          <div className="sidebar-controls">
            <button 
              className="theme-toggle-btn" 
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="sidebar-text">{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>

          <div className="sidebar-user">
            <div className="sidebar-avatar" aria-label="User avatar">{adminName.charAt(0)}</div>
            <div className="sidebar-user-info sidebar-text">
              <span className="sidebar-user-name">{adminName}</span>
              <span className="sidebar-user-role">{user?.role || 'admin'}</span>
            </div>
          </div>
          
          <button id="logout-btn" className="sidebar-logout" onClick={handleLogout} title="Logout" aria-label="Logout">
            <LogOut size={20} />
            <span className="logout-text sidebar-text">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
