# Proposta: Etapa 1 — Análise e Mapeamento Completo Backend GraphQL → Frontends (Cliente, Admin, Android)

## Why
O backend GraphQL em `http://localhost:4000/graphql` consolidou todas as entidades, regras de negócio e operações do sistema. Para que a implementação dos três frontends (Frontend Cliente, Frontend Admin e Aplicativo Android) seja 100% fiel, livre de dados mockados e com cobertura total das operações disponíveis, é indispensável realizar uma auditoria rigorosa de todas as queries, mutations, tipos e regras do backend, gerando uma matriz de mapeamento direto para telas, componentes e fluxos de usuário.

## What Changes
- Levantamento e catalogação de 100% das Queries e Mutations expostas pelo backend GraphQL.
- Catalogação de tipos, enums, inputs, paginação (`all*Paginated`), ordenação, filtros e entidades de suporte.
- Mapeamento bidirecional:
  - Backend GraphQL ➔ Frontend Cliente (Vue.js + CSS Jobseek)
  - Backend GraphQL ➔ Frontend Admin (Vue.js + Vuetify 3)
  - Backend GraphQL ➔ Android (Kotlin / Jetpack Compose & XML)
- Identificação de estados de interface necessários para cada operação (loading, erro, vazio, sucesso).
- Documentação da matriz de rastreabilidade de telas e rotas por projeto em arquivo de referência.

## Capabilities

### New Capabilities
- `graphql-frontend-mapping`: Especificação formal do inventário de operações GraphQL (Queries, Mutations, Types) e seu mapeamento direto para telas, fluxos de navegação e componentes nos projetos Frontend Cliente, Frontend Admin e Android.

### Modified Capabilities
<!-- Nenhuma especificação existente teve seus requisitos alterados nesta etapa de mapeamento -->

## Impact
- **Backend**: Nenhuma alteração destrutiva ou funcional no código do backend GraphQL.
- **Frontend Cliente**: Mapeamento completo de views e componentes existentes e pendentes.
- **Frontend Admin**: Mapeamento completo de CRUDs administrativos e dashboards.
- **Android**: Mapeamento completo de telas de usuário, navegação e modelos de dados em Kotlin.
- **Documentação**: Criação da matriz oficial de rastreabilidade GraphQL ➔ Frontends.
