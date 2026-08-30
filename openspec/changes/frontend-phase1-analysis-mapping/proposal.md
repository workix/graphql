## Why

Este repositório possui uma API backend robusta em GraphQL/REST, porém necessita de dois frontends completos, funcionais e integrados (Frontend do Cliente baseado no Design Spec da pasta `frontend/themeforest-i1KHSuFM-jobseek-job-board-html-template` e Frontend Administrativo com Vuetify 3). Para garantir que nenhuma funcionalidade do backend fique sem interface e que os frontends sejam implementados em baby-steps com qualidade, esta primeira etapa realiza a análise detalhada, mapeamento funcional completo de APIs/Views/Permissões e definição da arquitetura dos dois frontends.

## What Changes

- **Análise & Inventário do Backend**: Inspeção de todos os modelos, rotas REST, esquemas GraphQL, controllers, DTOs, mecanismos de autenticação (JWT/Session) e permissões no backend.
- **Análise do Design Spec**: Inspeção detalhada do template `frontend/themeforest-i1KHSuFM-jobseek-job-board-html-template` para extrair layout, tipografia, cores, componentes e fluxos do Frontend do Cliente.
- **Mapeamento Funcional (Inventário)**: Criação de um inventário mapeando cada funcionalidade do backend para suas respectivas views (Cliente vs. Admin), métodos HTTP/GraphQL, permissões exigidas e status de implementação.
- **Especificação Arquitetural dos Frontends**: Definição da arquitetura de diretórios, roteamento, gerenciamento de estado, camada de serviços HTTP e estratégias de autenticação/autorização para os frontends Cliente (Vue.js + CSS template) e Admin (Vue.js + Vuetify 3).

## Capabilities

### New Capabilities
- `frontend-analysis-mapping`: Mapeamento funcional completo das APIs do backend para views Cliente/Admin, inventário de rotas e definição da arquitetura dos frontends.

### Modified Capabilities

Nenhuma capacidade existente foi modificada.

## Impact

- **Código e Documentação**: Criação de `FRONTEND_IMPLEMENTATION.md` inicial com o inventário funcional e definições arquiteturais.
- **Sistemas**: Serve como base e especificação para as fases subsequentes de scaffolding e desenvolvimento dos frontends do Cliente e Administrativo.
