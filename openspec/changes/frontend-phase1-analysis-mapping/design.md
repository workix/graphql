## Context

O sistema atual possui o backend em Node.js/Express (com endpoints REST e GraphQL), com especificações de modelos em `REST_ENDPOINTS.md`, `QUERIES.md`, `MUTATIONS.md`, `TABLES.md`, `MODELS.md`, `SPECIFICATION.md` e regras em `CLAUDE.md`.
A pasta `frontend/themeforest-i1KHSuFM-jobseek-job-board-html-template` contém os artefatos de UI do portal de vagas (Cliente).
Precisamos estruturar a transição para dois frontends modernos em Vue.js (Cliente com CSS do Jobseek e Admin com Vuetify 3).

## Goals / Non-Goals

**Goals:**
- Realizar levantamento de 100% das entidades, APIs e operações do backend.
- Mapear a matriz de Permissões x Funcionalidades x Views para ambos os frontends.
- Inspecionar a pasta de artefatos frontend `themeforest-i1KHSuFM-jobseek-job-board-html-template` para catalogar os componentes e telas reutilizáveis.
- Estruturar o documento oficial `FRONTEND_IMPLEMENTATION.md` contendo a matriz de inventário funcional e as especificações de arquitetura para os frontends Cliente e Admin.
- Dividir a implementação total dos frontends em etapas atômicas (baby steps) rastreáveis via OpenSpec (`/opsx-propose`).

**Non-Goals:**
- Não implementar código de componentes das telas nesta primeira fase (a criação dos arquivos de código dos frontends será realizada nas etapas seguintes).
- Não alterar esquemas ou contratos do backend sem necessidade prévia.

## Decisions

- **Decisão 1: Abordagem Monorepo/Multi-app no repositório**:
  Manter dois diretórios distintos dentro de `frontend/`:
  - `frontend/client` (Vue 3 + Vite + CSS Jobseek)
  - `frontend/admin` (Vue 3 + Vite + Vuetify 3)
  *Alternativa considerada*: Projeto único em Vue.js com rotas condicionais. *Motivo da rejeição*: Requisitos visuais distintos (Jobseek template vs Vuetify 3) e bundles mais limpos/isolados para Cliente e Admin.

- **Decisão 2: Fonte da Verdade para Funcionalidades**:
  Utilizar `SPECIFICATION.md`, os arquivos de rotas/modelos do backend (`src/routes`, `src/controllers`, `REST_ENDPOINTS.md`, `QUERIES.md`, `MUTATIONS.md`) e `CLAUDE.md`.

- **Decisão 3: Inventário Rastreável**:
  Registrar todas as funcionalidades no arquivo `FRONTEND_IMPLEMENTATION.md` com status de progresso, permitindo acompanhamento linha a linha a cada commit e a cada nova proposta de mudança (`/opsx-propose`).

## Risks / Trade-offs

- [Extensão do Backend] → Muitas rotas REST e GraphQL existentes. *Mitigação*: Agrupar por domínio funcional no inventário (Autenticação, Vagas, Usuários, Empresas, Candidaturas, Planos/Pagamentos, Admin).
- [Incompatibilidade visual entre Jobseek e Vue 3] → O template Jobseek é HTML/CSS tradicional. *Mitigação*: Modularizar o CSS/Assets e transformar os blocos em componentes Vue sfc sem reescrever o CSS do zero.
