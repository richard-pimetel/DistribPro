import React from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { Package, ShoppingCart, LayoutDashboard, ClipboardList, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { useCart } from '../../context/CartContext';

export function ClienteLayout() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { isCliente } = usePermissions();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F5F7FA' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #0A84FF, #3B9EFF)', borderRadius: '12px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.5)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
          <p style={{ fontSize: '14px', color: '#8896A5', fontFamily: "'Inter', sans-serif" }}>Carregando…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Admin/operador não acessa o portal do cliente
  if (!isCliente) return <Navigate to="/admin/dashboard" replace />;

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Sessão encerrada com sucesso.');
  };

  const initials = user?.nome?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'CL';

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: "'Inter', sans-serif" }}>
      {/* Topbar */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #DDE3EE',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 12px rgba(10,30,60,0.06)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: '64px', gap: '24px' }}>
          {/* Logo */}
          <NavLink to="/loja" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '36px', height: '36px',
              background: '#fff',
              borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              border: '1px solid #DDE3EE',
            }}>
              <img src="/logo.png" alt="DistribPro Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '17px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.3px', color: '#0D1B2A' }}>
              Distrib<span style={{ color: '#0A84FF' }}>Pro</span>
            </span>
          </NavLink>

          {/* Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
            {[
              { to: '/loja', icon: <LayoutDashboard size={15} />, label: 'Início', end: true },
              { to: '/loja/catalogo', icon: <Package size={15} />, label: 'Catálogo' },
              { to: '/loja/meus-pedidos', icon: <ClipboardList size={15} />, label: 'Meus Pedidos' },
            ].map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '8px',
                  fontSize: '13.5px', fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#0A84FF' : '#4A5568',
                  background: isActive ? 'rgba(10,132,255,0.08)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                })}
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {/* Cart */}
            <NavLink to="/loja/carrinho" style={{ position: 'relative', textDecoration: 'none' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid #DDE3EE', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} className="icon-btn">
                <ShoppingCart size={18} color="#4A5568" />
                {totalItems > 0 && (
                  <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#0A84FF', color: '#fff', fontSize: '10px', fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(10,132,255,0.5)' }}>
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
            </NavLink>

            {/* User */}
            <NavLink to="/loja/perfil" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '10px', transition: 'background 0.2s' }} className="user-nav">
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '11px' }}>
                {initials}
              </div>
              <div className="user-name-block">
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0D1B2A', whiteSpace: 'nowrap' }}>{user?.nome?.split(' ')[0]}</div>
                <div style={{ fontSize: '10px', color: '#8896A5' }}>Minha conta</div>
              </div>
            </NavLink>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Sair"
              style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF453A', transition: 'all 0.2s' }}
              className="icon-btn"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <Outlet />
      </main>

      <Toaster position="bottom-right" richColors toastOptions={{ style: { fontFamily: "'Inter', sans-serif", fontSize: '13.5px' } }} />

      <style>{`
        .icon-btn:hover { background: #F0F3F8 !important; border-color: #C0CBD8 !important; }
        .user-nav:hover { background: #F0F3F8; }
        @media (max-width: 640px) {
          .nav-label { display: none; }
          .user-name-block { display: none; }
          main { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}
