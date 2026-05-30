export interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  avatar?: string;
  clienteId?: number | string;
  fornecedor_id?: number | string;
}

export interface EstoqueItem {
  id: number;
  nome: string;
  categoria: string;
  estoque: number;
  estoque_min: number;
  status: string;
}

export interface Produto {
  id: number | string;
  nome: string;
  sku: string;
  categoria: string;
  unidade: string;
  preco: number;
  estoque: number;
  estoque_min: number;
  fornecedor_id: string | number; // Administrador/Fornecedor responsável
  taxa_fornecedor?: number; // % que vai para o fornecedor
  taxa_operador?: number;   // % que fica com a plataforma
  status: 'Ativo' | 'Inativo';
  descricao?: string;
  img_url?: string;          // campo auxiliar para URL de imagem (frontend)
  img_produtos?: string;     // campo do banco de dados (backend)
  criado_em?: string;
  atualizado_em?: string;
  custo?: number;
  fornecedor?: string;
}

export interface Cliente {
  id: number | string;
  nome: string;
  tipo: 'PF' | 'PJ';
  doc: string;
  email: string;
  tel: string;
  cidade: string;
  estado: string;
  limite: number;
  status: 'Ativo' | 'Inativo';
  criado_em?: string;
  atualizado_em?: string;
  // Optional fields kept for UI compatibility if needed
  totalPedidos?: number;
  totalGasto?: number;
  ultimaCompra?: string;
}

export interface Fornecedor {
  id: number | string;
  nome: string;
  email: string;
  tel: string;
  cnpj: string;
  cidade: string;
  estado: string;
  categoria: string;
  prazo: number;
  status: 'Ativo' | 'Inativo';
  contato: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface Pedido {
  id: number | string;
  cliente_id: string | number;
  cliente_nome: string;
  produto_id: string | number;
  produto_nome: string;
  fornecedor_id?: string | number; // Dono do produto
  qtd: number;
  valor: number;
  taxa_fornecedor?: number;
  taxa_operador?: number;
  destino: string;
  data_entrega: string;
  status: 'Pendente' | 'Confirmado' | 'Em Rota' | 'Entregue' | 'Cancelado';
  status_pagamento?: 'Pendente' | 'Aprovado' | 'Recusado';
  obs?: string;
  criado_em?: string;
  atualizado_em?: string;
  total?: number;
  valor_total?: number;
  valorTotal?: number;
}

export interface KPIs {
  total_produtos: number;
  total_clientes: number;
  total_fornecedores: number;
  pedidos_pendentes: number;
  pedidos_em_rota: number;
  faturamento_total: number;
  estoque_baixo?: number;
  lucro_liquido?: number;
  comissao_plataforma?: number;
}

export interface EntregaData {
  dia: string;
  total: number;
}

export interface StatusPedidoData {
  status: string;
  total: number;
  // UI helper fields (if needed, but usually derived in component)
  label?: string;
  color?: string;
}

export interface Config {
  id?: number;
  razao_social: string;
  cnpj: string;
  email: string;
  tel: string;
  endereco: string;
  atualizado_em?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// ── RELATÓRIOS ──────────────────────────────────────────

export interface RelatorioVendas {
  total_pedidos: number;
  total_itens: number;
  valor_total: number;
  periodo: { inicio: string; fim: string };
  pedidos_por_status: {
    status: string;
    total: number;
    valor: number;
  }[];
}

export interface RelatorioVendasProduto {
  produto_id: number;
  produto_nome: string;
  qtd_vendida: number;
  valor_total: number;
}

export interface RelatorioVendasCliente {
  cliente_id: number;
  cliente_nome: string;
  total_pedidos: number;
  valor_total: number;
}

export interface RelatorioEstoque {
  total_produtos: number;
  total_itens_estoque: number;
  valor_total_estoque: number;
  produtos_abaixo_minimo: number;
  produtos: {
    id: number;
    nome: string;
    categoria: string;
    estoque: number;
    estoque_min: number;
    preco: number;
    valor_estoque: number;
    status: string;
  }[];
}

export interface RelatorioFinanceiro {
  faturamento_total: number;
  ticket_medio: number;
  total_pedidos: number;
  periodo: { inicio: string; fim: string };
  faturamento_por_dia: {
    dia: string;
    total_pedidos: number;
    valor: number;
  }[];
}
