import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle, Package, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { getProdutos, createProduto, updateProduto, deleteProduto, getFornecedores } from '../services/api';
import type { Produto, Fornecedor } from '../types';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { FormField, Input, Select } from '../components/ui/FormField';

const categorias = ['Eletrônicos', 'Periféricos', 'Áudio', 'Armazenamento', 'Acessórios', 'Componentes', 'Mobiliário'];
const unidades = ['Un', 'Kg', 'Lt', 'Cx', 'Mtr'];

const empty: Omit<Produto, 'id' | 'criado_em' | 'atualizado_em'> = { 
  nome: '', 
  sku: '', 
  categoria: 'Eletrônicos', 
  unidade: 'Un',
  preco: 0, 
  estoque: 0, 
  estoque_min: 5, 
  fornecedor_id: 1, 
  status: 'Ativo',
  descricao: ''
};

export function ProductsPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [form, setForm] = useState<Omit<Produto, 'id' | 'criado_em' | 'atualizado_em'>>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Produto | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, fRes] = await Promise.all([getProdutos(), getFornecedores()]);
      if (pRes.success && pRes.data) setProdutos(pRes.data);
      if (fRes.success && fRes.data) setFornecedores(fRes.data);
      
      if (!pRes.success) toast.error(pRes.error?.message || 'Erro ao carregar produtos.');
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = produtos.filter(p => {
    const s = search.toLowerCase();
    const matchSearch = !s || p.nome.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s);
    const matchCat = !catFilter || p.categoria === catFilter;
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const lowStock = produtos.filter(p => p.estoque <= p.estoque_min);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  
  const openEdit = (p: Produto) => { 
    setEditing(p); 
    setForm({ 
      nome: p.nome, 
      sku: p.sku, 
      categoria: p.categoria, 
      unidade: p.unidade || 'Un',
      preco: p.preco, 
      estoque: p.estoque, 
      estoque_min: p.estoque_min, 
      fornecedor_id: p.fornecedor_id || 1, 
      status: p.status,
      descricao: p.descricao || ''
    }); 
    setShowModal(true); 
  };

  const handleSave = async () => {
    if (!form.nome || !form.sku) { toast.error('Nome e SKU são obrigatórios.'); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await updateProduto(editing.id, form);
        if (res.success) { 
          toast.success('Produto atualizado!'); 
          load(); 
          setShowModal(false); 
        } else {
          toast.error(res.error?.message || 'Erro ao atualizar produto.');
        }
      } else {
        const res = await createProduto(form);
        if (res.success) { 
          toast.success('Produto criado!'); 
          load(); 
          setShowModal(false); 
        } else {
          toast.error(res.error?.message || 'Erro ao criar produto.');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao processar requisição.');
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await deleteProduto(deleteTarget.id);
      if (res.success) { 
        toast.success('Produto removido.'); 
        load(); 
        setDeleteTarget(null); 
      } else {
        toast.error(res.error?.message || 'Erro ao remover produto.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setDeleting(false);
    }
  };

  const fmtPrice = (n: number) => `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>Produtos</h1>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>{produtos.length} produtos cadastrados · {lowStock.length} com estoque baixo</p>
        </div>
        <button onClick={openCreate} style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '10px 18px', borderRadius: '9px', border: 'none',
          background: 'linear-gradient(135deg, #0A84FF, #0060CC)',
          color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
          fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 14px rgba(10,132,255,0.3)',
        }}>
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div style={{ background: 'rgba(255,214,10,0.08)', border: '1.5px solid rgba(255,214,10,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={16} color="#A07800" />
          <span style={{ fontSize: '13px', color: '#A07800', fontWeight: 500 }}>
            <strong>{lowStock.length} produto(s)</strong> com estoque abaixo do mínimo: {lowStock.slice(0, 3).map(p => p.nome).join(', ')}{lowStock.length > 3 ? ' e mais…' : ''}
          </span>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid #DDE3EE', borderRadius: '9px', padding: '8px 14px', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Search size={14} color="#8896A5" />
          <input placeholder="Buscar por nome, SKU…" value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#0D1B2A', width: '100%', fontFamily: "'Inter', sans-serif" }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #DDE3EE', background: '#fff', fontSize: '13px', color: '#4A5568', cursor: 'pointer', outline: 'none', fontFamily: "'Inter', sans-serif" }}>
          <option value="">Todas as categorias</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #DDE3EE', background: '#fff', fontSize: '13px', color: '#4A5568', cursor: 'pointer', outline: 'none', fontFamily: "'Inter', sans-serif" }}>
          <option value="">Todos os status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
        <span style={{ fontSize: '12px', color: '#8896A5', marginLeft: 'auto' }}>{filtered.length} resultado(s)</span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #DDE3EE', borderTopColor: '#0A84FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: '#8896A5', fontSize: '13px' }}>Carregando produtos…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Package size={40} color="#DDE3EE" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#4A5568', margin: '0 0 6px' }}>Nenhum produto encontrado</p>
            <p style={{ fontSize: '13px', color: '#8896A5' }}>Ajuste os filtros ou cadastre um novo produto.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F7FA' }}>
                  {['Produto', 'SKU', 'Categoria', 'Preço', 'Un.', 'Estoque', 'Status', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '11px 18px', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.9px', color: '#8896A5', textAlign: 'left', borderBottom: '1px solid #DDE3EE', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const isLow = p.estoque <= p.estoque_min;
                  return (
                    <tr key={p.id} style={{ transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(10,132,255,0.02)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', background: '#F5F7FA', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #DDE3EE', flexShrink: 0 }}>
                            <Package size={15} color="#8896A5" />
                          </div>
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0D1B2A' }}>{p.nome}</div>
                            <div style={{ fontSize: '11px', color: '#8896A5' }}>
                              {fornecedores.find(f => Number(f.id) === Number(p.fornecedor_id))?.nome || `ID Fornecedor: ${p.fornecedor_id}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '12.5px', color: '#4A5568', fontFamily: 'monospace' }}>{p.sku}</td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}><Badge variant="neutral">{p.categoria}</Badge></td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '13px', fontWeight: 600, color: '#0D1B2A' }}>{fmtPrice(p.preco)}</td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '13px', color: '#4A5568' }}>{p.unidade}</td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isLow ? '#FF453A' : '#30D158' }} />
                          <span style={{ fontSize: '13px', fontWeight: 600, color: isLow ? '#C0392B' : '#0D1B2A' }}>{p.estoque}</span>
                          {isLow && <AlertTriangle size={12} color="#A07800" />}
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}><StatusBadge status={p.status.toLowerCase() as any} /></td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openEdit(p)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A84FF', transition: 'all 0.15s' }}>
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => setDeleteTarget(p)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF453A', transition: 'all 0.15s' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Editar Produto' : 'Novo Produto'}
        footer={
          <>
            <button onClick={() => setShowModal(false)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: 'transparent', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, color: '#4A5568', fontFamily: "'Inter', sans-serif" }}>Cancelar</button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif" }}>
              {saving ? 'Saving…' : (editing ? 'Atualizar' : 'Criar Produto')}
            </button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Nome do Produto" fullWidth required>
            <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Monitor 24pol" />
          </FormField>
          <FormField label="SKU" required>
            <Input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="SKU-MON-24" />
          </FormField>
          <FormField label="Categoria">
            <Select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label="Unidade">
            <Select value={form.unidade} onChange={e => setForm(f => ({ ...f, unidade: e.target.value }))}>
              {unidades.map(u => <option key={u} value={u}>{u}</option>)}
            </Select>
          </FormField>
          <FormField label="Preço (R$)">
            <Input type="number" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: Number(e.target.value) }))} min={0} step={0.01} />
          </FormField>
          <FormField label="Fornecedor">
            <Select value={form.fornecedor_id} onChange={e => setForm(f => ({ ...f, fornecedor_id: Number(e.target.value) }))}>
              {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </Select>
          </FormField>
          <FormField label="Estoque Atual">
            <Input type="number" value={form.estoque} onChange={e => setForm(f => ({ ...f, estoque: Number(e.target.value) }))} min={0} />
          </FormField>
          <FormField label="Estoque Mínimo">
            <Input type="number" value={form.estoque_min} onChange={e => setForm(f => ({ ...f, estoque_min: Number(e.target.value) }))} min={0} />
          </FormField>
          <FormField label="Status" fullWidth>
            <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </Select>
          </FormField>
          <FormField label="Descrição" fullWidth>
            <Input value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Opcional…" />
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remover Produto"
        message={`Tem certeza que deseja remover o produto "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover Produto"
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
