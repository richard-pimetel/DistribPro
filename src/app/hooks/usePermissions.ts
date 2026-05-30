import { useAuth } from '../context/AuthContext';

export type UserRole = 'admin' | 'operador' | 'cliente';

/**
 * usePermissions — Fonte única de verdade para controle de acesso no frontend.
 * - Operador: Dono da plataforma, acesso global a tudo.
 * - Admin: Fornecedor, acesso restrito apenas aos seus próprios produtos/pedidos.
 * - Cliente: Comprador, apenas portal /loja.
 */
export function usePermissions() {
  const { user } = useAuth();

  const role = (user?.role?.toLowerCase() ?? '') as UserRole;

  // Papéis Base
  const isOperador = role === 'operador';
  const isAdmin = role === 'admin';
  const isCliente = role === 'cliente';
  const isAdminOrOperador = isAdmin || isOperador;

  // Permissões
  // O Operador gerencia globalmente. O Admin (Fornecedor) gerencia apenas O SEU (a lógica de filtragem vai nas páginas).
  const canManageProdutos = isAdmin || isOperador;
  const canManageEstoque = isAdmin || isOperador;
  const canManagePedidos = isAdmin || isOperador;

  // Apenas o Operador pode gerenciar a plataforma globalmente (Fornecedores e Configs)
  const canManageFornecedores = isOperador;
  const canManageClientes = isOperador;
  const canManageEmpresa = isOperador;
  const canAccessConfiguracoes = isOperador;

  // Relatórios: Operador vê global, Fornecedor vê local
  const canViewRelatorios = isAdmin || isOperador;

  return {
    role,
    isAdmin,
    isOperador,
    isCliente,
    isAdminOrOperador,
    canManageProdutos,
    canManageClientes,
    canManageFornecedores,
    canManageEstoque,
    canViewRelatorios,
    canManageEmpresa,
    canManagePedidos,
    canAccessConfiguracoes,
  };
}

