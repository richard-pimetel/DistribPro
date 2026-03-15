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
      const storedToken = localStorage.getItem('distribpro_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      setToken(storedToken);
      const res = await authMe();

      if (res.success && res.data) {
        let userWithId = res.data;
        // If it's a client but missing clienteId, try to find it
        if (userWithId.role === 'cliente' && !userWithId.clienteId) {
          try {
            const { getClientes } = await import('../services/api');
            const clRes = await getClientes();
            if (clRes.success && clRes.data) {
              const match = clRes.data.find(c => c.email === userWithId.email);
              if (match) {
                userWithId = { ...userWithId, clienteId: match.id };
              }
            }
          } catch (e) {
            console.error('Falha ao recuperar ID de cliente:', e);
          }
        }
        setUser(userWithId);
        localStorage.setItem('dp_user', JSON.stringify(userWithId));
      } else {
        localStorage.removeItem('distribpro_token');
        localStorage.removeItem('dp_user');
        setToken(null);
        setUser(null);
      }

      setIsLoading(false);
    };

    validateSession();
  }, []);

  const login = async (tkn: string, usr: User) => {
    localStorage.removeItem('distribpro_token');
    localStorage.removeItem('dp_user');
    
    let userWithId = usr;
    // If client but missing ID, try to find it now
    if (userWithId.role === 'cliente' && !userWithId.clienteId) {
      try {
        const { getClientes } = await import('../services/api');
        const clRes = await getClientes();
        if (clRes.success && clRes.data) {
          const match = clRes.data.find(c => c.email === userWithId.email);
          if (match) {
            userWithId = { ...userWithId, clienteId: match.id };
          }
        }
      } catch (e) {
        console.error('Falha ao recuperar ID de cliente no login:', e);
      }
    }

    localStorage.setItem('distribpro_token', tkn);
    localStorage.setItem('dp_user', JSON.stringify(userWithId));
    setToken(tkn);
    setUser(userWithId);
  };

  const logout = async () => {
    // Call backend logout (best-effort, don't block on failure)
    await apiLogout();
    localStorage.removeItem('distribpro_token');
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
