import React, { useState } from 'react';
import { Save, Eye, EyeOff, User, Lock, Shield, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { authUpdatePerfil, authUpdateSenha } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { FormField, Input } from '../components/ui/FormField';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'perfil' | 'senha'>('perfil');
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingPerfil, setSavingPerfil] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenhas, setShowSenhas] = useState({ nova: false, confirmar: false });
  const [savingSenha, setSavingSenha] = useState(false);

  const initials = nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  const handleSavePerfil = async () => {
    if (!nome || !email) { toast.error('Nome e e-mail são obrigatórios.'); return; }
    setSavingPerfil(true);
    const res = await authUpdatePerfil({ nome, email });
    if (res.success && res.data) { 
      updateUser(res.data); 
      toast.success('Perfil atualizado com sucesso!'); 
    }
    else toast.error(res.error?.message || 'Erro ao atualizar perfil.');
    setSavingPerfil(false);
  };

  const handleSaveSenha = async () => {
    if (!novaSenha) { toast.error('Preencha a nova senha.'); return; }
    if (novaSenha !== confirmarSenha) { toast.error('As senhas não coincidem.'); return; }
    if (novaSenha.length < 6) { toast.error('A nova senha deve ter ao menos 6 caracteres.'); return; }
    
    setSavingSenha(true);
    const res = await authUpdateSenha(novaSenha);
    if (res.success) {
      toast.success('Senha alterada com sucesso!');
      setNovaSenha(''); 
      setConfirmarSenha('');
    } else {
      toast.error(res.error?.message || 'Erro ao alterar senha.');
    }
    setSavingSenha(false);
  };

  const tabStyle = (tab: string): React.CSSProperties => ({
    padding: '9px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
    fontSize: '13.5px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
    background: activeTab === tab ? '#0A84FF' : 'transparent',
    color: activeTab === tab ? '#fff' : '#4A5568',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>Meu Perfil</h1>
        <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>Gerencie seus dados pessoais e segurança da conta</p>
      </div>

      {/* Profile card */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '22px', fontWeight: 800, flexShrink: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>{initials}</div>
          <button style={{
            position: 'absolute', bottom: '-4px', right: '-4px',
            width: '26px', height: '26px', borderRadius: '50%',
            background: '#0A84FF', border: '2px solid #fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Camera size={11} color="#fff" />
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#0D1B2A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{user?.nome}</div>
          <div style={{ fontSize: '13px', color: '#8896A5', marginTop: '2px' }}>{user?.email}</div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <span style={{ background: 'rgba(10,132,255,0.1)', color: '#0A84FF', fontSize: '11.5px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px' }}>
              {user?.role}
            </span>
            <span style={{ background: 'rgba(48,209,88,0.1)', color: '#20A040', fontSize: '11.5px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30D158' }} /> Conta Ativa
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#F5F7FA', borderRadius: '10px', padding: '4px', display: 'inline-flex', gap: '2px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('perfil')} style={tabStyle('perfil')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> Dados Pessoais</span>
        </button>
        <button onClick={() => setActiveTab('senha')} style={tabStyle('senha')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={14} /> Alterar Senha</span>
        </button>
      </div>

      {activeTab === 'perfil' && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #DDE3EE', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={16} color="#0A84FF" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0D1B2A' }}>Informações Pessoais</span>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <FormField label="Nome Completo" fullWidth required>
                <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome completo" />
              </FormField>
              <FormField label="E-mail" fullWidth required>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
              </FormField>
              <FormField label="Cargo / Função" fullWidth>
                <Input value={user?.role || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </FormField>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F5F7FA', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSavePerfil} disabled={savingPerfil} style={{
                display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 22px', borderRadius: '9px', border: 'none',
                background: savingPerfil ? '#8896A5' : 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff',
                fontSize: '13.5px', fontWeight: 600, cursor: savingPerfil ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif",
                boxShadow: savingPerfil ? 'none' : '0 4px 14px rgba(10,132,255,0.3)',
              }}>
                <Save size={15} /> {savingPerfil ? 'Salvando…' : 'Salvar Perfil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'senha' && (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #DDE3EE', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={16} color="#0A84FF" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0D1B2A' }}>Alterar Senha</span>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ background: 'rgba(10,132,255,0.06)', border: '1px solid rgba(10,132,255,0.15)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
              <p style={{ fontSize: '12.5px', color: '#0A84FF', margin: 0 }}>
                💡 Use uma senha com pelo menos 8 caracteres, incluindo letras, números e símbolos.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <FormField label="Nova Senha" required>
                <div style={{ position: 'relative' }}>
                  <Input
                    type={showSenhas.nova ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={e => setNovaSenha(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenhas(s => ({ ...s, nova: !s.nova }))}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8896A5', padding: '4px', display: 'flex', alignItems: 'center' }}
                  >
                    {showSenhas.nova ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>

              <FormField label="Confirmar Nova Senha" required>
                <div style={{ position: 'relative' }}>
                  <Input
                    type={showSenhas.confirmar ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a nova senha"
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenhas(s => ({ ...s, confirmar: !s.confirmar }))}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8896A5', padding: '4px', display: 'flex', alignItems: 'center' }}
                  >
                    {showSenhas.confirmar ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FormField>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F5F7FA', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSaveSenha} disabled={savingSenha} style={{
                display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 22px', borderRadius: '9px', border: 'none',
                background: savingSenha ? '#8896A5' : 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff',
                fontSize: '13.5px', fontWeight: 600, cursor: savingSenha ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif",
                boxShadow: savingSenha ? 'none' : '0 4px 14px rgba(10,132,255,0.3)',
              }}>
                <Lock size={15} /> {savingSenha ? 'Alterando…' : 'Alterar Senha'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
