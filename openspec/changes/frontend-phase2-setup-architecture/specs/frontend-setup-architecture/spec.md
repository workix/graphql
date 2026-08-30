## ADDED Requirements

### Requirement: Estruturação Físicas dos Frontends Cliente e Admin
O projeto SHALL possuir dois diretórios independentes sob a pasta `frontend/`: `frontend/client` e `frontend/admin`, cada um contendo seu próprio `package.json`, gerenciador de dependências, suporte TypeScript e script de build Vite.

#### Scenario: Verificação dos Projetos Criados
- **WHEN** o comando de inicialização ou build do frontend é executado nas pastas `frontend/client` e `frontend/admin`
- **THEN** ambos compilam sem erros e expõem dev servers independentes.

### Requirement: Integração do Vuetify 3 no Frontend Administrativo
O frontend administrativo (`frontend/admin`) SHALL utilizar a biblioteca Vuetify 3 como sistema de componentes visuais, com suporte a Material Design Icons e tema corporativo configurado em `src/plugins/vuetify.ts`.

#### Scenario: Renderização do Vuetify 3
- **WHEN** uma view administrativa carrega componentes do Vuetify como `v-app`, `v-navigation-drawer`, `v-app-bar` e `v-container`
- **THEN** a interface é renderizada corretamente com a identidade do Vuetify 3.

### Requirement: Roteamento e Proteção de Rotas com Vue Router
Ambos os frontends SHALL possuir arquivos de rotas protegidas (`src/router/index.ts`) com navegação parametrizada e guards que verificam o estado de autenticação antes de liberar o acesso a views de candidatos, empresas ou administradores.

#### Scenario: Tentativa de Acesso sem Autenticação
- **WHEN** um usuário não autenticado tenta acessar diretamente uma rota protegida (como `/admin/dashboard` ou `/company/post-job`)
- **THEN** o Vue Router redireciona automaticamente para a página de login.

### Requirement: Serviço HTTP Centralizado e Injeção de Token JWT
A comunicação com o backend SHALL ser centralizada em `src/services/api.ts` em ambos os frontends, interceptando requisições para anexar o token JWT no cabeçalho `Authorization: Bearer <token>` e tratando erros globais de rede e expiração de sessão (HTTP 401).

#### Scenario: Requisição Autenticada ao Backend
- **WHEN** uma chamada de serviço é realizada através de `api.ts` estando o usuário logado
- **THEN** a requisição inclui automaticamente o cabeçalho Authorization com o token JWT armazenado na Pinia store.
