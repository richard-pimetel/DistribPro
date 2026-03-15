import React, { useEffect, useState } from 'react';
import { 
  Save, Building2, User as UserIcon, Lock, 
  Mail, Phone, MapPin, FileText, Eye, EyeOff, Loader2,
  Clock, ShieldCheck, UserCog
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfigAPI, PerfilAPI } from '../services/api';
import type { Config, User } from '../types';
import { FormField, Input } from '../components/ui/FormField';
import { useAuth } from '../context/AuthContext';

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  
  // Tabs: 'empresa' | 'perfil' | 'seguranca'
  const [activeTab, setActiveTab] = useState<'empresa' | 'perfil' | 'seguranca'>('empresa');

  // --- SEÇÃO 1: EMPRESA ---
  const [empresaLoading, setEmpresaLoading] = useState(true);
  const [empresaSaving, setEmpresaSaving] = useState(false);
  const [empresaOriginal, setEmpresaOriginal] = useState<Config>({ razao_social: '', cnpj: '', email: '', tel: '', endereco: '' });
  const [empresaForm, setEmpresaForm] = useState<Config>({ razao_social: '', cnpj: '', email: '', tel: '', endereco: '' });

  const loadEmpresa = async () => {
    setEmpresaLoading(true);
    try {
      const res = await ConfigAPI.get();
      if (res.success && res.data) {
        setEmpresaOriginal(res.data);
        setEmpresaForm(res.data);
      }
    } catch (err: any) {
      toast.error('Erro ao carregar dados da empresa.');
    } finally {
      setEmpresaLoading(false);
    }
  };

  const handleSaveEmpresa = async () => {
    // Normalização agressiva para evitar erro 500 no Back-end (DB_ERROR: encoding UTF8)
    // Se o back ainda não "limpou" o Use-After-Free, essa função garante o envio.
    const sanitize = (str: string) => 
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    setEmpresaSaving(true);
    try {
      const payload = {
        razaoSocial: sanitize(empresaForm.razao_social),
        cnpj: empresaForm.cnpj,
        email: empresaForm.email,
        tel: empresaForm.tel,
        endereco: sanitize(empresaForm.endereco)
      };
      
      const res = await ConfigAPI.update(payload as any);
      if (res.success) {
        toast.success('Dados da empresa atualizados!');
        if (res.data) {
          setEmpresaOriginal(res.data);
          setEmpresaForm(res.data);
        }
      } else {
        toast.error(res.error?.message || 'Erro ao salvar empresa.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Falha na conexão.');
    } finally {
      setEmpresaSaving(false);
    }
  };

  const handleCancelEmpresa = () => {
    setEmpresaForm(empresaOriginal);
    toast.info('Alterações descartadas.');
  };

  // --- SEÇÃO 2: PERFIL DO USUÁRIO ---
  const [perfilLoading, setPerfilLoading] = useState(true);
  const [perfilSaving, setPerfilSaving] = useState(false);
  const [perfilData, setPerfilData] = useState<User | null>(null);
  const [perfilForm, setPerfilForm] = useState({ nome: '', email: '' });

  const loadPerfil = async () => {
    setPerfilLoading(true);
    try {
      const res = await PerfilAPI.me();
      if (res.success && res.data) {
        setPerfilData(res.data);
        setPerfilForm({ nome: res.data.nome, email: res.data.email });
      }
    } catch (err: any) {
      toast.error('Erro ao carregar perfil.');
    } finally {
      setPerfilLoading(false);
    }
  };

  const handleUpdatePerfil = async () => {
    setPerfilSaving(true);
    try {
      const res = await PerfilAPI.updatePerfil(perfilForm as any);
      if (res.success && res.data) {
        toast.success('Perfil atualizado com sucesso!');
        setPerfilData(res.data);
        updateUser(res.data); // Sincroniza com a sidebar
      } else {
        toast.error(res.error?.message || 'Erro ao atualizar perfil.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setPerfilSaving(false);
    }
  };

  // --- SEÇÃO 3: SEGURANÇA (SENHA) ---
  const [senhaSaving, setSenhaSaving] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [senhaForm, setSenhaForm] = useState({ nova_senha: '', confirmar_senha: '' });

  const handleUpdateSenha = async () => {
    if (senhaForm.nova_senha !== senhaForm.confirmar_senha) {
      return toast.error('As senhas não coincidem.');
    }
    if (senhaForm.nova_senha.length < 6) {
      return toast.error('A senha deve ter no mínimo 6 caracteres.');
    }

    setSenhaSaving(true);
    try {
      const res = await PerfilAPI.updateSenha(senhaForm.nova_senha);
      if (res.success) {
        toast.success('Senha atualizada com sucesso!');
        setSenhaForm({ nova_senha: '', confirmar_senha: '' });
      } else {
        toast.error(res.error?.message || 'Erro ao alterar senha.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setSenhaSaving(false);
    }
  };

  // Initial loads
  useEffect(() => {
    loadEmpresa();
    loadPerfil();
  }, []);

  const sectionStyle: React.CSSProperties = {
    background: '#fff', 
    borderRadius: '16px', 
    border: '1.5px solid #DDE3EE', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    overflow: 'hidden',
    animation: 'fadeIn 0.4s ease-out'
  };

  const headerStyle: React.CSSProperties = {
    padding: '24px 28px',
    borderBottom: '1px solid #F5F7FA',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#FCFDFF'
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 8px' }}>
          Configurações
        </h1>
        <p style={{ fontSize: '15px', color: '#8896A5', margin: 0 }}>
          Central de controle de conta e informações empresariais
        </p>
      </header>

      {/* Tab Navigation */}
      <nav style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: '#F0F3F8', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
        {[
          { id: 'empresa', label: 'Empresa', icon: <Building2 size={16} /> },
          { id: 'perfil', label: 'Meu Perfil', icon: <UserCog size={16} /> },
          { id: 'seguranca', label: 'Segurança', icon: <ShieldCheck size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 20px', borderRadius: '10px', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '14px', fontWeight: 700, transition: 'all 0.2s',
              background: activeTab === tab.id ? '#fff' : 'transparent',
              color: activeTab === tab.id ? '#0A84FF' : '#64748B',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {/* SEÇÃO EMPRESA */}
        {activeTab === 'empresa' && (
          <section style={sectionStyle}>
            <div style={headerStyle}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(10,132,255,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A84FF' }}>
                <Building2 size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0D1B2A' }}>Dados da Empresa</h2>
                <p style={{ fontSize: '12px', color: '#8896A5', margin: 0 }}>Informações corporativas e fiscais</p>
              </div>
            </div>

            {empresaLoading ? (
               <div style={{ padding: '60px', textAlign: 'center' }}><Loader2 className="spinner" size={32} color="#0A84FF" /></div>
            ) : (
              <div style={{ padding: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <FormField label="Razão Social" fullWidth>
                    <Input 
                      value={empresaForm.razao_social} 
                      onChange={e => setEmpresaForm(f => ({ ...f, razao_social: e.target.value }))}
                      placeholder="Nome oficial da empresa" 
                    />
                  </FormField>
                  <FormField label="CNPJ">
                    <Input 
                      value={empresaForm.cnpj} 
                      onChange={e => setEmpresaForm(f => ({ ...f, cnpj: e.target.value }))}
                      placeholder="00.000.000/0001-00" 
                    />
                  </FormField>
                  <FormField label="E-mail de Contato">
                    <Input 
                      type="email"
                      value={empresaForm.email} 
                      onChange={e => setEmpresaForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="contato@empresa.com" 
                    />
                  </FormField>
                  <FormField label="Telefone Fixo/Celular">
                    <Input 
                      value={empresaForm.tel} 
                      onChange={e => setEmpresaForm(f => ({ ...f, tel: e.target.value }))}
                      placeholder="(11) 99999-9999" 
                    />
                  </FormField>
                  <FormField label="Endereço Completo" fullWidth>
                    <Input 
                      value={empresaForm.endereco} 
                      onChange={e => setEmpresaForm(f => ({ ...f, endereco: e.target.value }))}
                      placeholder="Rua, Número, Bairro, Cidade - UF" 
                    />
                  </FormField>
                </div>

                {empresaOriginal.atualizado_em && (
                  <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#8896A5', fontSize: '12px' }}>
                    <Clock size={14} /> Atualizado em: {empresaOriginal.atualizado_em}
                  </div>
                )}

                <footer style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '24px', borderTop: '1px solid #F5F7FA' }}>
                  <button onClick={handleCancelEmpresa} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #DDE3EE', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button onClick={handleSaveEmpresa} disabled={empresaSaving} style={{ 
                    padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#0A84FF', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(10,132,255,0.3)'
                  }}>
                    {empresaSaving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                    Salvar Alterações
                  </button>
                </footer>
              </div>
            )}
          </section>
        )}

        {/* SEÇÃO PERFIL */}
        {activeTab === 'perfil' && (
          <section style={sectionStyle}>
            <div style={headerStyle}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(58,209,92,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#30D158' }}>
                <UserIcon size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0D1B2A' }}>Dados do Usuário</h2>
                <p style={{ fontSize: '12px', color: '#8896A5', margin: 0 }}>Informações pessoais de acesso</p>
              </div>
            </div>

            {perfilLoading ? (
               <div style={{ padding: '60px', textAlign: 'center' }}><Loader2 className="spinner" size={32} color="#0A84FF" /></div>
            ) : (
              <div style={{ padding: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <FormField label="Nome Completo">
                    <Input 
                      value={perfilForm.nome} 
                      onChange={e => setPerfilForm(p => ({ ...p, nome: e.target.value }))}
                      placeholder="Seu nome" 
                    />
                  </FormField>
                  <FormField label="E-mail de Login">
                    <Input 
                      type="email"
                      value={perfilForm.email} 
                      onChange={e => setPerfilForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="seu@email.com" 
                    />
                  </FormField>
                  <FormField label="Cargo / Nível de Acesso">
                    <Input value={perfilData?.role || ''} disabled style={{ background: '#F8F9FA', color: '#8896A5' }} />
                  </FormField>
                  <FormField label="Membro desde">
                    <Input value={(perfilData as any)?.criado_em || 'Indisponível'} disabled style={{ background: '#F8F9FA', color: '#8896A5' }} />
                  </FormField>
                </div>

                <footer style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid #F5F7FA' }}>
                  <button onClick={handleUpdatePerfil} disabled={perfilSaving} style={{ 
                    padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#30D158', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(48,209,88,0.3)'
                  }}>
                    {perfilSaving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                    Atualizar Perfil
                  </button>
                </footer>
              </div>
            )}
          </section>
        )}

        {/* SEÇÃO SEGURANÇA */}
        {activeTab === 'seguranca' && (
          <section style={sectionStyle}>
            <div style={headerStyle}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(255,69,58,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF453A' }}>
                <Lock size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0D1B2A' }}>Alterar Senha</h2>
                <p style={{ fontSize: '12px', color: '#8896A5', margin: 0 }}>Proteja sua conta com uma senha forte</p>
              </div>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '600px' }}>
                <FormField label="Nova Senha">
                  <div style={{ position: 'relative' }}>
                    <Input 
                      type={showSenha ? 'text' : 'password'} 
                      value={senhaForm.nova_senha}
                      onChange={e => setSenhaForm(s => ({ ...s, nova_senha: e.target.value }))}
                      placeholder="Mínimo 6 caracteres" 
                    />
                    <button onClick={() => setShowSenha(!showSenha)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8896A5' }}>
                      {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormField>
                <FormField label="Confirmar Nova Senha">
                  <div style={{ position: 'relative' }}>
                    <Input 
                      type={showConf ? 'text' : 'password'} 
                      value={senhaForm.confirmar_senha}
                      onChange={e => setSenhaForm(s => ({ ...s, confirmar_senha: e.target.value }))}
                      placeholder="Repita a nova senha" 
                    />
                    <button onClick={() => setShowConf(!showConf)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8896A5' }}>
                      {showConf ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormField>
              </div>

              <footer style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid #F5F7FA' }}>
                <button onClick={handleUpdateSenha} disabled={senhaSaving} style={{ 
                  padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#FF453A', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(255,69,58,0.3)'
                }}>
                  {senhaSaving ? <Loader2 size={16} className="spinner" /> : <ShieldCheck size={16} />}
                  Alterar Senha
                </button>
              </footer>
            </div>
          </section>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 0.8s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
