Quero que você atue como engenheiro de frontend sênior.
Tenho um backend chamado DistribPro com as seguintes funcionalidades de API:


Autenticação (/auth): login, logout, ver usuário logado, atualizar perfil, alterar senha (rotas: POST /auth/login, POST /auth/logout, GET /auth/me, PUT /auth/perfil, PUT /auth/senha).


Produtos (/produtos): CRUD completo de produtos + rota de estoque baixo (GET/POST/PUT/PATCH/DELETE /produtos, GET /produtos/estoque-baixo).


Clientes (/clientes): CRUD completo de clientes (GET/POST/PUT/DELETE /clientes, GET /clientes/:id).


Fornecedores (/fornecedores): CRUD completo de fornecedores (GET/POST/PUT/DELETE /fornecedores, GET /fornecedores/:id).


Pedidos (/pedidos): CRUD de pedidos, lista de recentes, atualização de status (GET/POST/PUT/DELETE /pedidos, GET /pedidos/recentes, GET /pedidos/:id, PATCH /pedidos/:id/status).


Dashboard (/dashboard): KPIs, entregas por dia e contagem de pedidos por status (GET /dashboard/kpis, GET /dashboard/entregas?dias=7|14|30, GET /dashboard/status-pedidos).


Estoque (/estoque): visão de estoque e ajuste de quantidade (GET /estoque, PATCH /estoque/:id).


Config (/config): buscar e atualizar dados da empresa (GET /config, PUT /config).


Padrão de resposta: { success: boolean, data?: any, error?: { code, message } }.


Quero que você projete um frontend em React + TypeScript com um visual moderno (dashboard administrativo), contendo:


Tela de Login (usa /auth/login), guarda token (Authorization: Bearer ) e protege as demais rotas.


Layout principal com sidebar, header e área de conteúdo.


Dashboard:


Cards de KPIs com dados de /dashboard/kpis.


Gráfico de entregas por dia usando /dashboard/entregas.


Resumo de pedidos por status com /dashboard/status-pedidos.




Tela de Produtos:


Tabela com listagem (GET /produtos).


Filtros básicos.


Modal de criar/editar produto (POST/PUT /produtos).


Ação de deletar (DELETE /produtos/:id).


Destaque/alerta para itens de /produtos/estoque-baixo.




Tela de Clientes:


Tabela usando /clientes.


Modal de cadastro/edição (POST/PUT /clientes).


Delete (DELETE /clientes/:id).




Tela de Fornecedores:


Tabela + modal, usando as rotas de /fornecedores.




Tela de Pedidos:


Tabela de pedidos (GET /pedidos).


Card/lista de pedidos recentes (GET /pedidos/recentes).


Formulário de novo pedido (POST /pedidos).


Ação para atualizar apenas o status (PATCH /pedidos/:id/status) com botões ou dropdown de status.




Tela de Configurações:


Formulário com dados da empresa usando GET /config e PUT /config.




Tela/Seção de Perfil:


Usar /auth/me para mostrar dados do usuário, permitir alterar nome/email (PUT /auth/perfil) e senha (PUT /auth/senha).




Tratamento visual de erros e loading:




Quando success for false, mostrar um toast ou mensagem amigável com error.message.


Loading states nos principais carregamentos (dashboard, tabelas).


Quero:


Organização em pastas (components, pages, services, hooks, types).


Components de UI para: botão, card, modal, tabela, input, select, badge de status, toast.


Um estilo visual limpo e responsivo, no padrão dashboard SaaS B2B, usando as cores que você sugerir.


Exemplos de código de services chamando essas rotas, com TypeScript tipado.


Rotas protegidas após login.


Gere a estrutura do projeto, principais componentes/páginas e trechos de código essenciais para eu implementar o front.