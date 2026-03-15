import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Package, Eye, EyeOff, ArrowRight, Shield, Zap, TrendingUp, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { authLogin } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: <TrendingUp size={18} />, text: 'Dashboard com KPIs em tempo real' },
  { icon: <Package size={18} />, text: 'Gestão completa de estoque' },
  { icon: <Shield size={18} />, text: 'Segurança e controle de acesso' },
  { icon: <Zap size={18} />, text: 'Relatórios e análises avançadas' },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      toast.error('Preencha os campos de e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      const res = await authLogin(email, senha);
      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        toast.success(`Bem-vindo, ${res.data.user.nome}!`);
        navigate('/dashboard');
      } else {
        toast.error(res.error?.message || 'Credenciais inválidas.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Left Panel */}
      <div style={{
        flex: '0 0 480px',
        background: 'linear-gradient(155deg, #0060CC 0%, #0A84FF 40%, #1C9FFF 70%, #3B9EFF 100%)',
        display: 'flex', flexDirection: 'column',
        padding: '48px 52px',
        position: 'relative', overflow: 'hidden',
      }} className="login-left">
        {/* BG decoration */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '45%', left: '30%', width: '160px', height: '160px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '44px', height: '44px', background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}>
            <Package size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#fff', letterSpacing: '-0.3px' }}>
              DistribPro
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>Gestão Empresarial</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#fff', margin: '0 0 14px', lineHeight: '1.2', letterSpacing: '-0.5px' }}>
            Controle total do seu negócio
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', margin: '0 0 36px', lineHeight: '1.6' }}>
            Plataforma completa para distribuição e gestão empresarial de alto desempenho.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', background: 'rgba(255,255,255,0.15)',
                  borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0,
                }}>{f.icon}</div>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            © 2026 DistribPro Soluções · Todos os direitos reservados
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F5F7FA', padding: '40px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
              Entrar na plataforma
            </h1>
            <p style={{ fontSize: '14px', color: '#8896A5', margin: 0 }}>
              Acesse com suas credenciais para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                E-mail
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px',
                    border: '1.5px solid #DDE3EE', borderRadius: '10px',
                    fontSize: '14px', outline: 'none', transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#0A84FF'}
                  onBlur={e => e.target.style.borderColor = '#DDE3EE'}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <Shield size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '12px 44px 12px 40px',
                    border: '1.5px solid #DDE3EE', borderRadius: '10px',
                    fontSize: '14px', outline: 'none', transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#0A84FF'}
                  onBlur={e => e.target.style.borderColor = '#DDE3EE'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#8896A5'
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#8896A5' : 'linear-gradient(135deg, #0A84FF, #0060CC)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(10,132,255,0.25)'
              }}
            >
              {loading ? 'Entrando...' : <>Entrar na plataforma <ArrowRight size={18} /></>}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
            <span style={{ color: '#667085' }}>Não tem uma conta? </span>
            <button
              onClick={() => navigate('/register')}
              style={{ background: 'none', border: 'none', padding: 0, color: '#0A84FF', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Cadastre-se
            </button>
          </div>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', color: '#98A2B3' }}>
            <p>Demo Admin: joao@email.com · minhasenha123</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 860px) { .login-left { display: none !important; } }
      `}</style>
    </div>
  );
}
