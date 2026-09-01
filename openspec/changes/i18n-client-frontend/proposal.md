## Why

O frontend do cliente (`frontend/client`) atende usuários em diferentes regiões geográficas e precisa oferecer suporte nativo a múltiplos idiomas: Português do Brasil (`pt-BR`), Inglês dos Estados Unidos (`en-US`) e Espanhol (`es-ES`). Atualmente, os textos estão fixos em português no código-fonte, impedindo a expansão internacional e a personalização da experiência do usuário.

## What Changes

- Instalação e configuração de `vue-i18n` no `frontend/client`.
- Criação dos dicionários estruturados de mensagens em `src/locales/`:
  - `pt-BR.json` / `pt-BR.ts` (Português - Brasil)
  - `en-US.json` / `en-US.ts` (Inglês - EUA)
  - `es-ES.json` / `es-ES.ts` (Espanhol)
- Implementação de plugin e store Pinia para gerenciamento de idioma com persistência no `localStorage` e detecção automática do navegador.
- Criação de componente de alternância de idioma (`LanguageSwitcher.vue`) acessível no cabeçalho/navbar.
- Internacionalização de textos estáticos e dinâmicos (navegação, feed, vagas, mensagens, cursos, perfil e autenticação).

## Capabilities

### New Capabilities
- `i18n-client-frontend`: Suporte a múltiplos idiomas (pt-BR, en-US, es-ES) no frontend cliente com troca dinâmica sem reload e persistência.

### Modified Capabilities

## Impact

- **Código Afetado**: `frontend/client/src/`, `frontend/client/package.json`.
- **Experiência do Usuário**: Interface 100% traduzível e reativa em 3 idiomas.
