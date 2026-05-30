import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ShoppingCart, Search, Package, Clock, Truck, CheckCircle, XCircle, ArrowLeft, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { getPedidos } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Pedido } from '../../types';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

const statusIcon: Record<string, React.ReactNode> = {
  Pendente: <Clock size={14} />,
  Confirmado: <CheckCircle size={14} />,
  'Em Rota': <Truck size={14} />,
  Entregue: <CheckCircle size={14} />,
  Cancelado: <XCircle size={14} />,
};

const statusColors: Record<string, string> = {
  Pendente: '#F59E0B',
  Confirmado: '#0A84FF',
  'Em Rota': '#8B5CF6',
  Entregue: '#30D158',
  Cancelado: '#FF453A',
};

export function MeusPedidosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewPedido, setViewPedido] = useState<Pedido | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getPedidos();
      if (res.success && res.data) {
        const targetId = user?.clienteId || user?.id;
        const mine = res.data.filter((p: any) => {
          const cid = p.cliente_id || p.clienteId;
          return String(cid) === String(targetId);
        });
        setPedidos(mine);
      }
    } catch {
      toast.error('Erro ao carregar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const filtered = pedidos.filter(p => {
    const s = search.toLowerCase();
    const matchSearch = !s || String(p.id).includes(s) || (p.produto_nome || '').toLowerCase().includes(s);
    return matchSearch && (!statusFilter || p.status === statusFilter);
  });

  const fmt = (n: number) => `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  const fmtDate = (d: string) => {
    if (!d) return '-';
    try { return new Date(d.split(' ')[0] + 'T12:00:00').toLocaleDateString('pt-BR'); } catch { return d; }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        <button onClick={() => navigate('/loja')} style={{ width: '36px', height: '36px', borderRadius: '9px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568' }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: 0 }}>
            Meus Pedidos
          </h1>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>
            {pedidos.length} solicitação(ões) no total
          </p>
        </div>
        <button
          onClick={() => navigate('/loja/catalogo')}
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(10,132,255,0.3)', flexShrink: 0 }}
        >
          <ShoppingCart size={15} />
          Nova Compra
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid #DDE3EE', borderRadius: '10px', padding: '9px 14px', flex: 1, minWidth: '200px', maxWidth: '340px' }}>
          <Search size={14} color="#8896A5" />
          <input
            placeholder="Buscar por nº do pedido ou produto…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#0D1B2A', width: '100%', fontFamily: "'Inter', sans-serif" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #DDE3EE', background: '#fff', fontSize: '13px', color: '#4A5568', cursor: 'pointer', outline: 'none' }}
        >
          <option value="">Todos os status</option>
          <option value="Pendente">Pendente</option>
          <option value="Confirmado">Confirmado</option>
          <option value="Em Rota">Em Rota</option>
          <option value="Entregue">Entregue</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ width: '28px', height: '28px', border: '3px solid #DDE3EE', borderTopColor: '#0A84FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#8896A5', fontSize: '13px', margin: 0 }}>Carregando pedidos…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <ShoppingCart size={56} color="#DDE3EE" style={{ display: 'block', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#4A5568', margin: '0 0 8px' }}>
            {pedidos.length === 0 ? 'Você ainda não tem pedidos' : 'Nenhum pedido encontrado'}
          </p>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: '0 0 24px' }}>
            {pedidos.length === 0 ? 'Explore o catálogo e faça seu primeiro pedido!' : 'Tente ajustar os filtros.'}
          </p>
          {pedidos.length === 0 && (
            <button onClick={() => navigate('/loja/catalogo')} style={{ padding: '11px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(10,132,255,0.3)' }}>
              Ir ao Catálogo
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(p => {
            const color = statusColors[p.status] || '#8896A5';
            const icon = statusIcon[p.status];
            return (
              <div key={p.id} style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #DDE3EE',
                boxShadow: '0 2px 10px rgba(10,30,60,0.05)',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'box-shadow 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(10,30,60,0.1)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(10,30,60,0.05)'}
              >
                {/* Status indicator */}
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
                  <Package size={20} />
                </div>

                {/* Main info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0D1B2A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {p.produto_nome}
                    </span>
                    <span style={{ fontSize: '11px', color: '#8896A5', fontFamily: 'monospace', background: '#F5F7FA', padding: '2px 6px', borderRadius: '4px' }}>
                      #{p.id}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: '#8896A5' }}>Quantidade: {p.qtd}</span>
                    <span style={{ fontSize: '12px', color: '#8896A5' }}>Entrega: {fmtDate(p.data_entrega)}</span>
                  </div>
                </div>

                {/* Status + valor */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <StatusBadge status={p.status.toLowerCase()} />
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0A84FF', marginTop: '6px' }}>
                    {fmt(p.valor)}
                  </div>
                </div>

                {/* View btn */}
                <button
                  onClick={() => setViewPedido(p)}
                  style={{ width: '36px', height: '36px', borderRadius: '9px', border: '1.5px solid #DDE3EE', background: '#F5F7FA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A84FF', flexShrink: 0 }}
                >
                  <Eye size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {viewPedido && (
        <Modal open={!!viewPedido} onClose={() => setViewPedido(null)} title={`Pedido #${viewPedido.id}`}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'PRODUTO', value: `${viewPedido.produto_nome} (x${viewPedido.qtd})`, span: 2 },
              { label: 'STATUS', value: <StatusBadge status={viewPedido.status.toLowerCase()} /> },
              { label: 'VALOR TOTAL', value: <span style={{ fontSize: '16px', fontWeight: 800, color: '#0A84FF' }}>{fmt(viewPedido.valor)}</span> },
              { label: 'DATA DE ENTREGA', value: fmtDate(viewPedido.data_entrega) },
              { label: 'DESTINO', value: viewPedido.destino || '-', span: 2 },
              ...(viewPedido.obs ? [{ label: 'OBSERVAÇÕES', value: viewPedido.obs, span: 2 }] : []),
            ].map((row: any, i) => (
              <div key={i} style={{ background: '#F5F7FA', padding: '14px 16px', borderRadius: '10px', gridColumn: row.span === 2 ? 'span 2' : undefined }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#8896A5', marginBottom: '6px', letterSpacing: '0.8px' }}>{row.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0D1B2A' }}>{row.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => { setViewPedido(null); navigate('/loja/catalogo'); }}
              style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(10,132,255,0.3)' }}
            >
              Comprar Novamente
            </button>
          </div>
        </Modal>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
