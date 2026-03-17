import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PortalSelect from './pages/PortalSelect';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Manage from './pages/Manage';
import Header from './components/Header';
import GuardLogin from './pages/GuardLogin';
import GuardDashboard from './pages/GuardDashboard';
import UsersPage from './pages/UsersPage';

// Protect admin routes — must be logged in as admin
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'guard') return <Navigate to="/guard/dashboard" replace />;
  return (
    <>
      <Header />
      {children}
    </>
  );
}

// Protect guard routes — must be logged in as guard
function GuardRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/guard/login" replace />;
  if (user.role === 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Landing portal selection ── */}
          <Route path="/" element={<PortalSelect />} />

          {/* ── Admin portal ── */}
          <Route path="/login"     element={<Login />} />
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/logs"      element={<AdminRoute><Logs /></AdminRoute>} />
          <Route path="/manage"    element={<AdminRoute><Manage /></AdminRoute>} />

          {/* ── Guard portal ── */}
          <Route path="/guard/login"     element={<GuardLogin />} />
          <Route path="/guard/dashboard" element={<GuardRoute><GuardDashboard /></GuardRoute>} />

          {/* ── Public users page ── */}
          <Route path="/users" element={<UsersPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
