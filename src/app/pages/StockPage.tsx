import React, { useEffect, useState } from 'react';
import { getProdutos, updateProduto } from '../services/api';
import type { Produto } from '../types';
import { Badge } from '../components/ui/Badge';
import { Package, AlertTriangle, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function StockPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [ajusteId, setAjusteId] = useState<string | null>(null);
  const [ajusteQtd, setAjusteQtd] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await getProdutos();
    if (res.success) setProdutos(res.data!.filter(p => p.status === 'ativo'));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const total = produtos.reduce((s, p) => s + p.estoque, 0);
  const criticos = produtos.filter(p => p.estoque <= p.estoqueMinimo);
  const valorEstoque = produtos.reduce((s, p) => s + p.estoque * p.custo, 0);

  const handleAjuste = async (p: Produto) => {
    const qtd = ajusteQtd[p.id];
    if (qtd === undefined || isNaN(qtd)) { toast.error('Informe a quantidade.'); return; }
    setSaving(true);
    const res = await updateProduto(p.id, { estoque: Math.max(0, qtd) });
    if (res.success) { toast.success('Estoque ajustado!'); setAjusteId(null); load(); }
    else toast.error(res.error?.message);
    setSaving(false);
  };

  const getStatus = (p: Produto) => {
    if (p.estoque === 0) return { label: 'Sem Estoque', color: '#FF453A', icon: <AlertTriangle size={14} color="#FF453A" /> };
    if (p.estoque <= p.estoqueMinimo) return { label: 'Crítico', color: '#FFD60A', icon: <AlertTriangle size={14} color="#A07800" /> };
    if (p.estoque <= p.estoqueMinimo * 2) return { label: 'Baixo', color: '#FF6B35', icon: <TrendingDown size={14} color="#FF6B35" /> };
    return { label: 'Normal', color: '#30D158', icon: <CheckCircle size={14} color="#30D158" /> };
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>Estoque</h1>
        <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>Visão completa do inventário e ajuste de quantidades</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }} className="stock-stats">
        {[
          { label: 'Itens no Estoque', value: total.toLocaleString('pt-BR'), icon: <Package size={18} />, color: '#0A84FF' },
          { label: 'Produtos Críticos', value: criticos.length, icon: <AlertTriangle size={18} />, color: '#FF453A' },
          { label: 'Produtos Ativos', value: produtos.length, icon: <CheckCircle size={18} />, color: '#30D158' },
          { label: 'Valor do Estoque', value: `R$ ${(valorEstoque / 1000).toFixed(1)}K`, icon: <TrendingUp size={18} />, color: '#8B5CF6' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #DDE3EE', padding: '18px 20px', boxShadow: '0 2px 8px rgba(10,30,60,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#8896A5', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>{s.label}</p>
              <div style={{ color: s.color }}>{s.icon}</div>
            </div>
            <p style={{ fontSize: '22px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.07)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #DDE3EE', borderTopColor: '#0A84FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F7FA' }}>
                  {['Produto', 'SKU', 'Categoria', 'Estoque Atual', 'Mínimo', 'Status', 'Ajustar'].map(h => (
                    <th key={h} style={{ padding: '11px 18px', fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.9px', color: '#8896A5', textAlign: 'left', borderBottom: '1px solid #DDE3EE', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {produtos.map(p => {
                  const st = getStatus(p);
                  const pct = Math.min(100, (p.estoque / Math.max(1, p.estoqueMinimo * 3)) * 100);
                  return (
                    <tr key={p.id}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(10,132,255,0.02)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                      style={{ transition: 'background 0.15s' }}
                    >
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', background: '#F5F7FA', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #DDE3EE', flexShrink: 0 }}>
                            <Package size={14} color="#8896A5" />
                          </div>
                          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0D1B2A' }}>{p.nome}</div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '12px', color: '#4A5568', fontFamily: 'monospace' }}>{p.sku}</td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}><Badge variant="neutral">{p.categoria}</Badge></td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: st.color }}>{p.estoque} un.</div>
                        <div style={{ width: '80px', height: '4px', background: '#F0F3F8', borderRadius: '99px', marginTop: '5px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: st.color, borderRadius: '99px', transition: 'width 0.3s' }} />
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA', fontSize: '13px', color: '#4A5568' }}>{p.estoqueMinimo} un.</td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {st.icon}
                          <span style={{ fontSize: '12px', fontWeight: 600, color: st.color }}>{st.label}</span>
                        </div>
                      </td>
                      <td style={{ padding: '13px 18px', borderBottom: '1px solid #F5F7FA' }}>
                        {ajusteId === p.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="number"
                              defaultValue={p.estoque}
                              onChange={e => setAjusteQtd(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                              style={{ width: '70px', padding: '6px 8px', borderRadius: '7px', border: '1.5px solid #0A84FF', outline: 'none', fontSize: '13px', fontFamily: "'Inter', sans-serif", color: '#0D1B2A' }}
                              min={0}
                              autoFocus
                            />
                            <button onClick={() => handleAjuste(p)} disabled={saving} style={{ padding: '6px 10px', borderRadius: '7px', border: 'none', background: '#0A84FF', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                              {saving ? '…' : 'OK'}
                            </button>
                            <button onClick={() => setAjusteId(null)} style={{ padding: '6px 8px', borderRadius: '7px', border: '1.5px solid #DDE3EE', background: 'transparent', fontSize: '12px', color: '#4A5568', cursor: 'pointer' }}>✕</button>
                          </div>
                        ) : (
                          <button onClick={() => { setAjusteId(p.id); setAjusteQtd(prev => ({ ...prev, [p.id]: p.estoque })); }} style={{ padding: '6px 12px', borderRadius: '7px', border: '1.5px solid #DDE3EE', background: '#F5F7FA', fontSize: '12px', fontWeight: 600, color: '#4A5568', cursor: 'pointer', transition: 'all 0.2s' }}>
                            Ajustar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) { .stock-stats { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px) { .stock-stats { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
