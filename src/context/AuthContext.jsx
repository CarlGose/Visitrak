import React, { createContext, useContext, useState } from 'react';
import { ADMIN_USER, initialGuards } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('visitrak_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Admin login
  const login = (id, password, remember) => {
    if (id === ADMIN_USER.id && password === ADMIN_USER.password) {
      const userData = { name: ADMIN_USER.name, role: 'admin' };
      setUser(userData);
      if (remember) localStorage.setItem('visitrak_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  // Guard login
  const guardLogin = (guardId, password, gate) => {
    const guard = initialGuards.find(
      (g) => g.guardId === guardId && g.password === password
    );
    if (guard) {
      const userData = {
        name: guard.name,
        guardId: guard.guardId,
        role: 'guard',
        gate: gate || guard.gate,
      };
      setUser(userData);
      localStorage.setItem('visitrak_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('visitrak_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, guardLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
