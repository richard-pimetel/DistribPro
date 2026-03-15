import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target, AlertTriangle, Package, RefreshCw } from 'lucide-react';
import {
  getDashboardKPIs, getDashboardEntregas, getDashboardStatus,
  getProdutosEstoqueBaixo, getClientes, getFornecedores,
  getPedidosRecentes, getPedidos
} from '../services/api';
import type { KPIs, EntregaData, StatusPedidoData, Produto, Pedido } from '../types';
import { StatusBadge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { downloadCSV } from '../utils/exportUtils';

function StatCard({ label, value, icon, color }: {
  label: string; value: string; icon: React.ReactNode; color: string;
}) {
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
          <p style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0', letterSpacing: '-0.5px' }}>{value}</p>
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
          <p key={i} style={{ fontSize: '13px', fontWeight: 600, color: p.stroke || p.color, margin: '2px 0' }}>
            {p.name}: {p.name === 'Faturamento' ? `R$ ${p.value.toLocaleString('pt-BR')}` : p.value}
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
  const [statusData, setStatusData] = useState<(StatusPedidoData & { color: string; label: string })[]>([]);
  const [estoqueBaixo, setEstoqueBaixo] = useState<Produto[]>([]);
  const [pedidosRecentes, setPedidosRecentes] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState(7);

  const isCliente = user?.role === 'cliente';

  const load = async () => {
    setLoading(true);
    try {
      if (isCliente) {
        // If client, we fetch their specific data. 
        // For now, we reuse existing APIs but filter results locally if needed.
        // Ideally the backend has /dashboard/cliente 
        const resPed = await getPedidos();
        if (resPed.success && resPed.data) {
          const targetClientId = user?.clienteId || user?.id;
          const myPedidos = resPed.data.filter((p: any) => {
            const cid = p.cliente_id || p.clienteId;
            return !isCliente || String(cid) === String(targetClientId);
          });
          setPedidosRecentes(myPedidos.slice(0, 5));
          
          // Calculate client KPIs locally for demo purposes
          const totalSpent = myPedidos.reduce((acc: number, p: Pedido) => acc + (p.valor || 0), 0);
          const pending = myPedidos.filter((p: Pedido) => p.status === 'Pendente').length;
          const road = myPedidos.filter((p: Pedido) => p.status === 'Em Rota').length;
          
          setKpis({
            total_produtos: 0,
            total_clientes: 0,
            total_fornecedores: 0,
            pedidos_pendentes: pending,
            pedidos_em_rota: road,
            faturamento_total: totalSpent,
            estoque_baixo: 0
          });

          // Simplified chart data for client
          const sRes = await getDashboardStatus(); // We could aggregate myPedidos here too
          if (sRes.success) {
             const colors: Record<string, string> = { 'Entregue': '#30D158', 'Pendente': '#0A84FF', 'Em Rota': '#8B5CF6', 'Cancelado': '#FF453A', 'Confirmado': '#FFD60A' };
             const mapped = sRes.data!.map(item => ({ ...item, color: colors[item.status] || '#8896A5', label: item.status }));
             setStatusData(mapped);
          }
           const eRes = await getDashboardEntregas(periodo);
           if (eRes.success) setEntregas(eRes.data!.map((p: any) => ({ ...p, total: myPedidos.filter((op: Pedido) => (op.criado_em || op.data_entrega).includes(p.dia)).length })));
        }
      } else {
        const results = await Promise.all([
          getDashboardKPIs(), 
          getDashboardEntregas(periodo), 
          getDashboardStatus(), 
          getProdutosEstoqueBaixo(),
          getPedidosRecentes()
        ]);
        
        const [kRes, eRes, sRes, ebRes, prRes] = results;
        if (kRes.success) setKpis(kRes.data!);
        if (eRes.success) setEntregas(eRes.data!);
        if (sRes.success) {
          const colors: Record<string, string> = { 'Entregue': '#30D158', 'Pendente': '#0A84FF', 'Em Rota': '#8B5CF6', 'Cancelado': '#FF453A', 'Confirmado': '#FFD60A' };
          const mapped = sRes.data!.map(item => ({ ...item, color: colors[item.status] || '#8896A5', label: item.status }));
          setStatusData(mapped);
        }
        if (ebRes.success) setEstoqueBaixo(ebRes.data!);
        if (prRes.success && prRes.data) setPedidosRecentes(prRes.data);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
    
    // Auto-refresh every 45 seconds to keep KPIs and charts synchronized
    const interval = setInterval(() => {
      load();
    }, 45000);

    return () => clearInterval(interval);
  }, [periodo, user?.id]);

  const fmt = (n: number) => n >= 1000 ? `R$ ${(n / 1000).toFixed(1)}K` : `R$ ${n.toFixed(2)}`;
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
            {isCliente ? 'Bem-vindo ao seu portal de serviços' : new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#4A5568', fontFamily: "'Inter', sans-serif" }}>
            <RefreshCw size={14} /> Atualizar
          </button>
          {!isCliente && (
            <button 
              onClick={() => {
                if (!kpis) return;
                const exportData = [
                  { Métrica: 'Faturamento Total', Valor: kpis.faturamento_total },
                  { Métrica: 'Total de Produtos', Valor: kpis.total_produtos },
                  { Métrica: 'Pedidos Pendentes', Valor: kpis.pedidos_pendentes },
                  { Métrica: 'Pedidos em Rota', Valor: kpis.pedidos_em_rota },
                  { Métrica: 'Total de Clientes', Valor: kpis.total_clientes },
                  { Métrica: 'Total de Fornecedores', Valor: kpis.total_fornecedores },
                  { Métrica: 'Estoque Baixo', Valor: kpis.estoque_baixo }
                ];
                downloadCSV(exportData, 'dashboard_kpis');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 14px rgba(10,132,255,0.3)' }}
            >
              ↗ Exportar CSV
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div style={{ display: 'grid', gridTemplateColumns: isCliente ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)', gap: '18px', marginBottom: '28px' }} className="stats-grid">
          {isCliente ? (
            <>
              <StatCard label="Total Investido" value={fmt(kpis.faturamento_total)} icon={<DollarSign size={20} />} color="#0A84FF" />
              <StatCard label="Solicitações Pendentes" value={fmtNum(kpis.pedidos_pendentes)} icon={<ShoppingCart size={20} />} color="#FF6B35" />
              <StatCard label="Pedidos Concluídos" value={fmtNum(kpis.pedidos_em_rota)} icon={<TrendingUp size={20} />} color="#30D158" />
            </>
          ) : (
            <>
              <StatCard label="Faturamento" value={fmt(kpis.faturamento_total)} icon={<DollarSign size={20} />} color="#0A84FF" />
              <StatCard label="Produtos" value={fmtNum(kpis.total_produtos)} icon={<Package size={20} />} color="#30D158" />
              <StatCard label="Pendente/Rota" value={fmtNum(kpis.pedidos_pendentes + kpis.pedidos_em_rota)} icon={<ShoppingCart size={20} />} color="#FF6B35" />
              <StatCard label="Clientes" value={fmtNum(kpis.total_clientes)} icon={<Users size={20} />} color="#8B5CF6" />
              <StatCard label="Fornecedores" value={fmtNum(kpis.total_fornecedores)} icon={<Target size={20} />} color="#FFD60A" />
            </>
          )}
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', marginBottom: '20px' }} className="charts-grid">
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #DDE3EE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 2px' }}>{isCliente ? 'Minhas Atividades' : 'Vendas por Período'}</h3>
              <p style={{ fontSize: '12px', color: '#8896A5', margin: 0 }}>Histórico de solicitações</p>
            </div>
            {!isCliente && (
              <select value={periodo} onChange={e => setPeriodo(Number(e.target.value))} style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: '#F5F7FA', fontSize: '12.5px', color: '#4A5568', cursor: 'pointer', outline: 'none', fontFamily: "'Inter', sans-serif" }}>
                <option value={7}>Últimos 7 dias</option>
                <option value={14}>Últimos 14 dias</option>
                <option value={30}>Últimos 30 dias</option>
              </select>
            )}
          </div>
          <div style={{ padding: '16px 8px 8px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={entregas} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F8" />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#8896A5', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8896A5', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" name="Solicitações" stroke="#0A84FF" strokeWidth={2.5} fill="url(#colorVendas)" dot={false} activeDot={{ r: 5, fill: '#0A84FF' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #DDE3EE' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 2px' }}>Status das Solicitações</h3>
            <p style={{ fontSize: '12px', color: '#8896A5', margin: 0 }}>Acompanhamento</p>
          </div>
          <div style={{ padding: '16px 16px 8px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={52} outerRadius={75} dataKey="total" paddingAngle={3}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(val: any) => [val, 'Solicitações']} contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '8px', border: '1px solid #DDE3EE' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 4px 8px' }}>
              {statusData.slice(0, 4).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: '#4A5568' }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0D1B2A' }}>{s.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: isCliente ? '1fr' : '1fr 1fr', gap: '20px' }} className="bottom-grid">
        {!isCliente && (
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #DDE3EE' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 2px' }}>{isCliente ? 'Minhas Últimas Solicitações' : 'Pedidos Recentes'}</h3>
            <p style={{ fontSize: '11px', color: '#8896A5', margin: 0 }}>Status atual das suas demandas</p>
          </div>
          <div>
            {pedidosRecentes.map((p, i) => (
              <div key={p.id} style={{ padding: '12px 24px', borderBottom: i < pedidosRecentes.length - 1 ? '1px solid #F5F7FA' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0D1B2A' }}>#{p.id}</div>
                  <div style={{ fontSize: '11px', color: '#8896A5', marginTop: '2px' }}>{p.produto_nome} (x{p.qtd})</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={p.status.toLowerCase()} />
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0D1B2A', marginTop: '4px' }}>
                    R$ {p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            ))}
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
