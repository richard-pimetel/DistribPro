import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users, Wallet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ClientesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Cliente, ApiResponse } from '../types';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { FormField, Input, Select } from '../components/ui/FormField';

const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

interface ClienteForm {
  nome: string;
  email: string;
  tipo: 'PJ' | 'PF';
  doc: string;
  tel: string;
  cidade: string;
  estado: string;
  limite: number;
  status: 'Ativo' | 'Inativo';
}

const emptyForm: ClienteForm = { 
  nome: '', 
  email: '', 
  tipo: 'PJ',
  doc: '', 
  tel: '', 
  cidade: '', 
  estado: 'SP', 
  limite: 0,
  status: 'Ativo'
};

export function ClientsPage() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [form, setForm] = useState<ClienteForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState(false);
  const isOperador = user?.role === 'operador';
  const isAdmin = user?.role === 'admin';
  const canCreateOrDelete = isAdmin;
  const canEdit = isAdmin || isOperador;

  const load = async () => {
    setLoading(true);
    try {
      const res: ApiResponse<Cliente[]> = await ClientesAPI.list();
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
      tipo: c.tipo || 'PJ',
      doc: c.doc, 
      tel: c.tel, 
      cidade: c.cidade, 
      estado: c.estado, 
      limite: c.limite || 0,
      status: c.status as 'Ativo' | 'Inativo'
    }); 
    setShowModal(true); 
  };

  const handleSave = async () => {
    if (!form.nome || !form.email) { 
      toast.error('Nome e e-mail são obrigatórios.'); 
      return; 
    }
    setSaving(true);
    try {
      let res;
      if (editing) {
        res = await ClientesAPI.update(editing.id, form);
        if (res.success) { 
          toast.success('Cliente atualizado com sucesso!'); 
          load(); 
          setShowModal(false); 
        } else {
          toast.error(res.error?.message || 'Erro ao atualizar cliente.');
        }
      } else {
        res = await ClientesAPI.create(form);
        if (res.success) { 
          toast.success('Cliente criado com sucesso!'); 
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
      const res = await ClientesAPI.remove(deleteTarget.id);
      if (res.success) { 
        toast.success('Cliente removido com sucesso!'); 
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

  const totals = {
    total: clientes.length,
    ativos: clientes.filter(c => c.status === 'Ativo').length,
    limite: clientes.reduce((a, c) => a + (c.limite || 0), 0)
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>Gestão de Clientes</h1>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>{totals.total} registros encontrados · {totals.ativos} ativos</p>
        </div>
        {canCreateOrDelete && (
          <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 14px rgba(10,132,255,0.3)' }}>
            <Plus size={16} /> Novo Cliente
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }} className="client-stats">
        {[
          { label: 'Total de Clientes', value: totals.total, color: '#0A84FF' },
          { label: 'Clientes Ativos', value: totals.ativos, color: '#30D158' },
          { label: 'Crédito Consolidado', value: `R$ ${totals.limite.toLocaleString('pt-BR')}`, color: '#8B5CF6' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #DDE3EE', padding: '16px 20px', boxShadow: '0 2px 8px rgba(10,30,60,0.06)' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#8896A5', textTransform: 'uppercase', margin: '0 0 6px' }}>{s.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid #DDE3EE', borderRadius: '9px', padding: '8px 14px', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Search size={14} color="#8896A5" />
          <input placeholder="Buscar por nome, e-mail ou doc..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#0D1B2A', width: '100%', fontFamily: "'Inter', sans-serif" }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #DDE3EE', background: '#fff', fontSize: '13px', color: '#4A5568', cursor: 'pointer', outline: 'none' }}>
          <option value="">Filtro: Status (Todos)</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
        <span style={{ fontSize: '12px', color: '#8896A5', marginLeft: 'auto' }}>{filtered.length} resultados</span>
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#0A84FF' }}>
            <Loader2 size={32} className="spinner" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '12px', fontSize: '14px' }}>Carregando dados...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#4A5568', margin: '0 0 6px' }}>Nenhum cliente disponível</p>
            <p style={{ fontSize: '13px', color: '#8896A5' }}>Não encontramos registros para os critérios informados.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F7FA', textAlign: 'left' }}>
                  {['Nome', 'Tipo', 'Doc', 'Email', 'Telefone', 'Cidade', 'Status', canEdit && 'Ações'].filter(Boolean).map(h => (
                    <th key={h as string} style={{ padding: '12px 18px', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: '#8896A5', borderBottom: '1px solid #DDE3EE' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #F5F7FA' }}>
                    <td style={{ padding: '14px 18px', fontSize: '13.5px', fontWeight: 600, color: '#0D1B2A' }}>{c.nome}</td>
                    <td style={{ padding: '14px 18px' }}><Badge variant={c.tipo === 'PJ' ? 'info' : 'neutral'}>{c.tipo}</Badge></td>
                    <td style={{ padding: '14px 18px', fontSize: '13px', color: '#4A5568' }}>{c.doc}</td>
                    <td style={{ padding: '14px 18px', fontSize: '13px', color: '#0D1B2A' }}>{c.email}</td>
                    <td style={{ padding: '14px 18px', fontSize: '13px', color: '#4A5568' }}>{c.tel}</td>
                    <td style={{ padding: '14px 18px', fontSize: '13px', color: '#4A5568' }}>{c.cidade}</td>
                    <td style={{ padding: '14px 18px' }}><StatusBadge status={c.status.toLowerCase() as any} /></td>
                    {canEdit && (
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => openEdit(c)} title="Editar" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#0A84FF' }}><Edit2 size={15} /></button>
                          {canCreateOrDelete && (
                            <button onClick={() => setDeleteTarget(c)} title="Excluir" style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#FF453A' }}><Trash2 size={15} /></button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar Cliente' : 'Novo Cliente'}
        footer={
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowModal(false)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: 'transparent', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, color: '#4A5568' }}>Cancelar</button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Processando...' : (editing ? 'Salvar Alterações' : 'Cadastrar Cliente')}
            </button>
          </div>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Nome / Razão Social" fullWidth required>
            <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Distribuidora Central Ltda" />
          </FormField>
          <FormField label="Tipo de Cliente" required>
            <Select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as 'PF' | 'PJ' }))}>
              <option value="PJ">Pessoa Jurídica (PJ)</option>
              <option value="PF">Pessoa Física (PF)</option>
            </Select>
          </FormField>
          <FormField label="Documento (CPF/CNPJ)">
            <Input value={form.doc} onChange={e => setForm(f => ({ ...f, doc: e.target.value }))} placeholder="00.000.000/0001-00" />
          </FormField>
          <FormField label="E-mail" required>
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="contato@cliente.com" />
          </FormField>
          <FormField label="Telefone">
            <Input value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} placeholder="(11) 99999-9999" />
          </FormField>
          <FormField label="Cidade">
            <Input value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} placeholder="Cidade" />
          </FormField>
          <FormField label="Estado">
            <Select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
              {estados.map(e => <option key={e} value={e}>{e}</option>)}
            </Select>
          </FormField>
          <FormField label="Limite de Crédito">
            <Input type="number" value={form.limite} onChange={e => setForm(f => ({ ...f, limite: Number(e.target.value) }))} />
          </FormField>
          <FormField label="Status" fullWidth>
            <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </Select>
          </FormField>
        </div>
      </Modal>

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Confirmar Exclusão" message={`Deseja realmente excluir o cliente "${deleteTarget?.nome}"?`} confirmLabel="Sim, Excluir" />

      <style>{`.spinner { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } @media (max-width: 768px) { .client-stats { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
