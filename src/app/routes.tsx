import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';

// Layouts
import { Layout } from './components/layout/Layout';
import { ClienteLayout } from './components/layout/ClienteLayout';

// Admin/Operador pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { ClientsPage } from './pages/ClientsPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { OrdersPage } from './pages/OrdersPage';
import { StockPage } from './pages/StockPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';

// Portal do Cliente
import { ProdutoDetalhesPage } from './pages/cliente/ProdutoDetalhesPage';
import { LojaPage } from './pages/cliente/LojaPage';
import { CarrinhoPage } from './pages/cliente/CarrinhoPage';
import { MeusPedidosPage } from './pages/cliente/MeusPedidosPage';

export const router = createBrowserRouter([
  // ── Rotas públicas ────────────────────────────────────────────────
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
  },

  // ── Painel Admin/Operador ─────────────────────────────────────────
  // Layout.tsx já cuida de redirecionar cliente → /loja
  {
    path: '/admin',
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'produtos', Component: ProductsPage },
      { path: 'clientes', Component: ClientsPage },
      { path: 'fornecedores', Component: SuppliersPage },
      { path: 'pedidos', Component: OrdersPage },
      { path: 'estoque', Component: StockPage },
      { path: 'relatorios', Component: ReportsPage },
      { path: 'configuracoes', Component: SettingsPage },
      { path: 'perfil', Component: ProfilePage },
    ],
  },

  // ── Portal do Cliente ─────────────────────────────────────────────
  // ClienteLayout.tsx já cuida de redirecionar admin/operador → /admin/dashboard
  {
    path: '/loja',
    Component: ClienteLayout,
    children: [
      { index: true, element: <Navigate to="/loja/catalogo" replace /> },
      { path: 'catalogo', Component: LojaPage },
      { path: 'produto/:id', Component: ProdutoDetalhesPage },
      { path: 'carrinho', Component: CarrinhoPage },
      { path: 'meus-pedidos', Component: MeusPedidosPage },
      { path: 'perfil', Component: ProfilePage },
    ],
  },

  // ── Rota Raiz (Landing Page Institucional) ────────────────────────
  {
    path: '/',
    Component: LandingPage,
  },

  // ── Rotas antigas (backward-compat) → redirect para /admin ─────────
  { path: '/dashboard', element: <Navigate to="/admin/dashboard" replace /> },
  { path: '/produtos', element: <Navigate to="/admin/produtos" replace /> },
  { path: '/clientes', element: <Navigate to="/admin/clientes" replace /> },
  { path: '/fornecedores', element: <Navigate to="/admin/fornecedores" replace /> },
  { path: '/pedidos', element: <Navigate to="/admin/pedidos" replace /> },
  { path: '/estoque', element: <Navigate to="/admin/estoque" replace /> },
  { path: '/relatorios', element: <Navigate to="/admin/relatorios" replace /> },
  { path: '/configuracoes', element: <Navigate to="/admin/configuracoes" replace /> },
  { path: '/perfil', element: <Navigate to="/admin/perfil" replace /> },
]);