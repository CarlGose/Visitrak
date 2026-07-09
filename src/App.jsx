import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PortalSelect from './pages/PortalSelect';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Manage from './pages/Manage';
import GuardLogin from './pages/GuardLogin';
import GuardDashboard from './pages/GuardDashboard';
import UserForm from './pages/user-form';
import UserLanding from './pages/UserLanding';
import VipLogs from './pages/VipLogs';
import VipQueue from './pages/VipQueue';
import Archives from './pages/Archives';

// Protect admin routes — must be logged in as admin
function AdminRoute({ children }) {
  const { user } = useAuth();
  // On /guard/* paths the user state is loaded from the guard key,
  // so we only check the admin key for admin routes.
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  return children;
}

// Protect guard routes — must be logged in as guard
function GuardRoute({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== 'guard') return <Navigate to="/guard/login" replace />;
  return children;
}

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/guard') || path === '/dashboard' || path === '/logs' || path === '/vip-logs' || path === '/vip-queue' || path === '/archives' || path === '/manage' || path === '/login' || path === '/staff') {
      document.title = 'Visitrack-WUP-Access';
    } else if (path === '/fill-out' || path === '/') {
      document.title = 'Visitrack-Welcome';
    } else {
      document.title = 'VisiTrack';
    }
  }, [location]);

  return null;
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <TitleUpdater />
        <Routes>
          {/* ── User Gateway ── */}
          <Route path="/" element={<UserLanding />} />

          {/* ── Staff Portal Selection ── */}
          <Route path="/staff" element={<PortalSelect />} />

          {/* ── Admin portal ── */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/logs" element={<AdminRoute><Logs /></AdminRoute>} />
          <Route path="/vip-logs" element={<AdminRoute><VipLogs /></AdminRoute>} />
          <Route path="/vip-queue" element={<AdminRoute><VipQueue /></AdminRoute>} />
          <Route path="/archives" element={<AdminRoute><Archives /></AdminRoute>} />
          <Route path="/manage" element={<AdminRoute><Manage /></AdminRoute>} />

          {/* ── Guard portal ── */}
          <Route path="/guard/login" element={<GuardLogin />} />
          <Route path="/guard/dashboard" element={<GuardRoute><GuardDashboard /></GuardRoute>} />


          {/* ── Registration Form ── */}
          <Route path="/fill-out" element={<UserForm />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
