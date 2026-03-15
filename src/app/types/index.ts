export interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  avatar?: string;
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
  fornecedor_id: number;
  status: 'Ativo' | 'Inativo';
  descricao?: string;
  criado_em?: string;
  atualizado_em?: string;
  // Optional field kept for compatibility if needed, but not in main backend docs
  custo?: number;
  fornecedor?: string; // Kept for UI display convenience if mapped from ID
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
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  cidade: string;
  estado: string;
  categoria: string;
  status: 'ativo' | 'inativo';
  totalProdutos: number;
  contato: string;
}

export interface PedidoItem {
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  preco: number;
}

export interface Pedido {
  id: string;
  numero: string;
  clienteId: string;
  clienteNome: string;
  data: string;
  prazoEntrega: string;
  status: 'pendente' | 'confirmado' | 'em_transito' | 'entregue' | 'cancelado';
  total: number;
  itens: PedidoItem[];
}

export interface KPIs {
  receita: number;
  receitaVariacao: number;
  pedidos: number;
  pedidosVariacao: number;
  clientes: number;
  clientesVariacao: number;
  ticketMedio: number;
  ticketMedioVariacao: number;
}

export interface EntregaData {
  dia: string;
  entregas: number;
  vendas: number;
}

export interface StatusPedidoData {
  status: string;
  label: string;
  count: number;
  color: string;
}

export interface Config {
  nomeEmpresa: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  website: string;
  logo?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
