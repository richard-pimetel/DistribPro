import type { Produto, Cliente, Fornecedor, Pedido, KPIs, EntregaData, StatusPedidoData, Config } from '../types';

export const mockKPIs: KPIs = {
  receita: 84200,
  receitaVariacao: 12.4,
  pedidos: 1248,
  pedidosVariacao: 8.1,
  clientes: 143,
  clientesVariacao: -3.2,
  ticketMedio: 374,
  ticketMedioVariacao: 5.7,
};

export const mockEntregas: EntregaData[] = [
  { dia: 'Seg', entregas: 32, vendas: 12400 },
  { dia: 'Ter', entregas: 45, vendas: 18200 },
  { dia: 'Qua', entregas: 28, vendas: 9800 },
  { dia: 'Qui', entregas: 61, vendas: 24600 },
  { dia: 'Sex', entregas: 53, vendas: 21000 },
  { dia: 'Sáb', entregas: 38, vendas: 15400 },
  { dia: 'Dom', entregas: 19, vendas: 7200 },
];

export const mockStatusPedidos: StatusPedidoData[] = [
  { status: 'entregue', label: 'Entregues', count: 612, color: '#30D158' },
  { status: 'em_transito', label: 'Em Trânsito', count: 248, color: '#0A84FF' },
  { status: 'confirmado', label: 'Confirmados', count: 187, color: '#8B5CF6' },
  { status: 'pendente', label: 'Pendentes', count: 143, color: '#FFD60A' },
  { status: 'cancelado', label: 'Cancelados', count: 58, color: '#FF453A' },
];

export const mockProdutos: Produto[] = [
  { id: 'p1', nome: 'Notebook Pro 15"', sku: 'NTB-001', categoria: 'Eletrônicos', preco: 4299, custo: 3100, estoque: 45, estoqueMinimo: 10, fornecedor: 'TechSupply Ltda', status: 'ativo' },
  { id: 'p2', nome: 'Mouse Sem Fio MX', sku: 'MSE-002', categoria: 'Periféricos', preco: 249, custo: 140, estoque: 3, estoqueMinimo: 15, fornecedor: 'PerifericosMax', status: 'ativo' },
  { id: 'p3', nome: 'Teclado Mecânico RGB', sku: 'TEC-003', categoria: 'Periféricos', preco: 399, custo: 220, estoque: 8, estoqueMinimo: 10, fornecedor: 'PerifericosMax', status: 'ativo' },
  { id: 'p4', nome: 'Monitor 27" 4K', sku: 'MON-004', categoria: 'Eletrônicos', preco: 2199, custo: 1650, estoque: 22, estoqueMinimo: 5, fornecedor: 'TechSupply Ltda', status: 'ativo' },
  { id: 'p5', nome: 'Headset Gamer Pro', sku: 'HDS-005', categoria: 'Áudio', preco: 599, custo: 320, estoque: 2, estoqueMinimo: 8, fornecedor: 'AudioTech', status: 'ativo' },
  { id: 'p6', nome: 'Webcam Full HD', sku: 'CAM-006', categoria: 'Periféricos', preco: 349, custo: 190, estoque: 18, estoqueMinimo: 6, fornecedor: 'PerifericosMax', status: 'ativo' },
  { id: 'p7', nome: 'SSD 1TB NVMe', sku: 'SSD-007', categoria: 'Armazenamento', preco: 499, custo: 310, estoque: 55, estoqueMinimo: 20, fornecedor: 'StorageWorld', status: 'ativo' },
  { id: 'p8', nome: 'Hub USB-C 7 em 1', sku: 'HUB-008', categoria: 'Acessórios', preco: 189, custo: 90, estoque: 4, estoqueMinimo: 12, fornecedor: 'PerifericosMax', status: 'ativo' },
  { id: 'p9', nome: 'Cadeira Gamer XL', sku: 'CDR-009', categoria: 'Mobiliário', preco: 1899, custo: 1200, estoque: 12, estoqueMinimo: 3, fornecedor: 'FurniPro', status: 'ativo' },
  { id: 'p10', nome: 'Placa de Vídeo RTX 4070', sku: 'GPU-010', categoria: 'Eletrônicos', preco: 3499, custo: 2800, estoque: 7, estoqueMinimo: 5, fornecedor: 'TechSupply Ltda', status: 'ativo' },
  { id: 'p11', nome: 'Fonte 750W Gold', sku: 'FTE-011', categoria: 'Componentes', preco: 649, custo: 420, estoque: 30, estoqueMinimo: 8, fornecedor: 'StorageWorld', status: 'ativo' },
  { id: 'p12', nome: 'Gabinete ATX Mesh', sku: 'GAB-012', categoria: 'Componentes', preco: 429, custo: 260, estoque: 9, estoqueMinimo: 10, fornecedor: 'StorageWorld', status: 'inativo' },
];

export const mockClientes: Cliente[] = [
  { id: 'c1', nome: 'Empresa Alpha Tecnologia', email: 'compras@alpha.com.br', telefone: '(11) 3456-7890', cpfCnpj: '12.345.678/0001-90', cidade: 'São Paulo', estado: 'SP', status: 'ativo', totalPedidos: 48, totalGasto: 128400, ultimaCompra: '2026-03-10' },
  { id: 'c2', nome: 'Beta Soluções LTDA', email: 'ti@beta.com.br', telefone: '(21) 2345-6789', cpfCnpj: '23.456.789/0001-01', cidade: 'Rio de Janeiro', estado: 'RJ', status: 'ativo', totalPedidos: 32, totalGasto: 87600, ultimaCompra: '2026-03-08' },
  { id: 'c3', nome: 'Gamma Distribuidora', email: 'pedidos@gamma.com.br', telefone: '(31) 3567-8901', cpfCnpj: '34.567.890/0001-12', cidade: 'Belo Horizonte', estado: 'MG', status: 'ativo', totalPedidos: 17, totalGasto: 45200, ultimaCompra: '2026-03-05' },
  { id: 'c4', nome: 'Delta Corp', email: 'admin@delta.com', telefone: '(41) 3678-9012', cpfCnpj: '45.678.901/0001-23', cidade: 'Curitiba', estado: 'PR', status: 'inativo', totalPedidos: 9, totalGasto: 22100, ultimaCompra: '2026-01-15' },
  { id: 'c5', nome: 'Epsilon Tech Services', email: 'contato@epsilon.com.br', telefone: '(51) 3789-0123', cpfCnpj: '56.789.012/0001-34', cidade: 'Porto Alegre', estado: 'RS', status: 'ativo', totalPedidos: 24, totalGasto: 63800, ultimaCompra: '2026-03-12' },
  { id: 'c6', nome: 'Zeta Inovação Digital', email: 'zeta@zeta.com.br', telefone: '(85) 3890-1234', cpfCnpj: '67.890.123/0001-45', cidade: 'Fortaleza', estado: 'CE', status: 'ativo', totalPedidos: 11, totalGasto: 28900, ultimaCompra: '2026-02-28' },
  { id: 'c7', nome: 'Eta Sistemas', email: 'compras@eta.com.br', telefone: '(61) 3901-2345', cpfCnpj: '78.901.234/0001-56', cidade: 'Brasília', estado: 'DF', status: 'ativo', totalPedidos: 36, totalGasto: 94500, ultimaCompra: '2026-03-11' },
  { id: 'c8', nome: 'Theta Consultoria', email: 'ti@theta.com.br', telefone: '(71) 3012-3456', cpfCnpj: '89.012.345/0001-67', cidade: 'Salvador', estado: 'BA', status: 'inativo', totalPedidos: 5, totalGasto: 12300, ultimaCompra: '2025-11-20' },
];

export const mockFornecedores: Fornecedor[] = [
  { id: 'f1', nome: 'TechSupply Ltda', email: 'vendas@techsupply.com.br', telefone: '(11) 4567-8901', cnpj: '11.222.333/0001-44', cidade: 'São Paulo', estado: 'SP', categoria: 'Eletrônicos', status: 'ativo', totalProdutos: 45, contato: 'Carlos Mendes' },
  { id: 'f2', nome: 'PerifericosMax', email: 'pedidos@perifericosmax.com.br', telefone: '(11) 5678-9012', cnpj: '22.333.444/0001-55', cidade: 'Campinas', estado: 'SP', categoria: 'Periféricos', status: 'ativo', totalProdutos: 28, contato: 'Ana Silva' },
  { id: 'f3', nome: 'StorageWorld', email: 'comercial@storageworld.com.br', telefone: '(21) 6789-0123', cnpj: '33.444.555/0001-66', cidade: 'Rio de Janeiro', estado: 'RJ', categoria: 'Armazenamento', status: 'ativo', totalProdutos: 19, contato: 'Roberto Costa' },
  { id: 'f4', nome: 'AudioTech', email: 'suporte@audiotech.com.br', telefone: '(11) 7890-1234', cnpj: '44.555.666/0001-77', cidade: 'São Paulo', estado: 'SP', categoria: 'Áudio', status: 'ativo', totalProdutos: 12, contato: 'Fernanda Lima' },
  { id: 'f5', nome: 'FurniPro', email: 'vendas@furnipro.com.br', telefone: '(31) 8901-2345', cnpj: '55.666.777/0001-88', cidade: 'Belo Horizonte', estado: 'MG', categoria: 'Mobiliário', status: 'ativo', totalProdutos: 8, contato: 'Marcos Oliveira' },
];

export const mockPedidos: Pedido[] = [
  { id: 'o1', numero: '#001248', clienteId: 'c1', clienteNome: 'Empresa Alpha Tecnologia', data: '2026-03-14', prazoEntrega: '2026-03-18', status: 'em_transito', total: 12498, itens: [{ produtoId: 'p1', produtoNome: 'Notebook Pro 15"', quantidade: 2, preco: 4299 }, { produtoId: 'p4', produtoNome: 'Monitor 27" 4K', quantidade: 1, preco: 2199 }, { produtoId: 'p7', produtoNome: 'SSD 1TB NVMe', quantidade: 2, preco: 499 }] },
  { id: 'o2', numero: '#001247', clienteId: 'c7', clienteNome: 'Eta Sistemas', data: '2026-03-13', prazoEntrega: '2026-03-17', status: 'confirmado', total: 7896, itens: [{ produtoId: 'p10', produtoNome: 'Placa de Vídeo RTX 4070', quantidade: 1, preco: 3499 }, { produtoId: 'p11', produtoNome: 'Fonte 750W Gold', quantidade: 2, preco: 649 }] },
  { id: 'o3', numero: '#001246', clienteId: 'c5', clienteNome: 'Epsilon Tech Services', data: '2026-03-13', prazoEntrega: '2026-03-16', status: 'pendente', total: 3148, itens: [{ produtoId: 'p3', produtoNome: 'Teclado Mecânico RGB', quantidade: 4, preco: 399 }, { produtoId: 'p2', produtoNome: 'Mouse Sem Fio MX', quantidade: 4, preco: 249 }, { produtoId: 'p8', produtoNome: 'Hub USB-C 7 em 1', quantidade: 4, preco: 189 }] },
  { id: 'o4', numero: '#001245', clienteId: 'c2', clienteNome: 'Beta Soluções LTDA', data: '2026-03-12', prazoEntrega: '2026-03-15', status: 'entregue', total: 5996, itens: [{ produtoId: 'p9', produtoNome: 'Cadeira Gamer XL', quantidade: 2, preco: 1899 }, { produtoId: 'p6', produtoNome: 'Webcam Full HD', quantidade: 4, preco: 349 }] },
  { id: 'o5', numero: '#001244', clienteId: 'c3', clienteNome: 'Gamma Distribuidora', data: '2026-03-11', prazoEntrega: '2026-03-14', status: 'entregue', total: 2498, itens: [{ produtoId: 'p4', produtoNome: 'Monitor 27" 4K', quantidade: 1, preco: 2199 }, { produtoId: 'p8', produtoNome: 'Hub USB-C 7 em 1', quantidade: 1, preco: 189 }] },
  { id: 'o6', numero: '#001243', clienteId: 'c6', clienteNome: 'Zeta Inovação Digital', data: '2026-03-10', prazoEntrega: '2026-03-13', status: 'cancelado', total: 1196, itens: [{ produtoId: 'p2', produtoNome: 'Mouse Sem Fio MX', quantidade: 3, preco: 249 }, { produtoId: 'p8', produtoNome: 'Hub USB-C 7 em 1', quantidade: 2, preco: 189 }] },
  { id: 'o7', numero: '#001242', clienteId: 'c1', clienteNome: 'Empresa Alpha Tecnologia', data: '2026-03-09', prazoEntrega: '2026-03-12', status: 'entregue', total: 8598, itens: [{ produtoId: 'p1', produtoNome: 'Notebook Pro 15"', quantidade: 2, preco: 4299 }] },
  { id: 'o8', numero: '#001241', clienteId: 'c7', clienteNome: 'Eta Sistemas', data: '2026-03-08', prazoEntrega: '2026-03-11', status: 'entregue', total: 4997, itens: [{ produtoId: 'p7', produtoNome: 'SSD 1TB NVMe', quantidade: 5, preco: 499 }, { produtoId: 'p3', produtoNome: 'Teclado Mecânico RGB', quantidade: 4, preco: 399 }] },
];

export const mockConfig: Config = {
  nomeEmpresa: 'DistribPro Soluções',
  cnpj: '12.345.678/0001-90',
  email: 'contato@distribpro.com.br',
  telefone: '(11) 3456-7890',
  endereco: 'Av. Paulista, 1234 - Sala 501',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '01310-100',
  website: 'www.distribpro.com.br',
};
