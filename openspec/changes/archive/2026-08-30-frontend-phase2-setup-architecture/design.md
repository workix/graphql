## Context

Com o plano da Fase 1 estabelecido, a Fase 2 foca em criar a base de código limpa e executável para os dois frontends:
1. `frontend/client`: Portal do cliente usando Vue 3 + Vite + CSS extraído de `frontend/themeforest-i1KHSuFM-jobseek-job-board-html-template`.
2. `frontend/admin`: Painel administrativo utilizando Vue 3 + Vite + Vuetify 3.

## Goals / Non-Goals

**Goals:**
- Inicializar a estrutura de arquivos e dependências dos dois projetos (`client` e `admin`).
- Configurar Vuetify 3 no projeto Admin com suporte a ícones Material Design (`@mdi/font`).
- Configurar Vue Router com navegação base e guards de autenticação em ambos os frontends.
- Configurar Pinia para gerenciamento de estado global da sessão e usuário.
- Criar a camada de cliente HTTP Axios com interceptors para tokens JWT e tratamento de erros de API em `src/services/api.ts`.
- Configurar arquivos `.env` de ambiente.

**Non-Goals:**
- Não construir o conteúdo visual de todas as views de negócio nesta fase (as telas completas serão implementadas nas Fases 3 e 4).

## Decisions

- **Decisão 1: Vue 3 + Vite para ambos os frontends**:
  *Razão*: Inicialização ultrarrápida, TypeScript nativo e suporte perfeito tanto ao Vuetify 3 quanto ao template CSS do Jobseek.

- **Decisão 2: Interceptor Axios para JWT**:
  *Razão*: O backend utiliza middleware `extractJWTMiddleware` verificando `Authorization: Bearer <token>`. O interceptor injeta o token salvo em localStorage/Pinia em cada chamada HTTP automaticamente.

- **Decisão 3: Vuetify 3 no Admin**:
  *Razão*: Exigência expressa do prompt do projeto (Item 10: "O módulo administrativo deverá ser construído utilizando Vuetify 3").

## Risks / Trade-offs

- [Conflitos de Estilos globais no Client] → O CSS do Jobseek inclui múltiplos arquivos CSS legado. *Mitigação*: Importar os estilos do Jobseek apenas no escopo principal do `frontend/client` sem afetar o `frontend/admin`.
