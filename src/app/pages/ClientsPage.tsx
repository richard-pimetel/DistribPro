import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users, Building2, User as UserIcon, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/api';
import type { Cliente } from '../types';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { FormField, Input, Select } from '../components/ui/FormField';

const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

const emptyForm: Omit<Cliente, 'id' | 'criado_em' | 'atualizado_em'> = { 
  nome: '', 
  email: '', 
  tel: '', 
  tipo: 'PJ',
  doc: '', 
  cidade: '', 
  estado: 'SP', 
  limite: 0,
  status: 'Ativo'
};

export function ClientsPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState<Omit<Cliente, 'id' | 'criado_em' | 'atualizado_em'>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getClientes();
      if (res.success && res.data) {
        setClientes(res.data);
      } else {
        toast.error(res.error?.message || 'Erro ao carregar clientes.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = clientes.filter(c => {
    const s = search.toLowerCase();
    const matchSearch = !s || 
      c.nome.toLowerCase().includes(s) || 
      c.email.toLowerCase().includes(s) || 
      c.doc.toLowerCase().includes(s);
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  
  const openEdit = (c: Cliente) => { 
    setEditing(c); 
    setForm({ 
      nome: c.nome, 
      email: c.email, 
      tel: c.tel, 
      tipo: c.tipo || 'PJ',
      doc: c.doc, 
      cidade: c.cidade, 
      estado: c.estado, 
      limite: c.limite || 0,
      status: c.status 
    }); 
    setShowModal(true); 
  };

  const handleSave = async () => {
    if (!form.nome || !form.email || !form.doc) { 
      toast.error('Nome, e-mail e documento são obrigatórios.'); 
      return; 
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await updateCliente(editing.id, form);
        if (res.success) { 
          toast.success('Cliente atualizado!'); 
          load(); 
          setShowModal(false); 
        } else {
          toast.error(res.error?.message || 'Erro ao atualizar cliente.');
        }
      } else {
        const res = await createCliente(form);
        if (res.success) { 
          toast.success('Cliente criado!'); 
          load(); 
          setShowModal(false); 
        } else {
          toast.error(res.error?.message || 'Erro ao criar cliente.');
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
      const res = await deleteCliente(deleteTarget.id);
      if (res.success) { 
        toast.success('Cliente removido.'); 
        load(); 
        setDeleteTarget(null); 
      } else {
        toast.error(res.error?.message || 'Erro ao remover cliente.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setDeleting(false);
    }
  };

  const initials = (nome: string) => nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const avatarColors = ['#0A84FF', '#30D158', '#FF6B35', '#8B5CF6', '#FF453A', '#FFD60A'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>Clientes</h1>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>{clientes.length} clientes cadastrados · {clientes.filter(c => c.status === 'Ativo').length} ativos</p>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 14px rgba(10,132,255,0.3)' }}>
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }} className="client-stats">
        {[
          { label: 'Total de Clientes', value: clientes.length, color: '#0A84FF', icon: <Users size={18} /> },
          { label: 'Clientes Ativos', value: clientes.filter(c => c.status === 'Ativo').length, color: '#30D158', icon: <Users size={18} /> },
          { label: 'Limite Total Liberado', value: `R$ ${clientes.reduce((a, c) => a + (c.limite || 0), 0).toLocaleString('pt-BR')}`, color: '#8B5CF6', icon: <Wallet size={18} /> },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #DDE3EE', padding: '16px 20px', boxShadow: '0 2px 8px rgba(10,30,60,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#8896A5', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 6px' }}>{s.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: s.color, margin: 0 }}>{s.value}</p>
            </div>
            <div style={{ background: `${s.color}10`, padding: '10px', borderRadius: '10px', color: s.color }}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid #DDE3EE', borderRadius: '9px', padding: '8px 14px', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Search size={14} color="#8896A5" />
          <input placeholder="Buscar por nome, e-mail, documento…" value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#0D1B2A', width: '100%', fontFamily: "'Inter', sans-serif" }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #DDE3EE', background: '#fff', fontSize: '13px', color: '#4A5568', cursor: 'pointer', outline: 'none', fontFamily: "'Inter', sans-serif" }}>
          <option value="">Todos os status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
        <span style={{ fontSize: '12px', color: '#8896A5', marginLeft: 'auto' }}>{filtered.length} resultado(s)</span>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #DDE3EE', borderTopColor: '#0A84FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Users size={40} color="#DDE3EE" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#4A5568', margin: '0 0 6px' }}>Nenhum cliente encontrado</p>
            <p style={{ fontSize: '13px', color: '#8896A5' }}>Ajuste os filtros ou cadastre um novo cliente.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F7FA' }}>
                  {['Cliente', 'Tipo', 'Documento', 'Contato', 'Localização', 'Limite', 'Status', 'Ações'].map(h => (
                    <th key={h} style={{ padding: '11px 18px', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.9px', color: '#8896A5', textAlign: h === 'Limite' ? 'right' : 'left', borderBottom: '1px solid #DDE3EE', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => (
                  <tr key={c.id}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(10,132,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    style={{ transition: 'background 0.15s' }}
                  >
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: avatarColors[idx % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                          {initials(c.nome)}
                        </div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0D1B2A' }}>{c.nome}</div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                      <Badge variant={c.tipo === 'PJ' ? 'primary' : 'neutral'}>{c.tipo || 'PJ'}</Badge>
                    </td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '12.5px', color: '#4A5568' }}>{c.doc}</td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                      <div style={{ fontSize: '13px', color: '#0D1B2A' }}>{c.email}</div>
                      <div style={{ fontSize: '11px', color: '#8896A5' }}>{c.tel}</div>
                    </td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '13px', color: '#4A5568' }}>{c.cidade}/{c.estado}</td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '13px', fontWeight: 600, color: '#0D1B2A', textAlign: 'right' }}>
                      R$ {(c.limite || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                      <StatusBadge status={c.status.toLowerCase() as any} />
                    </td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openEdit(c)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A84FF' }}><Edit2 size={13} /></button>
                        <button onClick={() => setDeleteTarget(c)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF453A' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar Cliente' : 'Novo Cliente'}
        footer={
          <>
            <button onClick={() => setShowModal(false)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: 'transparent', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, color: '#4A5568', fontFamily: "'Inter', sans-serif" }}>Cancelar</button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif" }}>
              {saving ? 'Salvando…' : (editing ? 'Atualizar' : 'Criar Cliente')}
            </button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Nome / Razão Social" fullWidth required>
            <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Mercado Atacadista Ltda" />
          </FormField>
          <FormField label="Tipo de Cliente" required>
            <Select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as 'PF' | 'PJ' }))}>
              <option value="PJ">Pessoa Jurídica (PJ)</option>
              <option value="PF">Pessoa Física (PF)</option>
            </Select>
          </FormField>
          <FormField label="Documento (Cpf/Cnpj)" required>
            <Input value={form.doc} onChange={e => setForm(f => ({ ...f, doc: e.target.value }))} placeholder="00.000.000/0001-00" />
          </FormField>
          <FormField label="E-mail" required>
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@empresa.com" />
          </FormField>
          <FormField label="Telefone">
            <Input value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} placeholder="(11) 99999-9999" />
          </FormField>
          <FormField label="Limite de Crédito (R$)">
            <Input type="number" value={form.limite} onChange={e => setForm(f => ({ ...f, limite: Number(e.target.value) }))} min={0} step={0.01} />
          </FormField>
          <FormField label="Cidade">
            <Input value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} placeholder="Cidade" />
          </FormField>
          <FormField label="Estado">
            <Select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
              {estados.map(e => <option key={e} value={e}>{e}</option>)}
            </Select>
          </FormField>
          <FormField label="Status" fullWidth>
            <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </Select>
          </FormField>
        </div>
      </Modal>

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Remover Cliente" message={`Tem certeza que deseja remover o cliente "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`} confirmLabel="Remover Cliente" />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media (max-width: 768px) { .client-stats { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
