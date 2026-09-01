## Context

Ver `proposal.md` para motivação e justificativa. O `frontend/client` utiliza Vue 3, Pinia e Vite.

## Goals / Non-Goals

**Goals:**
- Adicionar `vue-i18n` (v9+) com suporte a Composition API e legacy mode false.
- Criar arquivos estruturados em JSON/TS por domínio: `common`, `auth`, `navigation`, `feed`, `jobs`, `learning`, `messaging`, `notifications`, `profile`.
- Criar `src/i18n/index.ts` e registrar no `main.ts`.
- Criar `src/components/LanguageSwitcher.vue` e integrá-lo ao layout principal.

**Non-Goals:**
- Não traduzir conteúdos dinâmicos cadastrados por usuários no banco de dados (ex: textos de posts enviados), apenas a interface e labels do sistema.

## Decisions

- **Decisão 1: Composition API com `useI18n()`**:
  - *Racional*: Padrão moderno do Vue 3, facilitando tipagem e consumo direto nos templates (`$t`) e scripts (`t`).
- **Decisão 2: Armazenamento em `localStorage.getItem('workix_locale')`**:
  - *Racional*: Mantém a preferência do usuário entre sessões sem exigir chamada ao backend.

## Risks / Trade-offs

- [Chaves de tradução ausentes] → Fallback configurado para `pt-BR` e avisos em desenvolvimento.
