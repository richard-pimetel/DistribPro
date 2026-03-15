import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { authMe, authLogout as apiLogout } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const storedToken = localStorage.getItem('dp_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // Token exists — validate it against the real API
      setToken(storedToken);
      const res = await authMe();

      if (res.success && res.data) {
        setUser(res.data);
        localStorage.setItem('dp_user', JSON.stringify(res.data));
      } else {
        // Token is invalid/expired — clear everything
        localStorage.removeItem('dp_token');
        localStorage.removeItem('dp_user');
        setToken(null);
        setUser(null);
      }

      setIsLoading(false);
    };

    validateSession();
  }, []);

  const login = (tkn: string, usr: User) => {
    localStorage.setItem('dp_token', tkn);
    localStorage.setItem('dp_user', JSON.stringify(usr));
    setToken(tkn);
    setUser(usr);
  };

  const logout = async () => {
    // Call backend logout (best-effort, don't block on failure)
    await apiLogout();
    localStorage.removeItem('dp_token');
    localStorage.removeItem('dp_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (usr: User) => {
    localStorage.setItem('dp_user', JSON.stringify(usr));
    setUser(usr);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
