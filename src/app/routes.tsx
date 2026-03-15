import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/layout/Layout';
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

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
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
]);