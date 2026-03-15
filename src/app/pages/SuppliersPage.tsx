import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Truck, Calendar, Mail, Phone, MapPin, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getFornecedores, createFornecedor, updateFornecedor, deleteFornecedor } from '../services/api';
import type { Fornecedor } from '../types';
import { StatusBadge, Badge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { FormField, Input, Select } from '../components/ui/FormField';

const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
const categorias = ['Eletrônicos', 'Periféricos', 'Áudio', 'Armazenamento', 'Acessórios', 'Componentes', 'Mobiliário', 'Outros'];

const emptyForm: Omit<Fornecedor, 'id' | 'criado_em' | 'atualizado_em'> = { 
  nome: '', 
  email: '', 
  tel: '', 
  cnpj: '', 
  cidade: '', 
  estado: 'SP', 
  categoria: 'Eletrônicos', 
  prazo: 15,
  status: 'Ativo', 
  contato: '' 
};

export function SuppliersPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Fornecedor | null>(null);
  const [form, setForm] = useState<Omit<Fornecedor, 'id' | 'criado_em' | 'atualizado_em'>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Fornecedor | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getFornecedores();
      if (res.success && res.data) {
        setFornecedores(res.data);
      } else {
        toast.error(res.error?.message || 'Erro ao carregar fornecedores.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = fornecedores.filter(f => {
    const s = search.toLowerCase();
    const matchSearch = !s || 
      f.nome.toLowerCase().includes(s) || 
      f.email.toLowerCase().includes(s) || 
      f.contato.toLowerCase().includes(s) ||
      f.cnpj.toLowerCase().includes(s);
    return matchSearch && (!catFilter || f.categoria === catFilter);
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  
  const openEdit = (f: Fornecedor) => { 
    setEditing(f); 
    setForm({ 
      nome: f.nome, 
      email: f.email, 
      tel: f.tel, 
      cnpj: f.cnpj, 
      cidade: f.cidade, 
      estado: f.estado, 
      categoria: f.categoria, 
      prazo: f.prazo || 0,
      status: f.status, 
      contato: f.contato 
    }); 
    setShowModal(true); 
  };

  const handleSave = async () => {
    if (!form.nome || !form.email) { 
      toast.error('Razão Social e E-mail são obrigatórios.'); 
      return; 
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await updateFornecedor(editing.id, form);
        if (res.success) { 
          toast.success('Fornecedor atualizado!'); 
          load(); 
          setShowModal(false); 
        } else {
          toast.error(res.error?.message || 'Erro ao atualizar fornecedor.');
        }
      } else {
        const res = await createFornecedor(form);
        if (res.success) { 
          toast.success('Fornecedor cadastrado!'); 
          load(); 
          setShowModal(false); 
        } else {
          toast.error(res.error?.message || 'Erro ao criar fornecedor.');
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
      const res = await deleteFornecedor(deleteTarget.id);
      if (res.success) { 
        toast.success('Fornecedor removido.'); 
        load(); 
        setDeleteTarget(null); 
      } else {
        toast.error(res.error?.message || 'Erro ao remover fornecedor.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setDeleting(false);
    }
  };

  const iconColors = ['#0A84FF', '#30D158', '#FF6B35', '#8B5CF6', '#FF453A'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>Fornecedores</h1>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>{fornecedores.length} fornecedores · {fornecedores.filter(f => f.status === 'Ativo').length} ativos</p>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 14px rgba(10,132,255,0.3)' }}>
          <Plus size={16} /> Novo Fornecedor
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid #DDE3EE', borderRadius: '9px', padding: '8px 14px', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
          <Search size={14} color="#8896A5" />
          <input placeholder="Buscar fornecedor…" value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#0D1B2A', width: '100%', fontFamily: "'Inter', sans-serif" }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #DDE3EE', background: '#fff', fontSize: '13px', color: '#4A5568', cursor: 'pointer', outline: 'none', fontFamily: "'Inter', sans-serif" }}>
          <option value="">Todas as categorias</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontSize: '12px', color: '#8896A5', marginLeft: 'auto' }}>{filtered.length} resultado(s)</span>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ width: '28px', height: '28px', border: '3px solid #DDE3EE', borderTopColor: '#0A84FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', padding: '60px', textAlign: 'center' }}>
          <Truck size={40} color="#DDE3EE" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#4A5568', margin: '0 0 6px' }}>Nenhum fornecedor encontrado</p>
          <p style={{ fontSize: '13px', color: '#8896A5' }}>Cadastre um novo fornecedor para começar.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {filtered.map((f, idx) => (
            <div key={f.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(10,30,60,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(10,30,60,0.07)'; }}
            >
              <div style={{ height: '4px', background: iconColors[idx % iconColors.length] }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${iconColors[idx % iconColors.length]}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Truck size={20} color={iconColors[idx % iconColors.length]} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0D1B2A' }}>{f.nome}</div>
                      <div style={{ fontSize: '11px', color: '#8896A5' }}>{f.cnpj}</div>
                    </div>
                  </div>
                  <StatusBadge status={f.status.toLowerCase() as any} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} color="#8896A5" />
                    <span style={{ fontSize: '12px', color: '#4A5568', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} color="#8896A5" />
                    <span style={{ fontSize: '12px', color: '#4A5568' }}>{f.tel}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color="#8896A5" />
                    <span style={{ fontSize: '12px', color: '#4A5568' }}>{f.cidade}/{f.estado}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserIcon size={14} color="#8896A5" />
                    <span style={{ fontSize: '12px', color: '#4A5568' }}>{f.contato}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F5F7FA' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge variant="info">{f.categoria}</Badge>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#8896A5' }}>
                      <Calendar size={12} />
                      <span>{f.prazo} dias</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openEdit(f)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A84FF' }}><Edit2 size={13} /></button>
                    <button onClick={() => setDeleteTarget(f)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF453A' }}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar Fornecedor' : 'Novo Fornecedor'}
        footer={
          <>
            <button onClick={() => setShowModal(false)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: 'transparent', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, color: '#4A5568', fontFamily: "'Inter', sans-serif" }}>Cancelar</button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif" }}>
              {saving ? 'Salvando…' : (editing ? 'Atualizar' : 'Cadastrar')}
            </button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Razão Social" fullWidth required>
            <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome da empresa" />
          </FormField>
          <FormField label="CNPJ" required>
            <Input value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} placeholder="00.000.000/0001-00" />
          </FormField>
          <FormField label="E-mail" required>
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@fornecedor.com" />
          </FormField>
          <FormField label="Telefone">
            <Input value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} placeholder="(11) 9999-9999" />
          </FormField>
          <FormField label="Nome do Contato">
            <Input value={form.contato} onChange={e => setForm(f => ({ ...f, contato: e.target.value }))} placeholder="Responsável comercial" />
          </FormField>
          <FormField label="Categoria">
            <Select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label="Pagamento (Prazo em dias)">
            <Input type="number" value={form.prazo} onChange={e => setForm(f => ({ ...f, prazo: Number(e.target.value) }))} min={0} />
          </FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </Select>
          </FormField>
          <FormField label="Cidade">
            <Input value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} placeholder="Cidade" />
          </FormField>
          <FormField label="Estado">
            <Select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
              {estados.map(e => <option key={e} value={e}>{e}</option>)}
            </Select>
          </FormField>
        </div>
      </Modal>

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Remover Fornecedor" message={`Tem certeza que deseja remover o fornecedor "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`} confirmLabel="Remover" />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
