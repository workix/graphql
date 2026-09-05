# Specification: Frontend Client Unit Tests

## Purpose

Estabelece a cobertura e integridade de testes unitários para a aplicação web do cliente (`frontend/client`), cobrindo autenticação, estado global Pinia, serviços de comunicação de dados e renderização de componentes.

## ADDED Requirements

### Requirement: Suíte de Testes Unitários de Stores e Serviços do Cliente
O frontend do cliente SHALL possuir testes unitários com Vitest cobrindo a store `auth.ts` e todos os serviços de API (`api.ts`, `media.service.ts`, `jobs.service.ts`, `resumes.service.ts`, `posts.service.ts`, `messaging.service.ts`, `learning.service.ts`, `analytics.service.ts`, `events.service.ts`, `groups.service.ts`).

#### Scenario: Teste de Login e Estado de Sessão
- **WHEN** a store `useAuthStore` executa `login` com credenciais válidas
- **THEN** o token JWT e dados do usuário são persistidos e o getter `isAuthenticated` retorna `true`.

#### Scenario: Teste de Upload e Requisições GraphQL de Mídia
- **WHEN** o serviço `mediaService.requestUploadUrl` ou `confirmUpload` é acionado
- **THEN** a chamada GraphQL apropriada é enviada e a resposta esperada é retornada.

### Requirement: Testes de Renderização de Componentes
Os componentes Vue essenciais (`JobCard.vue`, `PostCard.vue`, `LoadingOverlay.vue`, `Pagination.vue`) SHALL possuir testes unitários verificando a renderização correta de props, emissão de eventos e reatividade com `@vue/test-utils`.
