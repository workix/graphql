## Why

O portal administrativo (`frontend/admin`) é utilizado por gestores e operadores corporativos que necessitam de interface nos três idiomas suportados: Português do Brasil (`pt-BR`), Inglês (`en-US`) e Espanhol (`es-ES`). A aplicação é construída sobre Vuetify 3 e requer integração do `vue-i18n` com o adaptador de componentes nativos do Vuetify (paginação, filtros, diálogos).

## What Changes

- Instalação e configuração de `vue-i18n` no `frontend/admin` com integração ao Vuetify 3 (`createVueI18nAdapter`).
- Criação dos dicionários de mensagens em `src/locales/`:
  - `pt-BR.json` / `pt-BR.ts`
  - `en-US.json` / `en-US.ts`
  - `es-ES.json` / `es-ES.ts`
- Internacionalização dos módulos de administração:
  - Dashboard e Métricas
  - Gestão de Usuários e Permissões (JAAS)
  - Vagas, Candidatos e Processos Seletivos
  - Relatórios e Auditoria
- Criação do seletor de idioma na AppBar (`src/components/AdminLanguageSwitcher.vue`).
- Persistência da preferência em `localStorage`.

## Capabilities

### New Capabilities
- `i18n-admin-frontend`: Suporte a múltiplos idiomas (pt-BR, en-US, es-ES) no painel administrativo Vuetify 3 com persistência e troca em tempo real.

### Modified Capabilities

## Impact

- **Código Afetado**: `frontend/admin/src/`, `frontend/admin/package.json`.
- **Vuetify**: Componentes nativos (tabelas, alertas, formulários) sincronizados com as mensagens traduzidas.
