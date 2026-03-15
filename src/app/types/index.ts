export interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Produto {
  id: string;
  nome: string;
  sku: string;
  categoria: string;
  preco: number;
  custo: number;
  estoque: number;
  estoqueMinimo: number;
  fornecedor: string;
  status: 'ativo' | 'inativo';
  descricao?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  cidade: string;
  estado: string;
  status: 'ativo' | 'inativo';
  totalPedidos: number;
  totalGasto: number;
  ultimaCompra: string;
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
