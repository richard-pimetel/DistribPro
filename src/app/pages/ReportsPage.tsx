import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Package, DollarSign, 
  Calendar, Download, Loader2, ArrowUpRight, ArrowDownRight,
  Filter, ChevronRight, FileText, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { RelatoriosAPI } from '../services/api';
import type { 
  RelatorioVendas, RelatorioVendasProduto, RelatorioVendasCliente, 
  RelatorioEstoque, RelatorioFinanceiro 
} from '../types';

export function ReportsPage() {
  // Period filter states (default: first day of current month to today)
  // Helper to format Date to YYYY-MM-DD in local time
  const toLocalISO = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = toLocalISO(new Date());
  const firstDayStr = toLocalISO(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  
  const [dates, setDates] = useState({ inicio: firstDayStr, fim: todayStr });
  const [activeTab, setActiveTab] = useState<'vendas' | 'produtos' | 'clientes' | 'estoque' | 'financeiro'>('vendas');

  // Individual states for each report section
  const [vendas, setVendas] = useState<{ loading: boolean; data: RelatorioVendas | null }>({ loading: false, data: null });
  const [produtos, setProdutos] = useState<{ loading: boolean; data: RelatorioVendasProduto[] | null; limite: number }>({ loading: false, data: null, limite: 10 });
  const [clientes, setClientes] = useState<{ loading: boolean; data: RelatorioVendasCliente[] | null; limite: number }>({ loading: false, data: null, limite: 10 });
  const [estoque, setEstoque] = useState<{ loading: boolean; data: RelatorioEstoque | null }>({ loading: false, data: null });
  const [financeiro, setFinanceiro] = useState<{ loading: boolean; data: RelatorioFinanceiro | null }>({ loading: false, data: null });

  // Loaders
  const loadVendas = async () => {
    setVendas(p => ({ ...p, loading: true }));
    try {
      const res = await RelatoriosAPI.vendas(dates.inicio, dates.fim);
      if (res.success) setVendas({ loading: false, data: res.data || null });
      else toast.error(res.error?.message || 'Falha ao carregar relatório de vendas.');
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setVendas(p => ({ ...p, loading: false }));
    }
  };

  const loadProdutos = async () => {
    setProdutos(p => ({ ...p, loading: true }));
    try {
      const res = await RelatoriosAPI.vendasProdutos(dates.inicio, dates.fim, produtos.limite);
      if (res.success) setProdutos(p => ({ ...p, loading: false, data: res.data || [] }));
      else toast.error(res.error?.message || 'Falha ao carregar ranking de produtos.');
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setProdutos(p => ({ ...p, loading: false }));
    }
  };

  const loadClientes = async () => {
    setClientes(p => ({ ...p, loading: true }));
    try {
      const res = await RelatoriosAPI.vendasClientes(dates.inicio, dates.fim, clientes.limite);
      if (res.success) setClientes(p => ({ ...p, loading: false, data: res.data || [] }));
      else toast.error(res.error?.message || 'Falha ao carregar ranking de clientes.');
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setClientes(p => ({ ...p, loading: false }));
    }
  };

  const loadEstoque = async () => {
    setEstoque(p => ({ ...p, loading: true }));
    try {
      const res = await RelatoriosAPI.estoque();
      if (res.success) setEstoque({ loading: false, data: res.data || null });
      else toast.error(res.error?.message || 'Falha ao carregar relatório de estoque.');
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setEstoque(p => ({ ...p, loading: false }));
    }
  };

  const loadFinanceiro = async () => {
    setFinanceiro(p => ({ ...p, loading: true }));
    try {
      const res = await RelatoriosAPI.financeiro(dates.inicio, dates.fim);
      if (res.success) setFinanceiro({ loading: false, data: res.data || null });
      else toast.error(res.error?.message || 'Falha ao carregar relatório financeiro.');
    } catch (err: any) {
      toast.error(err.message || 'Erro de conexão.');
    } finally {
      setFinanceiro(p => ({ ...p, loading: false }));
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Trigger all on period change or click
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await Promise.all([
        loadVendas(),
        loadProdutos(),
        loadClientes(),
        loadEstoque(),
        loadFinanceiro()
      ]);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, []); // Initial load

  const fmtPrice = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const fmtDate = (d: string) => d.split('-').reverse().join('/');

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 6px' }}>
            Relatórios e Análises
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p style={{ fontSize: '14px', color: '#8896A5', margin: 0 }}>
              Gerencie o desempenho do seu negócio com dados precisos
            </p>
            {lastUpdated && (
              <span style={{ fontSize: '12px', color: '#0A84FF', background: 'rgba(10,132,255,0.08)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                Atualizado às {lastUpdated}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: '#fff', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #DDE3EE', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="#8896A5" />
            <input type="date" value={dates.inicio} onChange={e => setDates(d => ({ ...d, inicio: e.target.value }))} style={{ border: 'none', outline: 'none', fontSize: '13px', color: '#4A5568', background: 'transparent' }} />
            <ChevronRight size={14} color="#DDE3EE" />
            <input type="date" value={dates.fim} onChange={e => setDates(d => ({ ...d, fim: e.target.value }))} style={{ border: 'none', outline: 'none', fontSize: '13px', color: '#4A5568', background: 'transparent' }} />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ 
              background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', border: 'none', 
              padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, 
              cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
              opacity: isGenerating ? 0.7 : 1
            }}
            className="btn-hover"
          >
            {isGenerating ? <Loader2 size={14} className="spinner" /> : <Filter size={14} />} 
            {isGenerating ? 'Processando...' : 'Gerar Relatórios'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'vendas', label: 'Vendas', icon: <TrendingUp size={16} /> },
          { id: 'produtos', label: 'Produtos', icon: <Package size={16} /> },
          { id: 'clientes', label: 'Clientes', icon: <Users size={16} /> },
          { id: 'estoque', label: 'Estoque', icon: <BarChart3 size={16} /> },
          { id: 'financeiro', label: 'Financeiro', icon: <DollarSign size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
              borderRadius: '10px', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === tab.id ? '#0A84FF' : '#fff',
              color: activeTab === tab.id ? '#fff' : '#64748B',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(10,132,255,0.25)' : 'none',
              border: activeTab === tab.id ? '1px solid #0A84FF' : '1px solid #DDE3EE'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: '400px' }}>
        {/* VENDAS */}
        {activeTab === 'vendas' && (
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            {vendas.loading ? (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={32} color="#0A84FF" className="spinner" /></div>
            ) : !vendas.data ? (
              <NoData message="Dados de vendas indisponíveis" />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                  <StatCard label="Total de Pedidos" value={vendas.data.total_pedidos} icon={<TrendingUp size={20} />} color="#0A84FF" />
                  <StatCard label="Itens Vendidos" value={vendas.data.total_itens} icon={<Package size={20} />} color="#00C7BE" />
                  <StatCard label="Receita Bruta" value={fmtPrice(vendas.data.valor_total)} icon={<DollarSign size={20} />} color="#30D158" />
                </div>
                <ReportTable 
                  title="Resumo por Status" 
                  columns={['Status', 'Total Pedidos', 'Valor']}
                  data={vendas.data.pedidos_por_status.map(s => [s.status, s.total, fmtPrice(s.valor)])}
                />
              </>
            )}
          </div>
        )}

        {/* PRODUTOS */}
        {activeTab === 'produtos' && (
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: '#8896A5' }}>Mostrar Top:</span>
              <input 
                type="number" value={produtos.limite} 
                onChange={e => setProdutos(p => ({ ...p, limite: Number(e.target.value) }))}
                style={{ width: '60px', padding: '6px 10px', borderRadius: '8px', border: '1px solid #DDE3EE', outline: 'none' }}
              />
              <button onClick={loadProdutos} style={{ background: '#F5F7FA', border: '1px solid #DDE3EE', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>Atualizar</button>
            </div>
            {produtos.loading ? (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={32} color="#0A84FF" className="spinner" /></div>
            ) : !produtos.data || produtos.data.length === 0 ? (
              <NoData message="Nenhum dado encontrado para este período" />
            ) : (
              <ReportTable 
                title="Ranking de Produtos Mais Vendidos" 
                columns={['Produto', 'Qtd Vendida', 'Valor Total']}
                data={produtos.data.map(p => [p.produto_nome, p.qtd_vendida, fmtPrice(p.valor_total)])}
              />
            )}
          </div>
        )}

        {/* CLIENTES */}
        {activeTab === 'clientes' && (
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: '#8896A5' }}>Mostrar Top:</span>
              <input 
                type="number" value={clientes.limite} 
                onChange={e => setClientes(p => ({ ...p, limite: Number(e.target.value) }))}
                style={{ width: '60px', padding: '6px 10px', borderRadius: '8px', border: '1px solid #DDE3EE', outline: 'none' }}
              />
              <button onClick={loadClientes} style={{ background: '#F5F7FA', border: '1px solid #DDE3EE', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>Atualizar</button>
            </div>
            {clientes.loading ? (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={32} color="#0A84FF" className="spinner" /></div>
            ) : !clientes.data || clientes.data.length === 0 ? (
              <NoData message="Nenhum dado encontrado para este período" />
            ) : (
              <ReportTable 
                title="Clientes com Maior Volume de Compras" 
                columns={['Cliente', 'Total Pedidos', 'Valor Total']}
                data={clientes.data.map(c => [c.cliente_nome, c.total_pedidos, fmtPrice(c.valor_total)])}
              />
            )}
          </div>
        )}

        {/* ESTOQUE */}
        {activeTab === 'estoque' && (
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            {estoque.loading ? (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={32} color="#0A84FF" className="spinner" /></div>
            ) : !estoque.data ? (
              <NoData message="Dados de estoque indisponíveis" />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                  <StatCard label="Total de SKUs" value={estoque.data.total_produtos} icon={<Package size={20} />} color="#0A84FF" />
                  <StatCard label="Itens Físicos" value={estoque.data.total_itens_estoque} icon={<BarChart3 size={20} />} color="#8B5CF6" />
                  <StatCard label="Valor em Patrimônio" value={fmtPrice(estoque.data.valor_total_estoque)} icon={<DollarSign size={20} />} color="#30D158" />
                  <StatCard label="Itens com Alerta" value={estoque.data.produtos_abaixo_minimo} icon={<AlertCircle size={20} />} color="#FF453A" />
                </div>
                <ReportTable 
                  title="Listagem Detalhada de Estoque" 
                  columns={['Produto', 'Categoria', 'Estoque', 'Min', 'Preço Unit', 'Total', 'Status']}
                  data={estoque.data.produtos.map(p => ({
                    row: [p.nome, p.categoria, p.estoque, p.estoque_min, fmtPrice(p.preco), fmtPrice(p.valor_estoque), p.status],
                    critical: p.estoque <= p.estoque_min
                  }))}
                />
              </>
            )}
          </div>
        )}

        {/* FINANCEIRO */}
        {activeTab === 'financeiro' && (
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            {financeiro.loading ? (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 size={32} color="#0A84FF" className="spinner" /></div>
            ) : !financeiro.data ? (
              <NoData message="Dados financeiros indisponíveis" />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                  <StatCard label="Faturamento Total" value={fmtPrice(financeiro.data.faturamento_total)} icon={<DollarSign size={20} />} color="#30D158" />
                  <StatCard label="Ticket Médio" value={fmtPrice(financeiro.data.ticket_medio)} icon={<TrendingUp size={20} />} color="#0A84FF" />
                  <StatCard label="Volume de Pedidos" value={financeiro.data.total_pedidos} icon={<FileText size={20} />} color="#8B5CF6" />
                </div>
                <ReportTable 
                  title="Movimentação Financeira por Dia" 
                  columns={['Dia', 'Pedidos', 'Valor']}
                  data={financeiro.data.faturamento_por_dia.map(d => [fmtDate(d.dia), d.total_pedidos, fmtPrice(d.valor)])}
                  footer={['Total do Período', financeiro.data.total_pedidos, fmtPrice(financeiro.data.faturamento_total)]}
                />
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .btn-hover:hover { transform: translateY(-1px); filter: brightness(1.1); box-shadow: 0 4px 12px rgba(10,132,255,0.3); }
      `}</style>
    </div>
  );
}

// Sub-components
function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1.5px solid #DDE3EE', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '13px', color: '#8896A5', fontWeight: 600, marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#0D1B2A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</div>
      </div>
    </div>
  );
}

interface TableProps {
  title: string;
  columns: string[];
  data: (any[] | { row: any[]; critical: boolean })[];
  footer?: any[];
}

function ReportTable({ title, columns, data, footer }: TableProps) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1.5px solid #DDE3EE', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #F5F7FA', background: '#FDFDFE' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0D1B2A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F9FB' }}>
              {columns.map((c, i) => (
                <th key={i} style={{ padding: '14px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8896A5', letterSpacing: '0.5px' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => {
              const rowData = Array.isArray(item) ? item : item.row;
              const isCritical = !Array.isArray(item) && item.critical;
              return (
                <tr key={i} style={{ borderBottom: i < data.length - 1 ? '1px solid #F5F7FA' : 'none', background: isCritical ? '#FFF5F5' : 'transparent' }}>
                  {rowData.map((cell, ci) => (
                    <td key={ci} style={{ padding: '14px 24px', fontSize: '14px', color: isCritical ? '#FF453A' : '#4A5568', fontWeight: ci === 0 ? 600 : 400 }}>{cell}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          {footer && (
            <tfoot>
              <tr style={{ background: '#F8F9FA', borderTop: '2px solid #DDE3EE' }}>
                {footer.map((cell, ci) => (
                  <td key={ci} style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 800, color: '#0D1B2A' }}>{cell}</td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

function NoData({ message }: { message: string }) {
  return (
    <div style={{ padding: '80px 20px', textAlign: 'center', background: '#F9FAFB', borderRadius: '16px', border: '1.5px dashed #DDE3EE' }}>
      <FileText size={42} color="#DDE3EE" style={{ margin: '0 auto 16px' }} />
      <p style={{ margin: 0, fontSize: '15px', color: '#667085', fontWeight: 500 }}>{message}</p>
    </div>
  );
}
