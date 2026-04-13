import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext(null);

const SESSION_KEY = 'visitrak_session';
const ADMIN_LOCAL_KEY = 'visitrak_admin_session';
const GUARD_LOCAL_KEY = 'visitrak_guard_session';

function saveSession(userData, remember, role) {
  // Always save to the specific tab
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));

  // If remember me is clicked, save cross-tab persistent session
  if (remember) {
    if (role === 'admin') localStorage.setItem(ADMIN_LOCAL_KEY, JSON.stringify(userData));
    if (role === 'guard') localStorage.setItem(GUARD_LOCAL_KEY, JSON.stringify(userData));
  }
}

function clearSession() {
  // Clear the current tab's active session
  sessionStorage.removeItem(SESSION_KEY);

  // Also clear persistent sessions if they exist (so logout fully clears them)
  localStorage.removeItem(ADMIN_LOCAL_KEY);
  localStorage.removeItem(GUARD_LOCAL_KEY);
}

function loadSession() {
  // Priority 1: Current tab session ALWAYS wins (ensures tab isolation)
  const tabSession = sessionStorage.getItem(SESSION_KEY);
  if (tabSession) return JSON.parse(tabSession);

  // Priority 2: New tab opened. Check localStorage intelligent fallback
  const isGuardRoute = window.location.pathname.startsWith('/guard');

  if (isGuardRoute) {
    const savedGuard = localStorage.getItem(GUARD_LOCAL_KEY);
    if (savedGuard) {
      sessionStorage.setItem(SESSION_KEY, savedGuard); // Restore to this tab
      return JSON.parse(savedGuard);
    }
  } else {
    // Treat as admin/general pathway
    const savedAdmin = localStorage.getItem(ADMIN_LOCAL_KEY);
    if (savedAdmin) {
      sessionStorage.setItem(SESSION_KEY, savedAdmin); // Restore to this tab
      return JSON.parse(savedAdmin);
    }
  }

  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession());

  // Listen for logouts from other tabs
  useEffect(() => {
    const channel = new BroadcastChannel('visitrak_auth');

    channel.onmessage = (event) => {
      if (event.data.type === 'LOGOUT' && user && event.data.role === user.role) {
        clearSession();
        setUser(null);
      }
    };

    return () => channel.close();
  }, [user]);

  // Admin login
  const login = async (id, password, remember) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', id)
        .single();

      if (error || !data || data.password !== password) return false;

      const userData = { name: data.name, role: 'admin' };
      setUser(userData);
      saveSession(userData, remember, 'admin');
      return true;
    } catch (err) {
      console.error('Admin login error:', err);
      return false;
    }
  };

  // Guard login
  const guardLogin = async (guardId, password, remember) => {
    try {
      const { data, error } = await supabase
        .from('guards')
        .select('*')
        .eq('guard_id', guardId)
        .single();

      if (error || !data || data.password !== password) return false;

      const userData = {
        name: data.name,
        guardId: data.guard_id,
        role: 'guard',
        photo: data.photo || null,
      };
      setUser(userData);
      saveSession(userData, remember, 'guard');
      return true;
    } catch (err) {
      console.error('Guard login error:', err);
      return false;
    }
  };

  const logout = () => {
    const role = user?.role;
    clearSession();
    setUser(null);

    // Notify other tabs to log out if they share the same role
    const channel = new BroadcastChannel('visitrak_auth');
    channel.postMessage({ type: 'LOGOUT', role: role });
    channel.close();
  };

  // Dynamically restore session (useful when navigating via react-router without a full page load)
  const restoreSession = (role) => {
    if (role === 'guard') {
      const savedGuard = localStorage.getItem(GUARD_LOCAL_KEY);
      if (savedGuard) {
        sessionStorage.setItem(SESSION_KEY, savedGuard);
        setUser(JSON.parse(savedGuard));
      }
    } else if (role === 'admin') {
      const savedAdmin = localStorage.getItem(ADMIN_LOCAL_KEY);
      if (savedAdmin) {
        sessionStorage.setItem(SESSION_KEY, savedAdmin);
        setUser(JSON.parse(savedAdmin));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, guardLogin, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
