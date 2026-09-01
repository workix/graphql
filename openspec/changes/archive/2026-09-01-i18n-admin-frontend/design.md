## Context

Ver `proposal.md` para motivação e justificativa. O `frontend/admin` utiliza Vue 3, Vuetify 3, Vite e Pinia.

## Goals / Non-Goals

**Goals:**
- Configurar `vue-i18n` com suporte a `useI18n` e mensagens do Vuetify (`vuetify/locale`).
- Mapear dicionários em `src/locales/` estruturados para o escopo administrativo.
- Criar `src/plugins/i18n.ts` e plugar no setup do Vuetify em `src/plugins/vuetify.ts` (ou `src/main.ts`).
- Adicionar `AdminLanguageSwitcher.vue` na AppBar de layout.

**Non-Goals:**
- Não alterar as regras de negócio de autorização do backend, apenas a camada de apresentação.

## Decisions

- **Decisão 1: Vuetify `createVueI18nAdapter`**:
  - *Racional*: Garante que componentes como `v-data-table`, `v-pagination`, `v-date-picker` utilizem as traduções oficiais do Vuetify combinadas com o `vue-i18n`.

## Risks / Trade-offs

- [Conflito de pacotes com Vuetify 3] → Utilizar versão compatível do `vue-i18n` (v9).
