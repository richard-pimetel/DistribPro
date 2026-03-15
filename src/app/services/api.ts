import type { ApiResponse, Produto, Cliente, Fornecedor, Pedido, KPIs, EntregaData, StatusPedidoData, Config } from '../types';
import { httpClient } from './httpClient';
import {
  mockKPIs, mockEntregas, mockStatusPedidos,
  mockProdutos, mockClientes, mockFornecedores,
  mockPedidos, mockConfig
} from './mockData';

// ── AUTH (real API) ──────────────────────────────────────
export { authLogin, authLogout, authMe, authUpdatePerfil, authUpdateSenha } from './authService';

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

// ── DASHBOARD ─────────────────────────────────────────────
export const getDashboardKPIs = async (): Promise<ApiResponse<KPIs>> => {
  await delay(400);
  return { success: true, data: mockKPIs };
};

export const getDashboardEntregas = async (_dias: number): Promise<ApiResponse<EntregaData[]>> => {
  await delay(400);
  return { success: true, data: mockEntregas };
};

export const getDashboardStatus = async (): Promise<ApiResponse<StatusPedidoData[]>> => {
  await delay(400);
  return { success: true, data: mockStatusPedidos };
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

// ── FORNECEDORES ──────────────────────────────────────────
let fornecedores = [...mockFornecedores];

export const getFornecedores = async (): Promise<ApiResponse<Fornecedor[]>> => {
  await delay(400);
  return { success: true, data: [...fornecedores] };
};

export const createFornecedor = async (data: Omit<Fornecedor, 'id'>): Promise<ApiResponse<Fornecedor>> => {
  await delay(500);
  const novo = { ...data, id: `f${Date.now()}` };
  fornecedores = [novo, ...fornecedores];
  return { success: true, data: novo };
};

export const updateFornecedor = async (id: string, data: Partial<Fornecedor>): Promise<ApiResponse<Fornecedor>> => {
  await delay(500);
  fornecedores = fornecedores.map(f => f.id === id ? { ...f, ...data } : f);
  const updated = fornecedores.find(f => f.id === id)!;
  return { success: true, data: updated };
};

export const deleteFornecedor = async (id: string): Promise<ApiResponse<null>> => {
  await delay(400);
  fornecedores = fornecedores.filter(f => f.id !== id);
  return { success: true, data: null };
};

// ── PEDIDOS ───────────────────────────────────────────────
let pedidos = [...mockPedidos];

export const getPedidos = async (): Promise<ApiResponse<Pedido[]>> => {
  await delay(400);
  return { success: true, data: [...pedidos] };
};

export const getPedidosRecentes = async (): Promise<ApiResponse<Pedido[]>> => {
  await delay(300);
  return { success: true, data: pedidos.slice(0, 5) };
};

export const createPedido = async (data: Omit<Pedido, 'id'>): Promise<ApiResponse<Pedido>> => {
  await delay(600);
  const novo = { ...data, id: `o${Date.now()}` };
  pedidos = [novo, ...pedidos];
  return { success: true, data: novo };
};

export const updatePedidoStatus = async (id: string, status: Pedido['status']): Promise<ApiResponse<Pedido>> => {
  await delay(400);
  pedidos = pedidos.map(p => p.id === id ? { ...p, status } : p);
  const updated = pedidos.find(p => p.id === id)!;
  return { success: true, data: updated };
};

export const deletePedido = async (id: string): Promise<ApiResponse<null>> => {
  await delay(400);
  pedidos = pedidos.filter(p => p.id !== id);
  return { success: true, data: null };
};

// ── CONFIG ────────────────────────────────────────────────
let config = { ...mockConfig };

export const getConfig = async (): Promise<ApiResponse<Config>> => {
  await delay(300);
  return { success: true, data: { ...config } };
};

export const updateConfig = async (data: Partial<Config>): Promise<ApiResponse<Config>> => {
  await delay(500);
  config = { ...config, ...data };
  return { success: true, data: { ...config } };
};
