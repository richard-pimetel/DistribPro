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
        // Preservar campos extras que o /auth/me pode não retornar (fallback do localStorage)
        const storedUser = JSON.parse(localStorage.getItem('dp_user') || 'null');
        const userWithExtras: User = {
          ...res.data,
          // Se o backend retornou fornecedor_id, use-o; senão use o do localStorage
          fornecedor_id: res.data.fornecedor_id ?? storedUser?.fornecedor_id ?? undefined,
          clienteId: res.data.clienteId ?? storedUser?.clienteId ?? undefined,
        };
        // Para admin, se o backend ainda não retorna fornecedor_id, usa o próprio id como fallback
        if (userWithExtras.role === 'admin' && !userWithExtras.fornecedor_id) {
          userWithExtras.fornecedor_id = userWithExtras.id;
        }
        setUser(userWithExtras);
        localStorage.setItem('dp_user', JSON.stringify(userWithExtras));
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
    
    // Para admin, se o backend não retornou fornecedor_id explícito, usa o próprio id como fallback
    const userWithExtras: User = {
      ...usr,
      fornecedor_id: usr.fornecedor_id ?? (usr.role === 'admin' ? usr.id : undefined),
    };

    localStorage.setItem('distribpro_token', tkn);
    localStorage.setItem('dp_user', JSON.stringify(userWithExtras));
    setToken(tkn);
    setUser(userWithExtras);
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
