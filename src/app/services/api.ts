import type { ApiResponse, Produto, Cliente, Fornecedor, Pedido, KPIs, EntregaData, StatusPedidoData, Config } from '../types';
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

// ── PRODUTOS ──────────────────────────────────────────────
let produtos = [...mockProdutos];

export const getProdutos = async (): Promise<ApiResponse<Produto[]>> => {
  await delay(400);
  return { success: true, data: [...produtos] };
};

export const getProdutosEstoqueBaixo = async (): Promise<ApiResponse<Produto[]>> => {
  await delay(300);
  return { success: true, data: produtos.filter(p => p.estoque <= p.estoqueMinimo) };
};

export const createProduto = async (data: Omit<Produto, 'id'>): Promise<ApiResponse<Produto>> => {
  await delay(500);
  const novo = { ...data, id: `p${Date.now()}` };
  produtos = [novo, ...produtos];
  return { success: true, data: novo };
};

export const updateProduto = async (id: string, data: Partial<Produto>): Promise<ApiResponse<Produto>> => {
  await delay(500);
  produtos = produtos.map(p => p.id === id ? { ...p, ...data } : p);
  const updated = produtos.find(p => p.id === id)!;
  return { success: true, data: updated };
};

export const deleteProduto = async (id: string): Promise<ApiResponse<null>> => {
  await delay(400);
  produtos = produtos.filter(p => p.id !== id);
  return { success: true, data: null };
};

// ── CLIENTES ──────────────────────────────────────────────
let clientes = [...mockClientes];

export const getClientes = async (): Promise<ApiResponse<Cliente[]>> => {
  await delay(400);
  return { success: true, data: [...clientes] };
};

export const createCliente = async (data: Omit<Cliente, 'id'>): Promise<ApiResponse<Cliente>> => {
  await delay(500);
  const novo = { ...data, id: `c${Date.now()}` };
  clientes = [novo, ...clientes];
  return { success: true, data: novo };
};

export const updateCliente = async (id: string, data: Partial<Cliente>): Promise<ApiResponse<Cliente>> => {
  await delay(500);
  clientes = clientes.map(c => c.id === id ? { ...c, ...data } : c);
  const updated = clientes.find(c => c.id === id)!;
  return { success: true, data: updated };
};

export const deleteCliente = async (id: string): Promise<ApiResponse<null>> => {
  await delay(400);
  clientes = clientes.filter(c => c.id !== id);
  return { success: true, data: null };
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
