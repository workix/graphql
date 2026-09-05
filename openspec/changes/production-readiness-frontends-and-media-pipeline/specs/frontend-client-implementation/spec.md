## ADDED Requirements

### Requirement: Eliminação de Fallbacks Mockados e Integração 100% GraphQL no Web Cliente
O Frontend Web Cliente SHALL comunicar-se exclusivamente com a API GraphQL real e endpoints REST ativos, eliminando qualquer fallback estático, IDs fictícios ou mocks de dados em `media.service.ts`, `auth.ts`, `LoginView.vue`, `resumes.service.ts`, `posts.service.ts`, `messaging.service.ts` e `learning.service.ts`.

#### Scenario: Autenticação Real com Validação e Feedback Imediato
- **WHEN** um candidato ou recrutador submete credenciais na tela de Login ou Cadastro
- **THEN** o frontend autentica via mutation `doLogin` ou `createUser`, armazena o token JWT válido e carrega as informações reais do usuário via query `aboutMe`.

#### Scenario: Upload e Associação Real de Mídia
- **WHEN** o usuário seleciona um arquivo de foto de perfil ou logotipo no formulário de edição
- **THEN** o `mediaService` requisita a URL via GraphQL, realiza o upload binário real para o endpoint do backend e atualiza a entidade com a URL final retornada.
