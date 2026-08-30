# Proposta: Etapa 2 — Infraestrutura de Conexão GraphQL e Desacoplamento Firebase nos 3 Frontends

## Why
Antes de iniciar a implementação em massa de telas, os três projetos (`frontend/client`, `frontend/admin` e `android`) precisam de uma camada de infraestrutura padronizada, robusta e configurável para se conectar ao backend GraphQL em `http://localhost:4000/graphql`. Além disso, a autenticação Firebase deve ser desacoplada/desabilitada de maneira organizada (sem exigir tokens nos guards de navegação nesta fase), preservando a arquitetura para que a camada de autenticação/tokens possa ser reativada no futuro sem necessidade de refatorar telas.

## What Changes
- Configuração padronizada de cliente GraphQL (Apollo Client / URQL / GraphQL Request) no Frontend Cliente (`frontend/client`).
- Configuração padronizada de cliente GraphQL (Apollo Client / URQL / GraphQL Request) no Frontend Admin (`frontend/admin`).
- Configuração de cliente GraphQL no projeto Android (`android/`) utilizando cliente HTTP (OkHttp / Ktor / Apollo Kotlin) apontando para o host de desenvolvimento (`http://10.0.2.2:4000/graphql` ou `http://localhost:4000/graphql`).
- Parametrização do endpoint via variáveis de ambiente (`VITE_GRAPHQL_URL`, `local.properties` / `BuildConfig`).
- Criação de interceptor/middleware que suporta injeção de tokens JWT/Firebase quando habilitado, mas opera em modo aberto (sem bloquear telas) nesta etapa.
- Validação do build e execução bem-sucedida de uma query real inicial nos três projetos.

## Capabilities

### New Capabilities
- `graphql-client-infrastructure`: Infraestrutura de cliente GraphQL nos três frontends (Client, Admin, Android) com suporte a variáveis de ambiente, tratamento centralizado de erros de rede/GraphQL e desacoplamento controlado de autenticação.

### Modified Capabilities
<!-- Nenhuma especificação existente teve seus requisitos alterados nesta etapa -->

## Impact
- **Frontend Cliente**: Adição de dependências de cliente GraphQL se necessário, criação de `src/services/graphql.ts` e configuração de ambiente.
- **Frontend Admin**: Criação de `src/services/graphql.ts`, integração com stores e configuração de ambiente.
- **Android**: Configuração de rede GraphQL no `ApiClient.kt` / camada de rede e validação de build Gradle.
- **Segurança**: Arquitetura de headers de autenticação mantida através de interceptors desacoplados.
