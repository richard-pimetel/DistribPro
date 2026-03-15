import React, { useEffect, useState } from 'react';
import { Save, Building2, Globe, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { getConfig, updateConfig } from '../services/api';
import type { Config } from '../types';
import { FormField, Input, Select } from '../components/ui/FormField';

const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export function SettingsPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [form, setForm] = useState<Config>({ nomeEmpresa: '', cnpj: '', email: '', telefone: '', endereco: '', cidade: '', estado: 'SP', cep: '', website: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'empresa' | 'notificacoes' | 'seguranca'>('empresa');

  useEffect(() => {
    getConfig().then(res => {
      if (res.success && res.data) { setConfig(res.data); setForm(res.data); }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await updateConfig(form);
    if (res.success) { toast.success('Configurações salvas com sucesso!'); setConfig(res.data!); }
    else toast.error(res.error?.message);
    setSaving(false);
  };

  const tabStyle = (tab: string): React.CSSProperties => ({
    padding: '9px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
    fontSize: '13.5px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
    background: activeTab === tab ? '#0A84FF' : 'transparent',
    color: activeTab === tab ? '#fff' : '#4A5568',
    transition: 'all 0.2s',
  });

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
      <div style={{ width: '28px', height: '28px', border: '3px solid #DDE3EE', borderTopColor: '#0A84FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: '840px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>Configurações</h1>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>Gerencie as informações da empresa e preferências do sistema</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#F5F7FA', borderRadius: '10px', padding: '4px', display: 'inline-flex', gap: '2px', marginBottom: '24px' }}>
        {[
          { key: 'empresa', label: '🏢 Empresa' },
          { key: 'notificacoes', label: '🔔 Notificações' },
          { key: 'seguranca', label: '🔒 Segurança' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)} style={tabStyle(t.key)}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'empresa' && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #DDE3EE', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(10,132,255,0.1)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} color="#0A84FF" />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: 0 }}>Dados da Empresa</h3>
              <p style={{ fontSize: '12px', color: '#8896A5', margin: 0 }}>Informações cadastrais e de contato</p>
            </div>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField label="Nome da Empresa" fullWidth required>
                <Input value={form.nomeEmpresa} onChange={e => setForm(f => ({ ...f, nomeEmpresa: e.target.value }))} placeholder="Nome da empresa" />
              </FormField>
              <FormField label="CNPJ">
                <Input value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} placeholder="00.000.000/0001-00" />
              </FormField>
              <FormField label="E-mail Corporativo">
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="contato@empresa.com" />
              </FormField>
              <FormField label="Telefone">
                <Input value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} placeholder="(11) 3000-0000" />
              </FormField>
              <FormField label="Website">
                <Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="www.empresa.com.br" />
              </FormField>
              <FormField label="CEP">
                <Input value={form.cep} onChange={e => setForm(f => ({ ...f, cep: e.target.value }))} placeholder="00000-000" />
              </FormField>
              <FormField label="Endereço" fullWidth>
                <Input value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} placeholder="Av. Principal, 123 - Sala 1" />
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

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F5F7FA', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSave} disabled={saving} style={{
                display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 22px', borderRadius: '9px', border: 'none',
                background: saving ? '#8896A5' : 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff',
                fontSize: '13.5px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif",
                boxShadow: saving ? 'none' : '0 4px 14px rgba(10,132,255,0.3)',
              }}>
                <Save size={15} /> {saving ? 'Salvando…' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notificacoes' && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0D1B2A', margin: '0 0 20px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Preferências de Notificação</h3>
          {[
            { label: 'Novo pedido recebido', desc: 'Receba alertas quando um novo pedido for criado', checked: true },
            { label: 'Estoque crítico', desc: 'Aviso quando produto atingir estoque mínimo', checked: true },
            { label: 'Pedido entregue', desc: 'Confirmação ao finalizar uma entrega', checked: false },
            { label: 'Novo cliente cadastrado', desc: 'Notificação de novos cadastros', checked: false },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 3 ? '1px solid #F5F7FA' : 'none' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0D1B2A' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#8896A5', marginTop: '2px' }}>{item.desc}</div>
              </div>
              <div style={{ width: '40px', height: '22px', borderRadius: '99px', background: item.checked ? '#0A84FF' : '#DDE3EE', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: item.checked ? '20px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'seguranca' && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0D1B2A', margin: '0 0 20px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Segurança do Sistema</h3>
          {[
            { label: 'Autenticação em dois fatores', desc: 'Adicione uma camada extra de segurança ao login', status: 'Inativo', color: '#FF453A' },
            { label: 'Sessão ativa', desc: 'Tempo de inatividade antes do logout automático', status: '30 minutos', color: '#30D158' },
            { label: 'Log de acessos', desc: 'Registro de todas as ações do sistema', status: 'Ativo', color: '#30D158' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 2 ? '1px solid #F5F7FA' : 'none' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0D1B2A' }}>{item.label}</div>
                <div style={{ fontSize: '12px', color: '#8896A5', marginTop: '2px' }}>{item.desc}</div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: item.color, background: `${item.color}15`, padding: '4px 10px', borderRadius: '20px' }}>{item.status}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
