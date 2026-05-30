import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ShoppingCart, Trash2, Plus, Minus, Package, ArrowLeft, CheckCircle, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createPedido } from '../../services/api';

export function CarrinhoPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [destino, setDestino] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [obs, setObs] = useState('');
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'cart' | 'success'>('cart');
  const [pedidoId, setPedidoId] = useState<number | string | null>(null);

  const fmt = (n: number) => `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const handleFinalize = async () => {
    if (!destino.trim()) { toast.error('Informe o endereço de entrega.'); return; }
    if (!dataEntrega) { toast.error('Informe a data de entrega desejada.'); return; }
    if (!termosAceitos) { toast.error('Você deve aceitar os Termos e Condições para prosseguir.'); return; }
    if (items.length === 0) { toast.error('Seu carrinho está vazio.'); return; }

    setLoading(true);
    try {
      const targetClientId = user?.clienteId || user?.id;

      const groups = items.reduce((acc, item) => {
        const fId = item.produto.fornecedor_id;
        if (!acc[fId]) acc[fId] = [];
        acc[fId].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      let lastId: number | string | null = null;
      for (const [fId, groupItems] of Object.entries(groups)) {
        const valorTotalGrupo = groupItems.reduce((acc, i) => acc + (i.produto.preco * i.quantidade), 0);
        
        const payload = {
          clienteId: Number(targetClientId),
          cliente_id: Number(targetClientId),
          fornecedor_id: Number(fId),
          destino: destino.trim(),
          data_entrega: dataEntrega,
          observacoes: obs.trim() || '',
          obs: obs.trim() || '',
          produtos: groupItems.map(i => ({
            produto_id: Number(i.produto.id),
            quantidade: i.quantidade,
            preco_unitario: i.produto.preco
          })),
          itens: groupItems.map(i => ({
            produtoId: Number(i.produto.id),
            produto_id: Number(i.produto.id),
            quantidade: i.quantidade,
            qtd: i.quantidade,
            valorUnitario: i.produto.preco,
            preco: i.produto.preco,
            nome_produto: i.produto.nome,
          })),
          taxas_aplicadas: {
            fornecedor_percentual: groupItems[0]?.produto.taxa_fornecedor ?? 90,
            operador_percentual: groupItems[0]?.produto.taxa_operador ?? 10,
          },
          valorTotal: valorTotalGrupo,
          valor_total: valorTotalGrupo,
          status: 'Pendente',
        };

        const res = await createPedido(payload);
        if (!res.success) {
          toast.error(`Erro ao criar pedido para o fornecedor: ${res.error?.message || 'Tente novamente.'}`);
          return;
        }
        lastId = res.data?.id ?? null;
      }

      clearCart();
      setPedidoId(lastId);
      setStep('success');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Tela de Sucesso
  if (step === 'success') {
    return (
      <div style={{ maxWidth: '560px', margin: '60px auto', textAlign: 'center' }}>
        <div style={{
          width: '80px', height: '80px',
          background: 'linear-gradient(135deg, #30D158, #00A041)',
          borderRadius: '50%', margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(48,209,88,0.35)',
          animation: 'popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        }}>
          <CheckCircle size={40} color="#fff" />
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 12px' }}>
          Pedido Realizado!
        </h1>
        <p style={{ fontSize: '14px', color: '#8896A5', margin: '0 0 8px', lineHeight: 1.6 }}>
          Sua solicitação foi enviada com sucesso. Nossa equipe irá processá-la em breve.
        </p>
        {pedidoId && (
          <p style={{ fontSize: '13px', color: '#0A84FF', margin: '0 0 32px', fontWeight: 600 }}>
            Último pedido: #{pedidoId}
          </p>
        )}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/loja/meus-pedidos')}
            style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(10,132,255,0.3)' }}
          >
            Ver Meus Pedidos
          </button>
          <button
            onClick={() => navigate('/loja/catalogo')}
            style={{ padding: '12px 24px', borderRadius: '12px', border: '1.5px solid #DDE3EE', background: '#fff', color: '#4A5568', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Continuar Comprando
          </button>
        </div>
        <style>{`@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
      </div>
    );
  }

  // Carrinho vazio
  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '560px', margin: '60px auto', textAlign: 'center' }}>
        <ShoppingCart size={64} color="#DDE3EE" style={{ display: 'block', margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0D1B2A', margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Seu carrinho está vazio
        </h2>
        <p style={{ fontSize: '13.5px', color: '#8896A5', margin: '0 0 24px' }}>
          Adicione produtos do catálogo para fazer sua solicitação.
        </p>
        <button
          onClick={() => navigate('/loja/catalogo')}
          style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(10,132,255,0.3)' }}
        >
          Explorar Catálogo
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <button onClick={() => navigate(-1)} style={{ width: '36px', height: '36px', borderRadius: '9px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568' }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: 0 }}>
            Meu Carrinho
          </h1>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: 0 }}>{totalItems} item(ns) · {fmt(totalPrice)}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }} className="cart-grid">

        {/* Items */}
        <div>
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #DDE3EE' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0D1B2A', margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Itens do Pedido
              </h2>
            </div>
            {items.map((item, i) => (
              <div key={item.produto.id} style={{
                padding: '18px 24px',
                borderBottom: i < items.length - 1 ? '1px solid #F5F7FA' : 'none',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                {/* Icon */}
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package size={22} color="rgba(255,255,255,0.9)" />
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0D1B2A', marginBottom: '2px' }}>{item.produto.nome}</div>
                  <div style={{ fontSize: '12px', color: '#8896A5' }}>{item.produto.categoria} · {fmt(item.produto.preco)} / un.</div>
                </div>
                {/* Quantity control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => updateQuantity(item.produto.id, item.quantidade - 1)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: '#F5F7FA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568' }}>
                    <Minus size={13} />
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0D1B2A', minWidth: '24px', textAlign: 'center' }}>{item.quantidade}</span>
                  <button onClick={() => updateQuantity(item.produto.id, item.quantidade + 1)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid #DDE3EE', background: '#F5F7FA', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5568' }}>
                    <Plus size={13} />
                  </button>
                </div>
                {/* Subtotal */}
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0A84FF', minWidth: '100px', textAlign: 'right', flexShrink: 0 }}>
                  {fmt(item.produto.preco * item.quantidade)}
                </div>
                {/* Remove */}
                <button onClick={() => removeItem(item.produto.id)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: 'rgba(255,69,58,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF453A', flexShrink: 0 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Delivery info */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.06)', padding: '20px 22px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0D1B2A', margin: '0 0 16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Dados de Entrega
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#4A5568', marginBottom: '6px' }}>
                  <MapPin size={13} /> Endereço de Entrega *
                </label>
                <input
                  value={destino}
                  onChange={e => setDestino(e.target.value)}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '9px', border: '1.5px solid #DDE3EE', fontSize: '13.5px', color: '#0D1B2A', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#0A84FF'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#DDE3EE'}
                />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#4A5568', marginBottom: '6px' }}>
                  <Calendar size={13} /> Data de Entrega Desejada *
                </label>
                <input
                  type="date"
                  value={dataEntrega}
                  onChange={e => setDataEntrega(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '9px', border: '1.5px solid #DDE3EE', fontSize: '13.5px', color: '#0D1B2A', outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#0A84FF'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#DDE3EE'}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#4A5568', marginBottom: '6px', display: 'block' }}>
                  Observações (opcional)
                </label>
                <textarea
                  value={obs}
                  onChange={e => setObs(e.target.value)}
                  placeholder="Instruções especiais para entrega, horário preferencial…"
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '9px', border: '1.5px solid #DDE3EE', fontSize: '13px', color: '#0D1B2A', outline: 'none', fontFamily: "'Inter', sans-serif", resize: 'vertical', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target as HTMLElement).style.borderColor = '#0A84FF'}
                  onBlur={e => (e.target as HTMLElement).style.borderColor = '#DDE3EE'}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input 
                  type="checkbox" 
                  id="termos" 
                  checked={termosAceitos} 
                  onChange={e => setTermosAceitos(e.target.checked)} 
                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#0A84FF' }} 
                />
                <label htmlFor="termos" style={{ fontSize: '13px', color: '#4A5568', cursor: 'pointer', userSelect: 'none' }}>
                  Li e aceito os <span style={{ color: '#0A84FF', textDecoration: 'underline' }}>Termos e Condições</span> do Marketplace e dos Fornecedores.
                </label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #DDE3EE', boxShadow: '0 2px 12px rgba(10,30,60,0.06)', padding: '20px 22px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0D1B2A', margin: '0 0 14px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Resumo
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {items.map(item => (
                <div key={item.produto.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#4A5568' }}>{item.produto.nome} (x{item.quantidade})</span>
                  <span style={{ fontWeight: 600, color: '#0D1B2A' }}>{fmt(item.produto.preco * item.quantidade)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #DDE3EE', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0D1B2A' }}>Total</span>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#0A84FF', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.3px' }}>{fmt(totalPrice)}</span>
            </div>

            <button
              onClick={handleFinalize}
              disabled={loading}
              style={{
                width: '100%', marginTop: '16px',
                padding: '14px', borderRadius: '12px', border: 'none',
                background: loading ? '#DDE3EE' : 'linear-gradient(135deg, #0A84FF, #0060CC)',
                color: '#fff', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(10,132,255,0.35)',
                transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
              }}
            >
              {loading ? 'Processando…' : '✓ Finalizar Pedido'}
            </button>
            <button
              onClick={() => navigate('/loja/catalogo')}
              style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '10px', border: '1.5px solid #DDE3EE', background: 'transparent', color: '#4A5568', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}
            >
              ← Continuar Comprando
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .cart-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
