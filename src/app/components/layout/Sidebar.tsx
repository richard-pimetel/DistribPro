import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, Package, Users, Truck, ShoppingCart,
  Settings, LogOut, BarChart3, Menu, X, ChevronRight, Boxes
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { toast } from 'sonner';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const mainNav: NavItem[] = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
];

/**
 * Registros section:
 * - Operador: Produtos + Clientes + Fornecedores
 * - Admin (Fornecedor): Produtos apenas
 */
const getRegistrosNav = (isOperador: boolean): NavItem[] => {
  const base: NavItem[] = [{ to: '/admin/produtos', icon: <Package size={18} />, label: 'Produtos' }];
  if (isOperador) {
    base.push({ to: '/admin/clientes', icon: <Users size={18} />, label: 'Clientes' });
    base.push({ to: '/admin/fornecedores', icon: <Truck size={18} />, label: 'Fornecedores' });
  }
  return base;
};

const getOperacoesNav = (): NavItem[] => [
  { to: '/admin/pedidos', icon: <ShoppingCart size={18} />, label: 'Pedidos' },
  { to: '/admin/estoque', icon: <Boxes size={18} />, label: 'Estoque' },
  { to: '/admin/relatorios', icon: <BarChart3 size={18} />, label: 'Relatórios' },
];

const sistemaAdminNav: NavItem[] = [
  { to: '/admin/configuracoes', icon: <Settings size={18} />, label: 'Configurações' },
];

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <div style={{ padding: '16px 12px 6px' }}>
      <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#8896A5', padding: '0 8px', marginBottom: '4px' }}>
        {label}
      </p>
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 10px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13.5px',
            fontWeight: isActive ? 600 : 500,
            color: isActive ? '#0A84FF' : '#4A5568',
            background: isActive ? 'rgba(10,132,255,0.08)' : 'transparent',
            textDecoration: 'none',
            marginBottom: '2px',
            transition: 'all 0.2s ease',
          })}
          className="nav-item-hover"
        >
          <span style={{ opacity: 0.9, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.badge && (
            <span style={{
              background: '#FF453A',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '20px',
              lineHeight: '1.4',
            }}>{item.badge}</span>
          )}
        </NavLink>
      ))}
    </div>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { isAdmin, isOperador, isAdminOrOperador } = usePermissions();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Sessão encerrada com sucesso.');
  };

  const initials = user?.nome?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'AM';

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 99, display: 'none',
          }}
          className="sidebar-overlay-mobile"
        />
      )}

      <aside style={{
        width: '260px',
        minHeight: '100vh',
        background: '#fff',
        borderRight: '1px solid #DDE3EE',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0, top: 0,
        zIndex: 100,
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 0 0 rgba(0,0,0,0)',
      }}>
        {/* Logo */}
        <div style={{
          padding: '22px 20px 18px',
          borderBottom: '1px solid #DDE3EE',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '38px', height: '38px',
            background: '#fff',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            border: '1px solid #DDE3EE',
          }}>
            <img src="/logo.png" alt="DistribPro Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.3px', color: '#0D1B2A' }}>
              Distrib<span style={{ color: '#0A84FF' }}>Pro</span>
            </div>
            <div style={{ fontSize: '10px', color: '#8896A5', fontWeight: 500, marginTop: '-2px' }}>Gestão Empresarial</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#8896A5', display: 'none' }} className="sidebar-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '8px' }}>
          <NavGroup label="Principal" items={[
            { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' }
          ]} />

          <NavGroup label="Registros" items={getRegistrosNav(isOperador)} />
          <NavGroup label="Operações" items={getOperacoesNav()} />
          {isOperador && (
            <NavGroup label="Sistema" items={sistemaAdminNav} />
          )}
        </div>

        {/* User footer */}
        <div style={{ borderTop: '1px solid #DDE3EE', padding: '14px 12px' }}>
          <NavLink
            to="/admin/perfil"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 10px', borderRadius: '8px', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
              className="user-card-hover"
            >
              <div style={{
                width: '34px', height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '12px', flexShrink: 0,
              }}>{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0D1B2A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.nome}</div>
                <div style={{ fontSize: '11px', color: '#8896A5' }}>{user?.role}</div>
              </div>
              <ChevronRight size={14} color="#8896A5" />
            </div>
          </NavLink>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '9px 10px', borderRadius: '8px',
              border: 'none', background: 'none', cursor: 'pointer',
              color: '#FF453A', fontSize: '13.5px', fontWeight: 500,
              marginTop: '2px', transition: 'background 0.2s',
            }}
            className="logout-hover"
          >
            <LogOut size={16} />
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>

      <style>{`
        .nav-item-hover:hover {
          background: #F0F3F8 !important;
          color: #0D1B2A !important;
        }
        .user-card-hover:hover { background: #F0F3F8; }
        .logout-hover:hover { background: rgba(255,69,58,0.08) !important; }
        @media (max-width: 960px) {
          aside { transform: translateX(${isOpen ? '0' : '-260px'}) !important; box-shadow: ${isOpen ? '0 16px 48px rgba(10,30,60,0.18)' : 'none'} !important; }
          .sidebar-overlay-mobile { display: ${isOpen ? 'block' : 'none'} !important; }
          .sidebar-close-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
