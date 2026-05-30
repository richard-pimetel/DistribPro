import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight, Zap, Target, ShieldCheck, TrendingUp,
  BarChart3, Star, CheckCircle2, Store, Truck,
  Boxes, Tag, FileText, Users, Package, HelpCircle,
  ChevronDown, Award, Mail, Phone, MapPin, Building
} from 'lucide-react';

/* ─────────────────────────────────────────
   DESIGN SYSTEM & THEME TOKENS (Sleek Blue/Slate Light Theme)
   ───────────────────────────────────────── */
const C = {
  bg: '#F4F7FA', // Clean light gray-blue background
  bgDeep: '#E9EEF4', // Darker gray-blue for alternate sections
  surface: '#FFFFFF', // Crisp white surface panels
  border: '#DDE3EE', // Soft border color matching the platform
  borderHover: '#C9D3E6',
  primary: '#0A84FF', // Royal Blue primary color
  primaryHover: '#006DDF',
  primaryDim: 'rgba(10,132,255,0.06)',
  primaryGlow: 'rgba(10,132,255,0.22)',
  accent: '#667eea', // Purple-blue accent for gradient highlights
  accentDim: 'rgba(102,126,234,0.06)',
  text: '#2C3E50', // Rich dark gray for general text
  muted: '#7F8C8D', // Neutral gray for descriptions
  mutedLight: '#95A5A6', // Soft light gray
  heading: '#0D1B2A', // Navy/almost black for headings
};

/* ─────────────────────────────────────────
   STATIC DATA
   ───────────────────────────────────────── */
const TARGETS = [
  {
    type: 'comprador',
    title: 'Para Varejistas & Compradores',
    subtitle: 'Abasteça seu negócio com agilidade',
    desc: 'Esqueça os múltiplos pedidos via WhatsApp. Tenha acesso direto às melhores distribuidoras e marcas com preço de fábrica, faturamento e logística centralizada.',
    badgeColor: C.primary,
    badgeBg: C.primaryDim,
    bullets: [
      'Preço de atacado direto das principais indústrias.',
      'Checkout Único multi-fornecedor inteligente.',
      'Opções de faturamento facilitado via boleto ou limite.',
      'Acompanhamento de entrega em tempo real de ponta a ponta.'
    ],
    cta: 'Acessar Catálogo Grátis',
    icon: <Store size={26} color={C.primary} />
  },
  {
    type: 'fornecedor',
    title: 'Para Fornecedores & Distribuidores',
    subtitle: 'Multiplique seu alcance de vendas',
    desc: 'Digitalize todo o seu processo comercial. Coloque sua vitrine de produtos no ar para milhares de lojistas ávidos, gerencie estoques e automatize notas fiscais.',
    badgeColor: '#E67E22',
    badgeBg: 'rgba(230,126,34,0.07)',
    bullets: [
      'Vitrine digital inteligente de alta conversão.',
      'Automação completa do faturamento e emissão de notas.',
      'Painel de Estoque inteligente com alerta de reposição.',
      'Métricas e inteligência de vendas integradas por CNPJ.'
    ],
    cta: 'Cadastrar Minha Distribuidora',
    icon: <Truck size={26} color="#E67E22" />
  }
];

const FEATURES = [
  {
    icon: <Target size={24} color={C.primary} />,
    bg: C.primaryDim,
    title: 'Conexão Sem Barreiras',
    desc: 'Lojistas e fornecedores negociam em uma infraestrutura digital robusta, transparente e focada em resultados sem intermediários desnecessários.'
  },
  {
    icon: <Zap size={24} color="#667eea" />,
    bg: 'rgba(102,126,234,0.06)',
    title: 'Checkout Inteligente B2B',
    desc: 'Compre de 10 fornecedores diferentes e finalize a compra com um único clique. O sistema DistribPro divide e roteia os pedidos automaticamente.'
  },
  {
    icon: <BarChart3 size={24} color="#E67E22" />,
    bg: 'rgba(230,126,34,0.06)',
    title: 'Análise de KPI em Tempo Real',
    desc: 'Monitore tendências de mercado, produtos mais vendidos, margens brutas, taxas de conversão e faturamento total em gráficos interativos.'
  },
  {
    icon: <ShieldCheck size={24} color="#2ECC71" />,
    bg: 'rgba(46,204,113,0.06)',
    title: 'Segurança & Auditoria',
    desc: 'Controles estritos com autenticação JWT de duas vias, criptografia de ponta e níveis granulares de acessos para equipes de vendas.'
  },
  {
    icon: <FileText size={24} color="#9B59B6" />,
    bg: 'rgba(155,89,182,0.06)',
    title: 'Emissão de Notas Fiscais',
    desc: 'Envio direto das notas fiscais para o cliente e operador em segundos, reduzindo burocracia e planilhas em 87%.'
  },
  {
    icon: <Boxes size={24} color={C.primary} />,
    bg: C.primaryDim,
    title: 'Controle de Estoque Ativo',
    desc: 'Evite furos de venda. Cada fornecedor possui controle dinâmico que avisa quando o SKU atinge o limite crítico de segurança.'
  },
];

const STEPS = [
  { n: '01', color: C.primary, title: 'Crie o seu perfil', desc: 'Registre sua conta em 3 minutos como Varejista (Comprador) ou Fornecedor de produtos.' },
  { n: '02', color: '#667eea', title: 'Carregue / Explore os Produtos', desc: 'Fornecedores cadastram produtos e varejistas buscam de forma inteligente com filtros detalhados.' },
  { n: '03', color: '#2ECC71', title: 'Negócios Simplificados', desc: 'Pedidos fluem automaticamente com cálculo de comissões, faturamento flexível e alertas instantâneos.' },
];

const STATS = [
  { n: '3.100+', label: 'Varejistas Ativos' },
  { n: '450+', label: 'Fornecedores Conectados' },
  { n: '25.000+', label: 'Produtos e SKUs no Ar' },
  { n: '99.9%', label: 'Uptime das Operações' },
];

const FAQS = [
  { q: 'Como funciona o faturamento no portal?', a: 'Cada fornecedor cadastrado pode estabelecer prazos de faturamento flexíveis (ex: 7, 14, 30 dias) para seus clientes homologados, oferecendo crédito e limites de compra de forma totalmente isolada e segura.' },
  { q: 'O varejista paga alguma mensalidade ou taxa?', a: 'Não. Para os varejistas e lojistas compradores, a plataforma é 100% gratuita. Você tem acesso a todo o catálogo das marcas e realiza pedidos com preço de atacado sem custos extras.' },
  { q: 'Como é calculada a comissão de operação?', a: 'Os fornecedores definem uma taxa de comissão operacional para os seus produtos. O sistema realiza a divisão, e os operadores logísticos visualizam todos os dados e faturamentos com total transparência.' },
  { q: 'O sistema emite notas fiscais eletrônicas (NF-e)?', a: 'Sim. A plataforma conta com fluxo integrado que permite o upload e a vinculação das notas fiscais eletrônicas diretamente em cada pedido, notificando o comprador instantaneamente por e-mail e app.' }
];

export function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: C.bg, color: C.text, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ─── CUSTOM STYLES & INTERACTIVE BEHAVIORS ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .premium-card {
          background: #fff;
          border: 1px solid ${C.border};
          box-shadow: 0 4px 18px rgba(10,30,60,0.05);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .premium-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(10,30,60,0.1);
          border-color: ${C.primary}33;
        }

        .primary-btn {
          background: linear-gradient(135deg, ${C.primary}, #0060CC);
          color: #fff;
          border: none;
          box-shadow: 0 4px 14px rgba(10,132,255,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(10,132,255,0.45);
        }

        .secondary-btn {
          background: #ffffff;
          border: 1.5px solid ${C.border};
          color: ${C.text};
          transition: all 0.25s;
        }
        .secondary-btn:hover {
          background: #F8FAFC;
          border-color: ${C.borderHover};
          transform: translateY(-1px);
        }

        .hero-banner-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          color: ${C.heading};
          letter-spacing: -2px;
          line-height: 1.1;
        }

        .nav-link {
          color: ${C.text};
          font-weight: 600;
          font-size: 14.5px;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: ${C.primary};
        }

        .badge-pulse {
          position: relative;
        }
        .badge-pulse::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 1px solid ${C.primary};
          animation: pulseRing 2s infinite;
        }

        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1.15); opacity: 0; }
        }

        @media (max-width: 960px) {
          .grid-2col { grid-template-columns: 1fr !important; }
          .grid-3col { grid-template-columns: 1fr 1fr !important; }
          .grid-4col { grid-template-columns: 1fr 1fr !important; }
          .mobile-hide { display: none !important; }
        }
        @media (max-width: 640px) {
          .grid-3col { grid-template-columns: 1fr !important; }
          .grid-4col { grid-template-columns: 1fr !important; }
          .hero-buttons { flex-direction: column !important; align-items: stretch !important; }
          .step-item { flex-direction: column !important; text-align: center !important; }
        }
      `}</style>

      {/* ─── HEADER (Premium Glassmorphism Style matching Portal) ─── */}
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(10,30,60,0.05)' : 'none',
        zIndex: 100,
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          {/* Logo container using premium logo.png */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: '38px', height: '38px',
              background: '#fff',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              border: `1.5px solid ${C.border}`,
            }}>
              <img src="/logo.png" alt="DistribPro Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: C.heading, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
              Distrib<span style={{ color: C.primary }}>Pro</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <a href="#solucoes" className="nav-link" style={{ textDecoration: 'none' }}>Soluções</a>
            <a href="#recursos" className="nav-link" style={{ textDecoration: 'none' }}>Recursos</a>
            <a href="#como-funciona" className="nav-link" style={{ textDecoration: 'none' }}>Como Funciona</a>
            <a href="#faq" className="nav-link" style={{ textDecoration: 'none' }}>FAQ</a>
          </nav>

          {/* Auth CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/login')}
              className="secondary-btn"
              style={{ padding: '9px 18px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}
            >
              Entrar
            </button>
            <button
              onClick={() => navigate('/register')}
              className="primary-btn"
              style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer' }}
            >
              Cadastrar Grátis
            </button>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section style={{ padding: '80px 24px 70px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>

          <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Top Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: C.primaryDim,
              border: `1.5px solid rgba(10,132,255,0.18)`,
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 700,
              color: C.primary,
              marginBottom: '28px'
            }}>
              <span className="badge-pulse" style={{ width: '8px', height: '8px', background: C.primary, borderRadius: '50%', display: 'block' }} />
              MARKETPLACE B2B INTELIGENTE
            </div>

            {/* Title */}
            <h1 className="hero-banner-title" style={{ fontSize: 'clamp(36px, 5.5vw, 68px)', marginBottom: '24px' }}>
              Abasteça e gerencie sua empresa <br />
              <span style={{ color: C.primary }}>em um único ecossistema.</span>
            </h1>

            {/* Paragraph */}
            <p style={{ fontSize: '17px', color: C.muted, lineHeight: 1.6, marginBottom: '38px', maxWidth: '640px', fontWeight: 500 }}>
              A plataforma definitiva que conecta varejistas aos maiores fornecedores e distribuidores do país.
              Vitrine digital integrada, checkout unificado de múltiplas marcas, faturamento e logística avançada.
            </p>

            {/* CTAs */}
            <div className="hero-buttons" style={{ display: 'flex', gap: '14px', marginBottom: '60px' }}>
              <button
                onClick={() => navigate('/register')}
                className="primary-btn"
                style={{ padding: '16px 36px', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Cadastrar Minha Empresa <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="secondary-btn"
                style={{ padding: '16px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
              >
                Conhecer a Loja Demo
              </button>
            </div>

          </div>

          {/* Stats Bar */}
          <div className="grid-4col" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            background: '#ffffff',
            border: `1.5px solid ${C.border}`,
            borderRadius: '20px',
            padding: '30px 20px',
            boxShadow: '0 8px 30px rgba(10,30,60,0.04)',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: C.heading, letterSpacing: '-1px', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '4px' }}>
                  {s.n}
                </div>
                <div style={{ fontSize: '13px', color: C.muted, fontWeight: 600 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SOLUTIONS GATED (BENTO GRID BY ROLE) ─── */}
      <section id="solucoes" style={{ padding: '90px 24px', backgroundColor: C.bgDeep }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
              PERFIS DO MARKETPLACE
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: C.heading, letterSpacing: '-1.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Desenhado para os dois lados do mercado
            </h2>
            <p style={{ color: C.muted, fontSize: '15.5px', marginTop: '12px', maxWidth: '500px', margin: '12px auto 0' }}>
              Não importa se você busca comprar marcas baratas ou expor e faturar seu catálogo: o DistribPro cuida de tudo.
            </p>
          </div>

          <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {TARGETS.map((t, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                border: `1.5px solid ${C.border}`,
                borderRadius: '24px',
                padding: '48px 40px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(10,30,60,0.04)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Visual Accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: t.badgeColor }} />

                {/* Header Icon + Role Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: t.badgeBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t.icon}
                  </div>
                  <span style={{
                    background: t.badgeBg,
                    color: t.badgeColor,
                    fontSize: '11.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    padding: '6px 14px',
                    borderRadius: '20px'
                  }}>
                    {t.type === 'comprador' ? 'Varejo' : 'Distribuição'}
                  </span>
                </div>

                {/* Info Text */}
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: C.heading, marginBottom: '8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {t.title}
                </h3>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: t.badgeColor, marginBottom: '16px' }}>
                  {t.subtitle}
                </h4>
                <p style={{ color: C.muted, fontSize: '14.5px', lineHeight: 1.6, marginBottom: '32px' }}>
                  {t.desc}
                </p>

                {/* Bullets */}
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 38px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {t.bullets.map((bullet, bidx) => (
                    <li key={bidx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: C.text, fontWeight: 500 }}>
                      <CheckCircle2 size={16} color={t.badgeColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Action button */}
                <button
                  onClick={() => navigate('/register')}
                  className="primary-btn"
                  style={{
                    marginTop: 'auto',
                    padding: '14px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '14.5px',
                    cursor: 'pointer',
                    background: t.type === 'comprador' ? `linear-gradient(135deg, ${C.primary}, #0060CC)` : 'linear-gradient(135deg, #E67E22, #C0392B)',
                    boxShadow: t.type === 'comprador' ? '0 4px 14px rgba(10,132,255,0.3)' : '0 4px 14px rgba(230,126,34,0.3)',
                  }}
                >
                  {t.cta}
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── PLATFORM KEY FEATURES ─── */}
      <section id="recursos" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '68px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
              EFICIÊNCIA OPERACIONAL
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: C.heading, letterSpacing: '-1.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Tudo o que sua operação B2B precisa
            </h2>
            <p style={{ color: C.muted, fontSize: '15.5px', marginTop: '12px', maxWidth: '500px', margin: '12px auto 0' }}>
              Uma engine de software robusta desenhada para sanar a dor dos atritos de faturamento, logística e conciliação comercial.
            </p>
          </div>

          <div className="grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {FEATURES.map((f, idx) => (
              <div key={idx} className="premium-card" style={{ borderRadius: '18px', padding: '36px 30px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
                  {f.icon}
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: C.heading, marginBottom: '12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {f.title}
                </h4>
                <p style={{ color: C.muted, fontSize: '13.5px', lineHeight: 1.6, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── HOW IT WORKS (3 SIMPLE STEPS) ─── */}
      <section id="como-funciona" style={{ padding: '90px 24px', backgroundColor: C.bgDeep }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '70px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
              PASSO A PASSO
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: C.heading, letterSpacing: '-1.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Do cadastro à entrega rápida
            </h2>
          </div>

          <div className="grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {STEPS.map((s, idx) => (
              <div key={idx} className="step-item" style={{
                background: '#ffffff',
                border: `1.5px solid ${C.border}`,
                borderRadius: '20px',
                padding: '36px 28px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 4px 18px rgba(10,30,60,0.03)'
              }}>
                {/* Number sphere */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `${s.color}15`,
                  border: `2.5px solid ${s.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: s.color
                }}>
                  {s.n}
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: C.heading, marginBottom: '12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {s.title}
                </h4>
                <p style={{ color: C.muted, fontSize: '13.5px', lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── DYNAMIC FAQ ACCORDION ─── */}
      <section id="faq" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
              DÚVIDAS FREQUENTES
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, color: C.heading, letterSpacing: '-1.5px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Perguntas frequentes
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${isOpen ? C.primary : C.border}`,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    boxShadow: isOpen ? '0 8px 24px rgba(10,132,255,0.06)' : 'none'
                  }}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      outline: 'none'
                    }}
                  >
                    <span style={{ fontSize: '15.5px', fontWeight: 700, color: isOpen ? C.primary : C.heading, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      color={isOpen ? C.primary : C.muted}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease'
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: '0 24px 22px',
                      color: C.text,
                      fontSize: '14px',
                      lineHeight: 1.6,
                      borderTop: `1px solid ${C.border}`
                    }}>
                      <div style={{ paddingTop: '16px' }}>{faq.a}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── FINAL CTA PANEL (High-Conversion Gradient Card) ─── */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #0A84FF, #004F9F)',
          borderRadius: '32px',
          padding: '76px 40px',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(10,132,255,0.22)'
        }}>
          {/* Decorative graphic backdrop */}
          <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.1 }}>
            <Award size={260} color="#fff" />
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-2px', marginBottom: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Pronto para transformar sua cadeia de suprimentos?
          </h2>
          <p style={{ opacity: 0.9, fontSize: '16.5px', maxWidth: '600px', margin: '0 auto 38px', lineHeight: 1.6 }}>
            Junte-se a centenas de empresas que reduziram processos de venda manuais via telefone e WhatsApp e digitalizaram 100% de seus fluxos.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '16px 38px',
                borderRadius: '12px',
                border: 'none',
                background: '#ffffff',
                color: C.primary,
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              Criar Conta Grátis
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '15px 30px',
                borderRadius: '12px',
                border: '1.5px solid rgba(255,255,255,0.3)',
                background: 'transparent',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              Falar com Comercial
            </button>
          </div>
          <p style={{ marginTop: '22px', fontSize: '13.5px', opacity: 0.7 }}>
            Sem cartão de crédito · Ativação imediata de credenciais
          </p>
        </div>
      </section>

      {/* ─── FOOTER (Matching App Style) ─── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '72px 24px 44px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div className="grid-4col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '56px' }}>

            {/* Branding Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px',
                  background: '#fff',
                  borderRadius: '9px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  border: `1.5px solid ${C.border}`,
                }}>
                  <img src="/logo.png" alt="DistribPro Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '19px', fontWeight: 800, color: C.heading, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.5px' }}>
                  Distrib<span style={{ color: C.primary }}>Pro</span>
                </span>
              </div>
              <p style={{ color: C.muted, fontSize: '13.5px', lineHeight: 1.6, maxWidth: '280px' }}>
                O marketplace e painel completo B2B para o atacarejo e distribuição inteligente de alta performance no Brasil.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: C.text }}>
                  <Building size={14} color={C.primary} />
                  <span>DistribPro Tecnologia S.A.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: C.text }}>
                  <Mail size={14} color={C.primary} />
                  <span>suporte@distribpro.com.br</span>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            {[
              { title: 'Plataforma', links: ['Vitrine de Vendas', 'Checkout Unificado', 'Métricas de Vendas', 'Controle de Estoque', 'Segurança JWT'] },
              { title: 'Soluções B2B', links: ['Para Varejistas', 'Para Fornecedores', 'Painel de Operações', 'Comissões Automatizadas', 'API & Integrações'] },
              { title: 'Corporativo', links: ['Falar com Vendas', 'Sobre a Empresa', 'Termos de Uso', 'Políticas de Cookies', 'Privacidade de Dados'] }
            ].map((col, idx) => (
              <div key={idx}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: C.heading, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '22px' }}>
                  {col.title}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {col.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a href="#solucoes" style={{ textDecoration: 'none', fontSize: '13.5px', color: C.muted, fontWeight: 500, transition: 'color 0.2s' }} className="nav-link">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          {/* Copyright row */}
          <div style={{ paddingTop: '28px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ color: C.muted, fontSize: '13px' }}>
              © 2026 DistribPro S.A. Todos os direitos reservados.
            </span>
            <span style={{ color: C.muted, fontSize: '13px' }}>
              CNPJ 00.000.000/0001-00 · São Paulo - SP, Brasil
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}