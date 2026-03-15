import type { ApiResponse, Produto, Cliente, Fornecedor, Pedido, EstoqueItem, KPIs, EntregaData, StatusPedidoData, Config } from '../types';
import { httpClient } from './httpClient';
import {
  mockKPIs, mockEntregas, mockStatusPedidos,
  mockProdutos, mockClientes, mockFornecedores,
  mockPedidos, mockConfig
} from './mockData';

// ── AUTH (real API) ──────────────────────────────────────
export { authLogin, authLogout, authMe, authUpdatePerfil, authUpdateSenha } from './authService';

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

// ── DASHBOARD (real API) ──────────────────────────────────
export const getDashboardKPIs = async (): Promise<ApiResponse<KPIs>> => {
  return httpClient.get<ApiResponse<KPIs>>('/dashboard/kpis');
};

export const getDashboardEntregas = async (dias: number = 7): Promise<ApiResponse<EntregaData[]>> => {
  return httpClient.get<ApiResponse<EntregaData[]>>(`/dashboard/entregas?dias=${dias}`);
};

export const getDashboardStatus = async (): Promise<ApiResponse<StatusPedidoData[]>> => {
  return httpClient.get<ApiResponse<StatusPedidoData[]>>('/dashboard/status-pedidos');
};

// ── PRODUTOS (real API) ──────────────────────────────────
export const getProdutos = async (): Promise<ApiResponse<Produto[]>> => {
  return httpClient.get<ApiResponse<Produto[]>>('/produtos');
};

export const getProdutoById = async (id: number | string): Promise<ApiResponse<Produto>> => {
  return httpClient.get<ApiResponse<Produto>>(`/produtos/${id}`);
};

export const getProdutosEstoqueBaixo = async (): Promise<ApiResponse<Produto[]>> => {
  return httpClient.get<ApiResponse<Produto[]>>('/produtos/estoque-baixo');
};

export const createProduto = async (data: Omit<Produto, 'id' | 'criado_em' | 'atualizado_em'>): Promise<ApiResponse<Produto>> => {
  return httpClient.post<ApiResponse<Produto>>('/produtos', data);
};

export const updateProduto = async (id: number | string, data: Partial<Produto>): Promise<ApiResponse<Produto>> => {
  return httpClient.put<ApiResponse<Produto>>(`/produtos/${id}`, data);
};

export const patchProduto = async (id: number | string, data: Partial<Produto>): Promise<ApiResponse<Produto>> => {
  return httpClient.patch<ApiResponse<Produto>>(`/produtos/${id}`, data);
};

export const deleteProduto = async (id: number | string): Promise<ApiResponse<null>> => {
  return httpClient.del<ApiResponse<null>>(`/produtos/${id}`);
};

// ── CLIENTES (real API) ──────────────────────────────────
export const getClientes = async (): Promise<ApiResponse<Cliente[]>> => {
  return httpClient.get<ApiResponse<Cliente[]>>('/clientes');
};

export const getClienteById = async (id: number | string): Promise<ApiResponse<Cliente>> => {
  return httpClient.get<ApiResponse<Cliente>>(`/clientes/${id}`);
};

export const createCliente = async (data: Omit<Cliente, 'id' | 'criado_em' | 'atualizado_em'>): Promise<ApiResponse<Cliente>> => {
  return httpClient.post<ApiResponse<Cliente>>('/clientes', data);
};

export const updateCliente = async (id: number | string, data: Partial<Cliente>): Promise<ApiResponse<Cliente>> => {
  return httpClient.put<ApiResponse<Cliente>>(`/clientes/${id}`, data);
};

export const deleteCliente = async (id: number | string): Promise<ApiResponse<null>> => {
  return httpClient.del<ApiResponse<null>>(`/clientes/${id}`);
};

// ── FORNECEDORES (real API) ───────────────────────────
export const getFornecedores = async (): Promise<ApiResponse<Fornecedor[]>> => {
  return httpClient.get<ApiResponse<Fornecedor[]>>('/fornecedores');
};

export const getFornecedorById = async (id: number | string): Promise<ApiResponse<Fornecedor>> => {
  return httpClient.get<ApiResponse<Fornecedor>>(`/fornecedores/${id}`);
};

export const createFornecedor = async (data: Omit<Fornecedor, 'id' | 'criado_em' | 'atualizado_em'>): Promise<ApiResponse<Fornecedor>> => {
  return httpClient.post<ApiResponse<Fornecedor>>('/fornecedores', data);
};

export const updateFornecedor = async (id: number | string, data: Partial<Fornecedor>): Promise<ApiResponse<Fornecedor>> => {
  return httpClient.put<ApiResponse<Fornecedor>>(`/fornecedores/${id}`, data);
};

export const deleteFornecedor = async (id: number | string): Promise<ApiResponse<null>> => {
  return httpClient.del<ApiResponse<null>>(`/fornecedores/${id}`);
};

// ── PEDIDOS (real API) ──────────────────────────────────
export const getPedidos = async (): Promise<ApiResponse<Pedido[]>> => {
  return httpClient.get<ApiResponse<Pedido[]>>('/pedidos');
};

export const getPedidosRecentes = async (): Promise<ApiResponse<Pedido[]>> => {
  return httpClient.get<ApiResponse<Pedido[]>>('/pedidos/recentes');
};

export const getPedidoById = async (id: number | string): Promise<ApiResponse<Pedido>> => {
  return httpClient.get<ApiResponse<Pedido>>(`/pedidos/${id}`);
};

export const createPedido = async (data: any): Promise<ApiResponse<Pedido>> => {
  return httpClient.post<ApiResponse<Pedido>>('/pedidos', data);
};

export const updatePedido = async (id: number | string, data: any): Promise<ApiResponse<Pedido>> => {
  return httpClient.put<ApiResponse<Pedido>>(`/pedidos/${id}`, data);
};

export const patchPedidoStatus = async (id: number | string, status: string): Promise<ApiResponse<Pedido>> => {
  return httpClient.patch<ApiResponse<Pedido>>(`/pedidos/${id}/status`, { status });
};

export const deletePedido = async (id: number | string): Promise<ApiResponse<null>> => {
  return httpClient.del<ApiResponse<null>>(`/pedidos/${id}`);
};

export const updatePedidoStatus = patchPedidoStatus;

// ── ESTOQUE (real API) ──────────────────────────────────
export const getEstoque = async (): Promise<ApiResponse<EstoqueItem[]>> => {
  return httpClient.get<ApiResponse<EstoqueItem[]>>('/estoque');
};

export const patchEstoque = async (id: number | string, data: { estoque: number }): Promise<ApiResponse<EstoqueItem>> => {
  return httpClient.patch<ApiResponse<EstoqueItem>>(`/estoque/${id}`, data);
};

// ── CONFIG ────────────────────────────────────────────────
export const getConfig = async (): Promise<ApiResponse<Config | null>> => {
  return httpClient.get<ApiResponse<Config | null>>('/config');
};

export const updateConfig = async (data: Config): Promise<ApiResponse<Config>> => {
  return httpClient.put<ApiResponse<Config>>('/config', data);
};
