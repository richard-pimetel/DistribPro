import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target, AlertTriangle, Package, RefreshCw } from 'lucide-react';
import { getDashboardKPIs, getDashboardEntregas, getDashboardStatus, getProdutosEstoqueBaixo, getClientes, getFornecedores, getPedidosRecentes } from '../services/api';
import type { KPIs, EntregaData, StatusPedidoData, Produto, Pedido } from '../types';
import { StatusBadge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

function StatCard({ label, value, change, icon, color }: {
  label: string; value: string; change: number; icon: React.ReactNode; color: string;
}) {
  const isUp = change >= 0;
  return (
    <div style={{
      background: '#fff', borderRadius: '14px', padding: '22px 24px',
      border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)',
      position: 'relative', overflow: 'hidden', transition: 'all 0.2s ease',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 28px rgba(10,30,60,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(10,30,60,0.07)'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color, borderRadius: '14px 14px 0 0' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#8896A5', textTransform: 'uppercase', letterSpacing: '0.9px', margin: '0 0 10px' }}>{label}</p>
          <p style={{ fontSize: '30px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 8px', letterSpacing: '-1px' }}>{value}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {isUp ? <TrendingUp size={13} color="#30D158" /> : <TrendingDown size={13} color="#FF453A" />}
            <span style={{ fontSize: '12px', fontWeight: 600, color: isUp ? '#20A040' : '#C0392B' }}>
              {isUp ? '+' : ''}{change}% vs mês anterior
            </span>
          </div>
        </div>
        <div style={{ background: `${color}18`, borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #DDE3EE', borderRadius: '10px', padding: '12px 16px', boxShadow: '0 6px 24px rgba(10,30,60,0.12)', fontFamily: "'Inter', sans-serif" }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: '#8896A5', margin: '0 0 8px', textTransform: 'uppercase' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ fontSize: '13px', fontWeight: 600, color: p.color, margin: '2px 0' }}>
            {p.name}: {p.name === 'Vendas' ? `R$ ${p.value.toLocaleString('pt-BR')}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
export function DashboardPage() {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [entregas, setEntregas] = useState<EntregaData[]>([]);
  const [statusData, setStatusData] = useState<StatusPedidoData[]>([]);
  const [estoqueBaixo, setEstoqueBaixo] = useState<Produto[]>([]);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalFornecedores, setTotalFornecedores] = useState(0);
  const [pedidosRecentes, setPedidosRecentes] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState(7);

  const load = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        getDashboardKPIs(), 
        getDashboardEntregas(periodo), 
        getDashboardStatus(), 
        getProdutosEstoqueBaixo(),
        getClientes(),
        getFornecedores(),
        getPedidosRecentes()
      ]);
      
      const [kRes, eRes, sRes, ebRes, cRes, fRes, prRes] = results;
      
      if (kRes.success) setKpis(kRes.data!);
      if (eRes.success) setEntregas(eRes.data!);
      if (sRes.success) setStatusData(sRes.data!);
      if (ebRes.success) setEstoqueBaixo(ebRes.data!);
      if (cRes.success && cRes.data) setTotalClientes(cRes.data.length);
      if (fRes.success && fRes.data) setTotalFornecedores(fRes.data.length);
      if (prRes.success && prRes.data) setPedidosRecentes(prRes.data);
      
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [periodo]);

  const fmt = (n: number) => n >= 1000 ? `R$ ${(n / 1000).toFixed(1)}K` : `R$ ${n}`;
  const fmtNum = (n: number) => n.toLocaleString('pt-BR');

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #DDE3EE', borderTopColor: '#0A84FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#8896A5', fontSize: '13px' }}>Carregando dados…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>
            {getGreeting()}, {user?.nome?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={load} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 16px', borderRadius: '8px', border: '1.5px solid #DDE3EE',
            background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#4A5568',
            fontFamily: "'Inter', sans-serif",
          }}>
            <RefreshCw size={14} /> Atualizar
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 18px', borderRadius: '8px', border: 'none',
            background: 'linear-gradient(135deg, #0A84FF, #0060CC)',
            cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 4px 14px rgba(10,132,255,0.3)',
          }}>
            ↗ Exportar relatório
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '18px', marginBottom: '28px' }} className="stats-grid">
          <StatCard label="Receita do Mês" value={fmt(kpis.receita)} change={kpis.receitaVariacao} icon={<DollarSign size={20} />} color="#0A84FF" />
          <StatCard label="Pedidos" value={fmtNum(kpis.pedidos)} change={kpis.pedidosVariacao} icon={<ShoppingCart size={20} />} color="#30D158" />
          <StatCard label="Clientes" value={fmtNum(totalClientes || kpis.clientes)} change={kpis.clientesVariacao} icon={<Users size={20} />} color="#FF6B35" />
          <StatCard label="Fornecedores" value={fmtNum(totalFornecedores)} change={0} icon={<Package size={20} />} color="#8B5CF6" />
          <StatCard label="Ticket Médio" value={`R$ ${fmtNum(kpis.ticketMedio)}`} change={kpis.ticketMedioVariacao} icon={<Target size={20} />} color="#FFD60A" />
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', marginBottom: '20px' }} className="charts-grid">
        {/* Area Chart */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #DDE3EE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 2px' }}>Vendas por Período</h3>
              <p style={{ fontSize: '12px', color: '#8896A5', margin: 0 }}>Receita e entregas nos últimos dias</p>
            </div>
            <select value={periodo} onChange={e => setPeriodo(Number(e.target.value))} style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: '#F5F7FA', fontSize: '12.5px', color: '#4A5568', cursor: 'pointer', outline: 'none', fontFamily: "'Inter', sans-serif" }}>
              <option value={7}>Últimos 7 dias</option>
              <option value={14}>Últimos 14 dias</option>
              <option value={30}>Últimos 30 dias</option>
            </select>
          </div>
          <div style={{ padding: '16px 8px 8px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={entregas} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEntregas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#30D158" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#30D158" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F8" />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#8896A5', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8896A5', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="vendas" name="Vendas" stroke="#0A84FF" strokeWidth={2.5} fill="url(#colorVendas)" dot={false} activeDot={{ r: 5, fill: '#0A84FF' }} />
                <Area type="monotone" dataKey="entregas" name="Entregas" stroke="#30D158" strokeWidth={2.5} fill="url(#colorEntregas)" dot={false} activeDot={{ r: 5, fill: '#30D158' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #DDE3EE' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 2px' }}>Status dos Pedidos</h3>
            <p style={{ fontSize: '12px', color: '#8896A5', margin: 0 }}>Distribuição por status</p>
          </div>
          <div style={{ padding: '16px 16px 8px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={52} outerRadius={75} dataKey="count" paddingAngle={3}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(val: any) => [val, 'Pedidos']} contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #DDE3EE' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 4px 8px' }}>
              {statusData.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: '#4A5568' }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0D1B2A' }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="bottom-grid">
        {/* Low stock alert */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #DDE3EE', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', background: 'rgba(255,214,10,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={15} color="#A07800" />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: 0 }}>Estoque Crítico</h3>
              <p style={{ fontSize: '11px', color: '#8896A5', margin: 0 }}>{estoqueBaixo.length} produto(s) abaixo do mínimo</p>
            </div>
          </div>
          <div>
            {estoqueBaixo.slice(0, 5).map(p => (
              <div key={p.id} style={{ padding: '12px 24px', borderBottom: '1px solid #F5F7FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '34px', height: '34px', background: '#F5F7FA', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #DDE3EE' }}>
                    <Package size={15} color="#8896A5" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0D1B2A' }}>{p.nome}</div>
                    <div style={{ fontSize: '11px', color: '#8896A5' }}>{p.sku} · Mín: {p.estoque_min}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: p.estoque === 0 ? '#FF453A' : '#A07800' }}>{p.estoque} un.</div>
                  <div style={{ width: '60px', height: '4px', background: '#F0F3F8', borderRadius: '99px', marginTop: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (p.estoque / (p.estoque_min || 1)) * 100)}%`, background: p.estoque <= (p.estoque_min || 1) * 0.3 ? '#FF453A' : '#FFD60A', borderRadius: '99px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #DDE3EE' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 2px' }}>Pedidos Recentes</h3>
            <p style={{ fontSize: '11px', color: '#8896A5', margin: 0 }}>Últimas movimentações</p>
          </div>
          <div>
            {pedidosRecentes.map((p, i) => (
              <div key={p.id} style={{ padding: '12px 24px', borderBottom: i < pedidosRecentes.length - 1 ? '1px solid #F5F7FA' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0D1B2A' }}>#{p.id}</div>
                  <div style={{ fontSize: '11px', color: '#8896A5', marginTop: '2px' }}>{p.cliente_nome}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={p.status.toLowerCase()} />
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0D1B2A', marginTop: '4px' }}>
                    R$ {p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            ))}
            {pedidosRecentes.length === 0 && (
              <div style={{ padding: '32px', textAlign: 'center', color: '#8896A5', fontSize: '13px' }}>
                Nenhum pedido recente.
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1400px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 1200px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .charts-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
