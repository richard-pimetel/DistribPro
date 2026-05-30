import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Package, Star, Plus, CheckCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { getProdutos } from '../../services/api';
import type { Produto } from '../../types';
import { useCart } from '../../context/CartContext';
import { useNavigate, useSearchParams } from 'react-router';

const categorias = ['Todos', 'Eletrônicos', 'Periféricos', 'Áudio', 'Armazenamento', 'Acessórios', 'Componentes', 'Mobiliário'];

// Gradient palettes para cada categoria
const catColors: Record<string, string> = {
  'Eletrônicos': 'linear-gradient(135deg, #667eea, #764ba2)',
  'Periféricos': 'linear-gradient(135deg, #0A84FF, #3B9EFF)',
  'Áudio': 'linear-gradient(135deg, #f093fb, #f5576c)',
  'Armazenamento': 'linear-gradient(135deg, #4facfe, #00f2fe)',
  'Acessórios': 'linear-gradient(135deg, #43e97b, #38f9d7)',
  'Componentes': 'linear-gradient(135deg, #fa709a, #fee140)',
  'Mobiliário': 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
};

function ProdutoCard({ produto, fornecedorNome, onAdd, justAdded, onSelectFornecedor }: { produto: Produto; fornecedorNome: string; onAdd: () => void; justAdded: boolean; onSelectFornecedor: (id: string) => void }) {
  const fmtPrice = (n: number) => `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  const catGradient = catColors[produto.categoria] || 'linear-gradient(135deg, #8896A5, #4A5568)';
  const isDisponivel = produto.status === 'Ativo' && produto.estoque > 0;
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      border: '1px solid #DDE3EE',
      boxShadow: '0 2px 12px rgba(10,30,60,0.06)',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex', flexDirection: 'column',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(10,30,60,0.14)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(10,30,60,0.06)'; }}
    >
      {/* Product image area */}
      <div 
        onClick={() => navigate(`/loja/produto/${produto.id}`)}
        style={{
          height: '160px', background: (produto as any).img_produtos || (produto as any).img_url ? '#F5F7FA' : catGradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', flexShrink: 0, cursor: 'pointer',
          overflow: 'hidden'
        }}
      >
        {(produto as any).img_produtos || (produto as any).img_url ? (
          <img
            src={(produto as any).img_produtos || (produto as any).img_url}
            alt={produto.nome}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <Package size={52} color="rgba(255,255,255,0.9)" />
        )}
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <span style={{
            backdropFilter: 'blur(8px)',
            color: produto.img_produtos || produto.img_url ? '#0D1B2A' : '#fff',
            fontSize: '10px', fontWeight: 700,
            padding: '3px 8px', borderRadius: '6px',
            letterSpacing: '0.5px',
            background: 'rgba(255,255,255,0.85)',
          }}>
            {produto.categoria}
          </span>
        </div>
        {!isDisponivel && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px', background: 'rgba(0,0,0,0.4)', padding: '6px 14px', borderRadius: '20px' }}>
              Indisponível
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 
          onClick={() => navigate(`/loja/produto/${produto.id}`)}
          style={{ fontSize: '14px', fontWeight: 700, color: '#0D1B2A', margin: '0 0 4px', lineHeight: 1.3, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer' }}
        >
          {produto.nome}
        </h3>
        <p style={{ fontSize: '11px', color: '#8896A5', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Vendido por{' '}
          <strong 
            onClick={(e) => {
              e.stopPropagation();
              if (produto.fornecedor_id) onSelectFornecedor(String(produto.fornecedor_id));
            }}
            className="supplier-link"
            style={{ color: '#0A84FF', cursor: 'pointer', transition: 'color 0.2s' }}
          >
            {fornecedorNome || 'DistribPro'}
          </strong>
        </p>
        {produto.descricao && (
          <p style={{ fontSize: '11.5px', color: '#8896A5', margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {produto.descricao}
          </p>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#8896A5', fontWeight: 500 }}>Preço unitário</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0A84FF', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.3px' }}>
              {fmtPrice(produto.preco)}
            </div>
          </div>
          <button
            onClick={onAdd}
            disabled={!isDisponivel}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '10px', border: 'none',
              background: justAdded ? '#30D158' : (isDisponivel ? 'linear-gradient(135deg, #0A84FF, #0060CC)' : '#DDE3EE'),
              color: '#fff',
              fontSize: '13px', fontWeight: 700,
              cursor: isDisponivel ? 'pointer' : 'not-allowed',
              transition: 'all 0.25s',
              boxShadow: isDisponivel && !justAdded ? '0 4px 14px rgba(10,132,255,0.3)' : 'none',
              flexShrink: 0,
            }}
          >
            {justAdded ? <><CheckCircle size={15} /> Adicionado!</> : <><Plus size={15} /> Adicionar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LojaPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todos');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem, totalItems } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetFornecedor = searchParams.get('fornecedor_id');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { getProdutos, getFornecedores } = await import('../../services/api');
        const [res, fRes] = await Promise.all([getProdutos(), getFornecedores()]);
        if (fRes.success && fRes.data) setFornecedores(fRes.data);
        if (res.success && res.data) {
          // Clientes só veem produtos ativos — nunca expostos inativos
          const ativos = res.data.filter(p => p.status === 'Ativo');
          setProdutos(ativos);
        }
      } catch {
        toast.error('Erro ao carregar catálogo.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = produtos.filter(p => {
    const matchSearch = !search || p.nome.toLowerCase().includes(search.toLowerCase()) || (p.descricao || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'Todos' || p.categoria === catFilter;
    const matchForn = !targetFornecedor || String(p.fornecedor_id) === String(targetFornecedor);
    return matchSearch && matchCat && matchForn;
  });

  const currentFornecedorObj = fornecedores.find(f => String(f.id) === String(targetFornecedor));

  const handleAdd = (produto: Produto) => {
    addItem(produto, 1);
    const id = String(produto.id);
    setAddedIds(prev => new Set([...prev, id]));
    toast.success(`"${produto.nome}" adicionado ao carrinho!`, { duration: 2000 });
    setTimeout(() => setAddedIds(prev => { const s = new Set(prev); s.delete(id); return s; }), 2000);
  };

  const handleSelectFornecedor = (id: string) => {
    setSearchParams({ fornecedor_id: id });
  };

  const handleClearSupplierFilter = () => {
    setSearchParams({});
  };

  return (
    <div>
      {/* Fornecedor Banner (se selecionado) */}
      {currentFornecedorObj ? (
        <div style={{
          background: 'linear-gradient(135deg, #0A84FF, #0060CC)',
          borderRadius: '16px',
          padding: '24px',
          color: '#fff',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(10,132,255,0.2)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Background decoration */}
          <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', opacity: 0.15 }}>
            <Package size={160} color="#fff" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ background: 'rgba(255,255,255,0.22)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', padding: '4px 10px', borderRadius: '20px' }}>
              Catálogo Exclusivo do Fornecedor
            </span>
          </div>

          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {currentFornecedorObj.nome}
            </h2>
            <p style={{ fontSize: '13.5px', opacity: 0.9, margin: 0, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span>📍 {currentFornecedorObj.cidade} - {currentFornecedorObj.estado}</span>
              <span>🏷️ {currentFornecedorObj.categoria}</span>
              <span>⏱️ Prazo: {currentFornecedorObj.prazo} dias</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px', zIndex: 1 }}>
            <button
              onClick={handleClearSupplierFilter}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                background: '#fff',
                color: '#0A84FF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              Ver Todos os Fornecedores
            </button>
          </div>
        </div>
      ) : (
        /* Header Normal */
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: '0 0 4px' }}>
            Catálogo de Produtos
          </h1>
          <p style={{ fontSize: '13.5px', color: '#8896A5', margin: 0 }}>
            {filtered.length} produto(s) disponível(eis) para distribuição
          </p>
        </div>
      )}

      {/* Search + Cart CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', border: '1.5px solid #DDE3EE', borderRadius: '12px', padding: '10px 16px', boxShadow: '0 2px 8px rgba(10,30,60,0.05)' }}>
          <Search size={16} color="#8896A5" />
          <input
            placeholder="Buscar produtos…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13.5px', color: '#0D1B2A', width: '100%', fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        {/* Dropdown de Fornecedores */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid #DDE3EE', borderRadius: '12px', padding: '8px 14px', boxShadow: '0 2px 8px rgba(10,30,60,0.05)' }}>
          <Filter size={14} color="#8896A5" />
          <select
            value={targetFornecedor || ''}
            onChange={e => {
              const val = e.target.value;
              if (val) {
                handleSelectFornecedor(val);
              } else {
                handleClearSupplierFilter();
              }
            }}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13.5px',
              color: '#4A5568',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <option value="">Todos os Fornecedores</option>
            {fornecedores.map(f => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        </div>

        {totalItems > 0 && (
          <button
            onClick={() => navigate('/loja/carrinho')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0A84FF, #0060CC)', color: '#fff', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(10,132,255,0.35)', flexShrink: 0 }}
          >
            <ShoppingCart size={16} />
            Ver Carrinho ({totalItems})
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            style={{
              padding: '7px 16px', borderRadius: '20px', border: '1.5px solid',
              borderColor: catFilter === cat ? '#0A84FF' : '#DDE3EE',
              background: catFilter === cat ? '#0A84FF' : '#fff',
              color: catFilter === cat ? '#fff' : '#4A5568',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #DDE3EE', height: '300px', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <Package size={56} color="#DDE3EE" style={{ display: 'block', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#4A5568', margin: '0 0 8px' }}>Nenhum produto encontrado</p>
          <p style={{ fontSize: '13px', color: '#8896A5', margin: '0 0 20px' }}>Tente ajustar os filtros ou a busca.</p>
          <button onClick={() => { setSearch(''); setCatFilter('Todos'); handleClearSupplierFilter(); }} style={{ padding: '10px 22px', borderRadius: '10px', border: '1.5px solid #DDE3EE', background: '#fff', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, color: '#4A5568' }}>
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }} className="catalogo-grid">
          {filtered.map(p => {
            const fornecedor = fornecedores.find(f => String(f.id) === String(p.fornecedor_id));
            return (
              <ProdutoCard
                key={p.id}
                produto={p}
                fornecedorNome={fornecedor?.nome || 'DistribPro'}
                onAdd={() => handleAdd(p)}
                justAdded={addedIds.has(String(p.id))}
                onSelectFornecedor={handleSelectFornecedor}
              />
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 560px) {
          .catalogo-grid { grid-template-columns: 1fr !important; }
        }
        .supplier-link:hover {
          text-decoration: underline;
          color: #0060CC !important;
        }
      `}</style>
    </div>
  );
}
