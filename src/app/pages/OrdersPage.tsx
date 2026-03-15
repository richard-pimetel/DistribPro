import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, ShoppingCart, ChevronDown, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPedidos, patchPedidoStatus, deletePedido, getProdutos, createPedido } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Pedido, Produto } from '../types';
import { StatusBadge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { FormField, Input, Select } from '../components/ui/FormField';

const statusOptions: { value: Pedido['status']; label: string }[] = [
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Confirmado', label: 'Confirmado' },
  { value: 'Em Rota', label: 'Em Rota' },
  { value: 'Entregue', label: 'Entregue' },
  { value: 'Cancelado', label: 'Cancelado' },
];

export function OrdersPage() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewPedido, setViewPedido] = useState<Pedido | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Pedido | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | string | null>(null);
  const [saving, setSaving] = useState(false);

  // New Pedido Form
  const [form, setForm] = useState({
    produto_id: '',
    qtd: 1,
    destino: '',
    data_entrega: '',
    obs: ''
  });

  const isCliente = user?.role === 'cliente';

  const load = async () => {
    setLoading(true);
    try {
      const [resPed, resProd] = await Promise.all([
        getPedidos(),
        getProdutos()
      ]);
      
      if (resPed.success) {
        // If client, we should only see our own orders. 
        // Note: Ideally the backend filters this, but we'll safeguard here.
        const allPedidos = resPed.data || [];
        if (isCliente) {
          const targetId = user?.clienteId || user?.id;
          setPedidos(allPedidos.filter(p => {
            const cid = p.cliente_id || (p as any).clienteId;
            return String(cid) === String(targetId);
          }));
        } else {
          setPedidos(allPedidos);
        }
      }
      if (resProd.success) setProdutos(resProd.data || []);
    } catch (err) {
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
    
    // Auto-refresh every 30 seconds to keep data synchronized
    const interval = setInterval(() => {
      load();
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  const filtered = pedidos.filter(p => {
    const s = search.toLowerCase();
    const matchSearch = !s || 
      String(p.id).toLowerCase().includes(s) || 
      (p.cliente_nome || '').toLowerCase().includes(s) || 
      (p.produto_nome || '').toLowerCase().includes(s);
    return matchSearch && (!statusFilter || p.status === statusFilter);
  });

  const handleStatusChange = async (id: number | string, status: Pedido['status']) => {
    setUpdatingId(id);
    const res = await patchPedidoStatus(id, status);
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

  const handleCreatePedido = async () => {
    if (!form.produto_id || !form.qtd || !form.destino || !form.data_entrega) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }
    setSaving(true);
    try {
      const selectedProd = produtos.find(p => String(p.id) === String(form.produto_id));
      
      if (selectedProd?.status === 'Inativo') {
        toast.error('Este produto/serviço está temporariamente indisponível.');
        return;
      }

      const targetClientId = user?.clienteId || user?.id;
      const payload = {
        // Primary camelCase format
        clienteId: Number(targetClientId),
        // Secondary snake_case format
        cliente_id: Number(targetClientId),
        
        destino: form.destino || 'Não informado',
        data_entrega: form.data_entrega,
        obs: form.obs || '',
        
        itens: [
          {
            produtoId: Number(form.produto_id),
            produto_id: Number(form.produto_id),
            quantidade: Number(form.qtd),
            qtd: Number(form.qtd),
            valorUnitario: selectedProd?.preco || 0,
            preco: selectedProd?.preco || 0,
            nome_produto: selectedProd?.nome || ''
          }
        ],
        valorTotal: (selectedProd?.preco || 0) * form.qtd,
        valor_total: (selectedProd?.preco || 0) * form.qtd,
        status: 'Pendente'
      };

      const res = await createPedido(payload);
      if (res.success) {
        toast.success('Serviço solicitado com sucesso!');
        setShowCreateModal(false);
        setForm({ produto_id: '', qtd: 1, destino: '', data_entrega: '', obs: '' });
        load();
      } else {
        toast.error(res.error?.message || 'Erro ao criar pedido.');
      }
    } finally {
      setSaving(false);
    }
  };

  const fmtDate = (d: string) => {
    if (!d) return '-';
    try {
      const datePart = d.split(' ')[0];
      return new Date(datePart + 'T12:00:00').toLocaleDateString('pt-BR');
    } catch { return d; }
  };
  const fmtPrice = (n: number) => `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const statusColors: Record<string, string> = {
    Pendente: '#FFD60A', Confirmado: '#0A84FF', 'Em Rota': '#8B5CF6', Entregue: '#30D158', Cancelado: '#FF453A'
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>
            {isCliente ? 'Meus Pedidos' : 'Gestão de Pedidos'}
          </h1>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>
            {isCliente ? 'Acompanhe suas solicitações em tempo real' : `${pedidos.length} pedidos no sistema`}
          </p>
        </div>
        {user?.role !== 'operador' && (
          <button onClick={() => setShowCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 14px rgba(10,132,255,0.3)' }}>
            <Plus size={16} /> {isCliente ? 'Solicitar Serviço' : 'Novo Pedido'}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid #DDE3EE', borderRadius: '9px', padding: '8px 14px', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Search size={14} color="#8896A5" />
          <input placeholder="Buscar por número ou produto…" value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#0D1B2A', width: '100%', fontFamily: "'Inter', sans-serif" }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #DDE3EE', background: '#fff', fontSize: '13px', color: '#4A5568', cursor: 'pointer', outline: 'none' }}>
          <option value="">Todos os status</option>
          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <span style={{ fontSize: '12px', color: '#8896A5', marginLeft: 'auto' }}>{filtered.length} registro(s)</span>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#0A84FF' }}>
            <Loader2 size={32} className="spinner" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '12px', fontSize: '14px' }}>Carregando dados...</p>
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
                  {['Pedido', !isCliente && 'Cliente', 'Produto', 'Previsão', 'Total', 'Status', !isCliente && 'Ação', 'Exibir'].filter(Boolean).map(h => (
                    <th key={h as string} style={{ padding: '12px 18px', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: '#8896A5', textAlign: 'left', borderBottom: '1px solid #DDE3EE' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F5F7FA' }}>
                    <td style={{ padding: '14px 18px', fontSize: '13px', fontWeight: 700, color: '#0A84FF', fontFamily: 'monospace' }}>#{p.id}</td>
                    {!isCliente && <td style={{ padding: '14px 18px', fontSize: '13px', fontWeight: 600, color: '#0D1B2A' }}>{p.cliente_nome}</td>}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0D1B2A' }}>{p.produto_nome}</div>
                      <div style={{ fontSize: '11px', color: '#8896A5' }}>Quantidade: {p.qtd}</div>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '13px', color: '#4A5568' }}>{fmtDate(p.data_entrega)}</td>
                    <td style={{ padding: '14px 18px', fontSize: '13px', fontWeight: 700, color: '#0D1B2A' }}>{fmtPrice(p.valor)}</td>
                    <td style={{ padding: '14px 18px' }}><StatusBadge status={p.status.toLowerCase()} /></td>
                    {!isCliente && (
                      <td style={{ padding: '14px 18px' }}>
                        <select value={p.status} onChange={e => handleStatusChange(p.id, e.target.value as any)} style={{ padding: '6px 8px', borderRadius: '6px', border: '1.5px solid #DDE3EE', fontSize: '12px', outline: 'none' }}>
                          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </td>
                    )}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setViewPedido(p)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#0A84FF' }}><Eye size={16} /></button>
                        {!isCliente && <button onClick={() => setDeleteTarget(p)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#FF453A' }}><Trash2 size={16} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title={isCliente ? 'Nova Solicitação de Serviço' : 'Novo Pedido'}
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowCreateModal(false)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: 'transparent', cursor: 'pointer', fontSize: '13.5px', color: '#4A5568' }}>Cancelar</button>
            <button onClick={handleCreatePedido} disabled={saving} style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Processando...' : 'Confirmar Solicitação'}
            </button>
          </div>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Produto / Serviço" fullWidth required>
            <Select value={form.produto_id} onChange={e => setForm(f => ({ ...f, produto_id: e.target.value }))}>
              <option value="">Selecione um item...</option>
              {produtos
                .filter(p => !isCliente || p.status === 'Ativo')
                .map(p => <option key={p.id} value={p.id}>{p.nome} - {fmtPrice(p.preco)}</option>)
              }
            </Select>
          </FormField>
          <FormField label="Quantidade" required>
            <Input type="number" min={1} value={form.qtd} onChange={e => setForm(f => ({ ...f, qtd: Number(e.target.value) }))} />
          </FormField>
          <FormField label="Data Desejada" required>
            <Input type="date" value={form.data_entrega} onChange={e => setForm(f => ({ ...f, data_entrega: e.target.value }))} />
          </FormField>
          <FormField label="Local de Entrega / Destino" fullWidth required>
            <Input value={form.destino} onChange={e => setForm(f => ({ ...f, destino: e.target.value }))} placeholder="Endereço completo" />
          </FormField>
          <FormField label="Observações Adicionais" fullWidth>
            <textarea value={form.obs} onChange={e => setForm(f => ({ ...f, obs: e.target.value }))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #DDE3EE', minHeight: '80px', outline: 'none' }} placeholder="Detalhes extras sobre sua solicitação..." />
          </FormField>
        </div>
      </Modal>

      {viewPedido && (
        <Modal open={!!viewPedido} onClose={() => setViewPedido(null)} title={`Pedido #${viewPedido.id}`}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: '#F5F7FA', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#8896A5' }}>CLIENTE</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{viewPedido.cliente_nome}</div>
            </div>
            <div style={{ background: '#F5F7FA', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#8896A5' }}>STATUS</div>
              <StatusBadge status={viewPedido.status.toLowerCase()} />
            </div>
            <div style={{ background: '#F5F7FA', padding: '12px', borderRadius: '8px', gridColumn: 'span 2' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#8896A5' }}>PRODUTO</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{viewPedido.produto_nome} (x{viewPedido.qtd})</div>
            </div>
            <div style={{ background: '#F5F7FA', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#8896A5' }}>VALOR TOTAL</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0A84FF' }}>{fmtPrice(viewPedido.valor)}</div>
            </div>
            <div style={{ background: '#F5F7FA', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#8896A5' }}>DATAL ENTREGA</div>
              <div style={{ fontSize: '14px' }}>{fmtDate(viewPedido.data_entrega)}</div>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Excluir Pedido" message={`Deseja remover o pedido #${deleteTarget?.id}?`} confirmLabel="Excluir" />

      <style>{`.spinner { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
