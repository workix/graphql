# graphql-jobs-feature Specification

## Purpose
Especifica o comportamento de usuário e requisitos funcionais para o módulo de Vagas (Jobs) no Frontend Cliente, Frontend Admin e Aplicativo Android a partir do consumo de APIs GraphQL reais.

## Requirements

### Requirement: Listagem e Busca de Vagas no Frontend Cliente
O Frontend Cliente SHALL disponibilizar página pública de vagas consumindo a query `allJobsPaginated` (e `allJobsFeatured`), exibindo título, empresa, localização, salário, tipo de contrato, status de destaque e paginação funcional, com estados visuais de loading e estado vazio.

#### Scenario: Visualização e Filtro de Vagas no Cliente
- **WHEN** o usuário acessa a página de vagas (`/jobs`)
- **THEN** a lista exibe as vagas retornadas pelo backend GraphQL e permite navegar entre páginas e aplicar filtros por palavra-chave ou categoria.

### Requirement: Detalhes e Candidatura em Vaga no Frontend Cliente e Android
O Frontend Cliente e o aplicativo Android SHALL disponibilizar tela de detalhes da vaga via query `getJobById(id)` e permitir que o usuário candidate-se através da mutation `subscribeInJob(input)`.

#### Scenario: Candidatura a Vaga com Sucesso
- **WHEN** o usuário clica no botão de candidatura na tela de detalhes da vaga
- **THEN** o sistema executa a mutation `subscribeInJob`, exibe mensagem de confirmação de sucesso e atualiza o estado visual da tela.

### Requirement: Gerenciamento Administrativo de Vagas (CRUD) no Frontend Admin
O Frontend Admin SHALL disponibilizar um módulo administrativo completo para gestão de vagas, permitindo listar (`allJobsPaginated`), cadastrar (`createJob`), editar (`updateJob`) e remover (`deleteJob`) vagas com formulários validados e confirmação de exclusão.

#### Scenario: Criação de Nova Vaga pelo Administrador
- **WHEN** o administrador preenche o formulário de cadastro de vaga e clica em salvar
- **THEN** a mutation `createJob` é disparada com os parâmetros informados, a vaga é criada no banco e a listagem administrativa é automaticamente atualizada.

#### Scenario: Exclusão de Vaga no Admin
- **WHEN** o administrador confirma a exclusão de uma vaga existente
- **THEN** a mutation `deleteJob` é executada e o item é removido imediatamente da tabela.
