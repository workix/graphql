# frontend-client-implementation Specification

## Purpose
TBD - created by archiving change frontend-phase3-client-implementation. Update Purpose after archive.
## Requirements
### Requirement: Autenticação e Gestão de Sessão no Cliente
O portal do cliente SHALL disponibilizar views de Login (`/login`) e Registro (`/register`) integradas às APIs `/auth/login` e `/users`, armazenando a sessão no Pinia/localStorage e atualizando o header de navegação em tempo real.

#### Scenario: Realização de Login com Sucesso
- **WHEN** o usuário envia credenciais válidas na tela de Login
- **THEN** o sistema obtém o token JWT do backend, salva na store, redireciona o usuário para a página inicial/dashboard e atualiza o menu superior com o seu nome e opção de logout.

### Requirement: Portal de Vagas (Busca, Filtros, Detalhes e Inscrição)
O portal do cliente SHALL permitir a visualização de vagas em destaque na Home (`/`), listagem completa com paginação e busca em `/jobs`, página de detalhes da vaga em `/jobs/:id` e submissão de candidaturas via `/jobs/subscribe`.

#### Scenario: Inscrição em uma Vaga de Emprego
- **WHEN** um candidato autenticado clica em "Candidatar-se" na tela de Detalhes da Vaga
- **THEN** a chamada é efetuada para a API backend `/jobs/subscribe` e a interface apresenta feedback visual de sucesso.

### Requirement: Portal de Talentos e Currículos
O portal do cliente SHALL permitir a busca de currículos por empresas em `/candidates`, exibição de perfil detalhado em `/candidates/:id` e cadastro/edição de currículo por candidatos em `/post-resume`.

#### Scenario: Cadastro de Currículo por Candidato
- **WHEN** um candidato preenche e envia o formulário em `/post-resume`
- **THEN** o sistema envia os dados para o endpoint `/resumes` e atualiza seu perfil.

### Requirement: Publicação de Vagas por Empresas
O portal do cliente SHALL disponibilizar formulário em `/post-job` restrito a perfis de empresa para cadastro de novas vagas de emprego.

#### Scenario: Publicação de Nova Vaga
- **WHEN** uma empresa preenche os campos do formulário `/post-job` e clica em "Publicar Vaga"
- **THEN** a vaga é salva no backend e passa a figurar imediatamente na listagem de vagas.

### Requirement: Eliminação de Fallbacks Mockados e Integração 100% GraphQL no Web Cliente
O Frontend Web Cliente SHALL comunicar-se exclusivamente com a API GraphQL real e endpoints REST ativos, eliminando qualquer fallback estático, IDs fictícios ou mocks de dados em `media.service.ts`, `auth.ts`, `LoginView.vue`, `resumes.service.ts`, `posts.service.ts`, `messaging.service.ts` e `learning.service.ts`.

#### Scenario: Autenticação Real com Validação e Feedback Imediato
- **WHEN** um candidato ou recrutador submete credenciais na tela de Login ou Cadastro
- **THEN** o frontend autentica via mutation `doLogin` ou `createUser`, armazena o token JWT válido e carrega as informações reais do usuário via query `aboutMe`.

#### Scenario: Upload e Associação Real de Mídia
- **WHEN** o usuário seleciona um arquivo de foto de perfil ou logotipo no formulário de edição
- **THEN** o `mediaService` requisita a URL via GraphQL, realiza o upload binário real para o endpoint do backend e atualiza a entidade com a URL final retornada.


