import React, { useState } from 'react';
import { BarChart2, Download, TrendingUp, Calendar, FileText, Filter } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';

const vendasMensais = [
  { mes: 'Jan', vendas: 62000, pedidos: 890 },
  { mes: 'Fev', vendas: 74000, pedidos: 1020 },
  { mes: 'Mar', vendas: 84200, pedidos: 1248 },
  { mes: 'Abr', vendas: 71000, pedidos: 980 },
  { mes: 'Mai', vendas: 88000, pedidos: 1300 },
  { mes: 'Jun', vendas: 95000, pedidos: 1420 },
];

const topProdutos = [
  { nome: 'Notebook Pro 15"', vendas: 48, receita: 206352 },
  { nome: 'Monitor 27" 4K', vendas: 32, receita: 70368 },
  { nome: 'Placa de Vídeo RTX', vendas: 21, receita: 73479 },
  { nome: 'SSD 1TB NVMe', vendas: 65, receita: 32435 },
  { nome: 'Teclado Mecânico', vendas: 43, receita: 17157 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #DDE3EE', borderRadius: '10px', padding: '12px 16px', boxShadow: '0 6px 24px rgba(10,30,60,0.12)', fontFamily: "'Inter', sans-serif" }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: '#8896A5', margin: '0 0 8px', textTransform: 'uppercase' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ fontSize: '13px', fontWeight: 600, color: p.color, margin: '2px 0' }}>
            {p.name}: {p.name === 'Vendas (R$)' ? `R$ ${Number(p.value).toLocaleString('pt-BR')}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ReportsPage() {
  const [periodo, setPeriodo] = useState('6meses');

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>Relatórios</h1>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>Análises de desempenho e exportações</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select value={periodo} onChange={e => setPeriodo(e.target.value)} style={{ padding: '9px 14px', borderRadius: '9px', border: '1.5px solid #DDE3EE', background: '#fff', fontSize: '13px', color: '#4A5568', cursor: 'pointer', outline: 'none', fontFamily: "'Inter', sans-serif" }}>
            <option value="3meses">Últimos 3 meses</option>
            <option value="6meses">Últimos 6 meses</option>
            <option value="12meses">Último ano</option>
          </select>
          <button style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 14px rgba(10,132,255,0.3)' }}>
            <Download size={14} /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }} className="report-stats">
        {[
          { label: 'Receita Total', value: 'R$ 474K', change: '+28%', color: '#0A84FF' },
          { label: 'Total de Pedidos', value: '6.858', change: '+19%', color: '#30D158' },
          { label: 'Ticket Médio', value: 'R$ 374', change: '+6%', color: '#8B5CF6' },
          { label: 'Taxa Entrega', value: '97,3%', change: '+2%', color: '#FF6B35' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #DDE3EE', padding: '18px 20px', boxShadow: '0 2px 8px rgba(10,30,60,0.06)' }}>
            <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#8896A5', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 8px' }}>{s.label}</p>
            <p style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: s.color, margin: '0 0 4px' }}>{s.value}</p>
            <p style={{ fontSize: '12px', color: '#30D158', fontWeight: 600, margin: 0 }}>
              <TrendingUp size={11} style={{ marginRight: '3px', verticalAlign: 'middle' }} />
              {s.change} vs período anterior
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }} className="report-charts">
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #DDE3EE' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: 0 }}>Vendas Mensais</h3>
            <p style={{ fontSize: '12px', color: '#8896A5', margin: '2px 0 0' }}>Receita e volume de pedidos</p>
          </div>
          <div style={{ padding: '16px 8px 12px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={vendasMensais} margin={{ top: 5, right: 16, left: 0, bottom: 5 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F8" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#8896A5', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#8896A5', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={50} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#8896A5', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="vendas" name="Vendas (R$)" fill="#0A84FF" radius={[4, 4, 0, 0]} opacity={0.85} />
                <Bar yAxisId="right" dataKey="pedidos" name="Pedidos" fill="#30D158" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #DDE3EE' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: 0 }}>Tendência de Receita</h3>
            <p style={{ fontSize: '12px', color: '#8896A5', margin: '2px 0 0' }}>Crescimento ao longo dos meses</p>
          </div>
          <div style={{ padding: '16px 8px 12px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={vendasMensais} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F3F8" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#8896A5', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8896A5', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="vendas" name="Vendas (R$)" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 4, fill: '#8B5CF6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #DDE3EE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: 0 }}>Top Produtos por Receita</h3>
            <p style={{ fontSize: '12px', color: '#8896A5', margin: '2px 0 0' }}>Ranking dos mais vendidos no período</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: '#fff', fontSize: '12.5px', fontWeight: 600, color: '#4A5568', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
            <FileText size={13} /> Exportar
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F7FA' }}>
                {['Pos.', 'Produto', 'Unidades Vendidas', 'Receita Total', 'Participação'].map(h => (
                  <th key={h} style={{ padding: '11px 18px', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.9px', color: '#8896A5', textAlign: 'left', borderBottom: '1px solid #DDE3EE' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topProdutos.map((p, i) => {
                const maxRec = Math.max(...topProdutos.map(x => x.receita));
                const pct = (p.receita / maxRec * 100).toFixed(0);
                const colors = ['#0A84FF', '#30D158', '#8B5CF6', '#FF6B35', '#FFD60A'];
                return (
                  <tr key={i}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(10,132,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    style={{ transition: 'background 0.15s' }}
                  >
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                      <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: `${colors[i]}20`, color: colors[i], fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        {i + 1}
                      </span>
                    </td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '13.5px', fontWeight: 600, color: '#0D1B2A' }}>{p.nome}</td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '13px', color: '#4A5568' }}>{p.vendas} un.</td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '13px', fontWeight: 700, color: '#0D1B2A' }}>R$ {p.receita.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '6px', background: '#F0F3F8', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: colors[i], borderRadius: '99px' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: colors[i], minWidth: '32px' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .report-stats { grid-template-columns: repeat(2,1fr) !important; }
          .report-charts { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .report-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
