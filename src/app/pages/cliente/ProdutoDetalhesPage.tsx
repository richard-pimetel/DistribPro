import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ShoppingCart, Package, ArrowLeft, Star, ShieldCheck, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../../context/CartContext';
import { getProdutoById, getFornecedorById } from '../../services/api';
import type { Produto } from '../../types';

export function ProdutoDetalhesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [fornecedorNome, setFornecedorNome] = useState('DistribPro');
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getProdutoById(id!);
        if (res.success && res.data) {
          setProduto(res.data);
          
          if (res.data.fornecedor_id) {
            const fRes = await getFornecedorById(res.data.fornecedor_id);
            if (fRes.success && fRes.data) {
              setFornecedorNome(fRes.data.nome);
            }
          }
        } else {
          toast.error('Produto não encontrado.');
          navigate('/loja/catalogo');
        }
      } catch {
        toast.error('Erro ao carregar detalhes do produto.');
        navigate('/loja/catalogo');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!produto) return;
    setAdding(true);
    addItem(produto, quantidade);
    toast.success(`"${produto.nome}" adicionado ao carrinho!`);
    setTimeout(() => setAdding(false), 800);
  };

  const fmtPrice = (n: number) => `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #DDE3EE', borderTopColor: '#0A84FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!produto) return null;

  const isDisponivel = produto.status === 'Ativo' && produto.estoque > 0;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/loja/catalogo')}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#0A84FF', fontWeight: 600, fontSize: '14px', cursor: 'pointer', marginBottom: '24px' }}
      >
        <ArrowLeft size={16} /> Voltar ao catálogo
      </button>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #DDE3EE', overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}>
        
        {/* Left Side: Image / Hero */}
        <div style={{ flex: '1 1 400px', background: 'linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', minHeight: '400px' }}>
          {(produto as any).img_produtos || (produto as any).img_url ? (
            <img
              src={(produto as any).img_produtos || (produto as any).img_url}
              alt={produto.nome}
              style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain', borderRadius: '8px' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <Package size={120} color="#8896A5" style={{ opacity: 0.5 }} />
          )}
        </div>

        {/* Right Side: Details & Buy Box */}
        <div style={{ flex: '1 1 400px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#8896A5', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
            {produto.categoria}
          </div>
          
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0D1B2A', fontFamily: "'Plus Jakarta Sans', sans-serif", margin: '0 0 12px', lineHeight: 1.2 }}>
            {produto.nome}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FFD60A' }}>
              <Star size={16} fill="#FFD60A" />
              <Star size={16} fill="#FFD60A" />
              <Star size={16} fill="#FFD60A" />
              <Star size={16} fill="#FFD60A" />
              <Star size={16} fill="#FFD60A" />
            </div>
            <span style={{ fontSize: '13px', color: '#8896A5' }}>SKU: {produto.sku}</span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#8896A5', marginBottom: '4px' }}>Vendido e entregue por</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#0D1B2A', display: 'flex', alignItems: 'center', gap: '6px' }}>
               {fornecedorNome} <ShieldCheck size={16} color="#30D158" />
            </div>
          </div>

          <div style={{ background: '#F5F7FA', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#4A5568', fontWeight: 500, marginBottom: '4px' }}>Preço</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#0A84FF', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-1px' }}>
              {fmtPrice(produto.preco)} <span style={{ fontSize: '14px', fontWeight: 500, color: '#8896A5', letterSpacing: '0' }}>/ {produto.unidade}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4A5568' }}>Quantidade</label>
              <div style={{ display: 'flex', border: '1.5px solid #DDE3EE', borderRadius: '8px', overflow: 'hidden' }}>
                <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} style={{ padding: '8px 12px', border: 'none', background: '#F5F7FA', cursor: 'pointer', fontSize: '16px' }}>-</button>
                <input type="number" value={quantidade} onChange={e => setQuantidade(Math.max(1, Number(e.target.value)))} style={{ width: '50px', textAlign: 'center', border: 'none', outline: 'none', fontSize: '14px', fontWeight: 600 }} min="1" max={produto.estoque} disabled={!isDisponivel} />
                <button onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))} style={{ padding: '8px 12px', border: 'none', background: '#F5F7FA', cursor: 'pointer', fontSize: '16px' }} disabled={!isDisponivel}>+</button>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'transparent' }}>Ação</label>
              <button 
                onClick={handleAddToCart}
                disabled={!isDisponivel || adding}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', borderRadius: '8px', border: 'none',
                  background: adding ? '#30D158' : (isDisponivel ? 'linear-gradient(135deg, #0A84FF, #0060CC)' : '#DDE3EE'),
                  color: '#fff', fontSize: '15px', fontWeight: 700, cursor: isDisponivel ? 'pointer' : 'not-allowed',
                  boxShadow: isDisponivel && !adding ? '0 4px 14px rgba(10,132,255,0.3)' : 'none',
                  transition: 'all 0.2s', width: '100%'
                }}
              >
                <ShoppingCart size={18} /> {adding ? 'Adicionado!' : 'Adicionar ao Carrinho'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4A5568', fontSize: '13px', background: '#eaf4ff', padding: '12px', borderRadius: '8px' }}>
            <Truck size={18} color="#0A84FF" />
            <span>Entrega garantida pela plataforma <strong>DistribPro</strong></span>
          </div>
          
          {produto.descricao && (
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #DDE3EE' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0D1B2A', margin: '0 0 12px' }}>Descrição do Produto</h3>
              <p style={{ fontSize: '14px', color: '#4A5568', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {produto.descricao}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
