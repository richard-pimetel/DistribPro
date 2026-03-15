import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../context/AuthContext';

export function Layout() {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F5F7FA' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '42px', height: '42px',
            background: 'linear-gradient(135deg, #0A84FF, #3B9EFF)',
            borderRadius: '12px', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.5)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
          <p style={{ fontSize: '14px', color: '#8896A5', fontFamily: "'Inter', sans-serif" }}>Carregando…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F7FA', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin-left 0.25s ease' }} className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ flex: 1, padding: '28px 32px' }} className="page-content">
          <Outlet />
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '13.5px',
          }
        }}
        richColors
      />

      <style>{`
        @media (max-width: 960px) {
          .main-content { margin-left: 0 !important; }
          .page-content { padding: 20px 20px !important; }
        }
        @media (max-width: 640px) {
          .page-content { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}
