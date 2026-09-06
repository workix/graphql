## Purpose

Especifica a suíte de testes ponta a ponta (E2E) com 100% de cobertura de telas e fluxos para o frontend administrativo (workix-admin-frontend), assegurando governança, moderação, gestão de usuários/JAAS, empresas, vagas e Kanban corporativo.

## ADDED Requirements

### Requirement: Autenticação Administrativa e Proteção de Rotas E2E
A aplicação administrativa DEVE exigir autenticação com privilégios de administrador para acesso ao painel de controle e redirecionar usuários não autorizados para a tela de login.

#### Scenario: Login Administrativo com Sucesso
- **WHEN** um administrador insere credenciais válidas na tela de login administrativo
- **THEN** o sistema SHALL redirecionar o usuário para o dashboard principal e inicializar a sessão autenticada

#### Scenario: Bloqueio de Navegação Não Autenticada
- **WHEN** um usuário não autenticado tenta acessar rotas administrativas restritas
- **THEN** o router SHALL interceptar a navegação e redirecionar para a rota de login

### Requirement: Gestão de Empresas e Vagas no Painel E2E
A aplicação administrativa DEVE permitir a listagem, aprovação, edição e arquivamento de empresas e vagas cadastradas.

#### Scenario: Moderação e Aprovação de Vaga
- **WHEN** o administrador acessa a lista de vagas pendentes e aprova uma nova vaga
- **THEN** o status da vaga SHALL mudar para 'Ativa' com notificação visual de sucesso na interface

### Requirement: Cobertura Total dos Módulos Administrativos e Kanban
O painel administrativo DEVE cobrir 100% das telas administrativas (Usuários, Papéis JAAS, Depoimentos, Assinantes, Planos, Formulários, Cursos, Processos Seletivos, Membros, Mídia e Perfis).

#### Scenario: Operação e Movimentação no Quadro Kanban Corporativo
- **WHEN** o administrador abre o painel Kanban de um processo seletivo e altera a fase de um candidato
- **THEN** o card do candidato SHALL transitar entre as colunas correspondentes e refletir a persistência
