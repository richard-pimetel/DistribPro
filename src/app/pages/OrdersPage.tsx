import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, ShoppingCart, ChevronDown, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { getPedidos, updatePedidoStatus, deletePedido } from '../services/api';
import type { Pedido } from '../types';
import { StatusBadge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';

const statusOptions: { value: Pedido['status']; label: string }[] = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'em_transito', label: 'Em Trânsito' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' },
];

export function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewPedido, setViewPedido] = useState<Pedido | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pedido | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await getPedidos();
    if (res.success) setPedidos(res.data!);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = pedidos.filter(p => {
    const s = search.toLowerCase();
    const matchSearch = !s || p.numero.toLowerCase().includes(s) || p.clienteNome.toLowerCase().includes(s);
    return matchSearch && (!statusFilter || p.status === statusFilter);
  });

  const handleStatusChange = async (id: string, status: Pedido['status']) => {
    setUpdatingId(id);
    const res = await updatePedidoStatus(id, status);
    if (res.success) { toast.success('Status atualizado!'); load(); }
    else toast.error(res.error?.message);
    setUpdatingId(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deletePedido(deleteTarget.id);
    if (res.success) { toast.success('Pedido removido.'); load(); setDeleteTarget(null); }
    else toast.error(res.error?.message);
    setDeleting(false);
  };

  const fmtDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR');
  const fmtPrice = (n: number) => `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  // Summary counts
  const counts = statusOptions.reduce((acc, s) => {
    acc[s.value] = pedidos.filter(p => p.status === s.value).length;
    return acc;
  }, {} as Record<string, number>);

  const statusColors: Record<string, string> = {
    pendente: '#FFD60A', confirmado: '#0A84FF', em_transito: '#8B5CF6', entregue: '#30D158', cancelado: '#FF453A'
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>Pedidos</h1>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>{pedidos.length} pedidos no sistema</p>
        </div>
        <button onClick={() => toast.info('Funcionalidade de novo pedido em desenvolvimento.')} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 14px rgba(10,132,255,0.3)' }}>
          <Plus size={16} /> Novo Pedido
        </button>
      </div>

      {/* Status summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }} className="order-status-grid">
        {statusOptions.map(s => (
          <button key={s.value} onClick={() => setStatusFilter(statusFilter === s.value ? '' : s.value)}
            style={{
              background: statusFilter === s.value ? `${statusColors[s.value]}15` : '#fff',
              borderRadius: '12px', padding: '14px 16px',
              border: `1.5px solid ${statusFilter === s.value ? statusColors[s.value] : '#DDE3EE'}`,
              boxShadow: '0 2px 8px rgba(10,30,60,0.06)', cursor: 'pointer',
              textAlign: 'left', transition: 'all 0.2s',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[s.value], flexShrink: 0 }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#8896A5', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{s.label}</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: statusColors[s.value] }}>{counts[s.value]}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid #DDE3EE', borderRadius: '9px', padding: '8px 14px', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Search size={14} color="#8896A5" />
          <input placeholder="Buscar por número ou cliente…" value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#0D1B2A', width: '100%', fontFamily: "'Inter', sans-serif" }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #DDE3EE', background: '#fff', fontSize: '13px', color: '#4A5568', cursor: 'pointer', outline: 'none', fontFamily: "'Inter', sans-serif" }}>
          <option value="">Todos os status</option>
          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <span style={{ fontSize: '12px', color: '#8896A5', marginLeft: 'auto' }}>{filtered.length} pedido(s)</span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #DDE3EE', borderTopColor: '#0A84FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <ShoppingCart size={40} color="#DDE3EE" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#4A5568', margin: '0 0 6px' }}>Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F7FA' }}>
                  {['Pedido', 'Cliente', 'Data', 'Prazo', 'Total', 'Status', 'Alterar Status', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '11px 18px', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.9px', color: '#8896A5', textAlign: 'left', borderBottom: '1px solid #DDE3EE', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(10,132,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    style={{ transition: 'background 0.15s' }}
                  >
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0A84FF', fontFamily: 'monospace' }}>{p.numero}</span>
                    </td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0D1B2A' }}>{p.clienteNome}</div>
                      <div style={{ fontSize: '11px', color: '#8896A5' }}>{p.itens.length} item(ns)</div>
                    </td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '13px', color: '#4A5568' }}>{fmtDate(p.data)}</td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '13px', color: '#4A5568' }}>{fmtDate(p.prazoEntrega)}</td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '13px', fontWeight: 700, color: '#0D1B2A' }}>{fmtPrice(p.total)}</td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}><StatusBadge status={p.status} /></td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                      <select
                        value={p.status}
                        disabled={updatingId === p.id}
                        onChange={e => handleStatusChange(p.id, e.target.value as Pedido['status'])}
                        style={{ padding: '6px 10px', borderRadius: '7px', border: '1.5px solid #DDE3EE', background: '#F5F7FA', fontSize: '12.5px', color: '#4A5568', cursor: 'pointer', outline: 'none', fontFamily: "'Inter', sans-serif", opacity: updatingId === p.id ? 0.6 : 1 }}
                      >
                        {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setViewPedido(p)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A84FF' }}><Eye size={13} /></button>
                        <button onClick={() => setDeleteTarget(p)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF453A' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Pedido Modal */}
      {viewPedido && (
        <Modal open={!!viewPedido} onClose={() => setViewPedido(null)} title={`Pedido ${viewPedido.numero}`} maxWidth={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Cliente', value: viewPedido.clienteNome },
                { label: 'Status', value: <StatusBadge status={viewPedido.status} /> },
                { label: 'Data do Pedido', value: fmtDate(viewPedido.data) },
                { label: 'Prazo de Entrega', value: fmtDate(viewPedido.prazoEntrega) },
              ].map((item, i) => (
                <div key={i} style={{ background: '#F5F7FA', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#8896A5', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0D1B2A' }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#F5F7FA', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #DDE3EE' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Itens do Pedido</span>
              </div>
              {viewPedido.itens.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < viewPedido.itens.length - 1 ? '1px solid #DDE3EE' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0D1B2A' }}>{item.produtoNome}</div>
                    <div style={{ fontSize: '11px', color: '#8896A5' }}>Qtd: {item.quantidade}</div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0D1B2A' }}>{fmtPrice(item.quantidade * item.preco)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderTop: '2px solid #DDE3EE', background: '#fff' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0D1B2A' }}>Total</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0A84FF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{fmtPrice(viewPedido.total)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Remover Pedido" message={`Tem certeza que deseja remover o pedido "${deleteTarget?.numero}"?`} confirmLabel="Remover Pedido" />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) { .order-status-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 600px) { .order-status-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </div>
  );
}
