import React, { useState } from 'react';
import { Menu, Bell, Search, HelpCircle, Sun } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Visão geral do período' },
  '/produtos': { title: 'Produtos', subtitle: 'Gestão de catálogo e estoque' },
  '/clientes': { title: 'Clientes', subtitle: 'Base de clientes cadastrados' },
  '/fornecedores': { title: 'Fornecedores', subtitle: 'Parceiros e fornecedores' },
  '/pedidos': { title: 'Pedidos', subtitle: 'Gestão de pedidos e entregas' },
  '/estoque': { title: 'Estoque', subtitle: 'Controle de inventário' },
  '/relatorios': { title: 'Relatórios', subtitle: 'Análises e exportações' },
  '/configuracoes': { title: 'Configurações', subtitle: 'Dados da empresa e sistema' },
  '/perfil': { title: 'Meu Perfil', subtitle: 'Dados da conta e segurança' },
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pageInfo = pageTitles[location.pathname] || { title: 'DistribPro', subtitle: '' };
  const [search, setSearch] = useState('');

  return (
    <header style={{
      height: '68px',
      background: '#fff',
      borderBottom: '1px solid #DDE3EE',
      display: 'flex',
      alignItems: 'center',
      padding: '0 28px',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <button
        onClick={onMenuClick}
        style={{
          display: 'none',
          width: '36px', height: '36px',
          border: '1.5px solid #DDE3EE',
          borderRadius: '8px',
          background: '#fff',
          cursor: 'pointer',
          alignItems: 'center', justifyContent: 'center',
          color: '#4A5568',
          flexShrink: 0,
        }}
        className="hamburger-btn"
      >
        <Menu size={18} />
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0D1B2A', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>
          {pageInfo.title}
        </h1>
        {pageInfo.subtitle && (
          <p style={{ fontSize: '12px', color: '#8896A5', margin: 0, marginTop: '1px' }}>{pageInfo.subtitle}</p>
        )}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: '#F0F3F8', border: '1.5px solid #DDE3EE',
        borderRadius: '10px', padding: '8px 14px', width: '260px',
        transition: 'all 0.2s ease',
      }} className="header-search-wrap">
        <Search size={14} color="#8896A5" />
        <input
          type="text"
          placeholder="Buscar produto, cliente…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            border: 'none', background: 'transparent',
            fontSize: '13px', color: '#0D1B2A',
            width: '100%', outline: 'none',
            fontFamily: "'Inter', sans-serif",
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          style={{
            width: '36px', height: '36px',
            borderRadius: '8px', border: '1.5px solid #DDE3EE',
            background: '#fff', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
            transition: 'all 0.2s ease',
            color: '#4A5568',
          }}
          className="icon-action-btn"
          title="Notificações"
        >
          <Bell size={16} />
          <span style={{
            position: 'absolute', top: '7px', right: '7px',
            width: '6px', height: '6px',
            background: '#FF453A', borderRadius: '50%',
            border: '1.5px solid #fff',
          }} />
        </button>
        <button
          style={{
            width: '36px', height: '36px',
            borderRadius: '8px', border: '1.5px solid #DDE3EE',
            background: '#fff', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s ease', color: '#4A5568',
          }}
          className="icon-action-btn"
          title="Ajuda"
        >
          <HelpCircle size={16} />
        </button>
      </div>

      <style>{`
        .icon-action-btn:hover { background: #F0F3F8 !important; border-color: #0A84FF !important; }
        .header-search-wrap:focus-within { border-color: #0A84FF !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(10,132,255,0.1); }
        @media (max-width: 960px) {
          .hamburger-btn { display: flex !important; }
          .header-search-wrap { width: 180px !important; }
        }
        @media (max-width: 640px) {
          .header-search-wrap { display: none !important; }
        }
      `}</style>
    </header>
  );
}
