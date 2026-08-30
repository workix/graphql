## Context

Os projetos frontend (`frontend/client` e `frontend/admin`) utilizam Vue 3 com Vite e TypeScript. O projeto mobile (`android/`) utiliza Kotlin com Gradle.
Para suportar o consumo de `http://localhost:4000/graphql` sem acoplamento direto ou regras engessadas de autenticação nesta fase:
1. Deve ser implementado um serviço de transporte GraphQL leve, padronizado e com suporte a TypeScript nos frontends web.
2. O projeto Android deve configurar seu cliente de rede HTTP (OkHttp/Retrofit/Ktor) para enviar POSTs GraphQL estruturados.
3. Guards de autenticação que exigem login Firebase devem ser colocados em modo permissivo (bypass) via configuração, sem remoção da infraestrutura de interceptor.

Veja `proposal.md` para motivação e justificativas.

## Goals / Non-Goals

**Goals:**
- Configurar os clientes GraphQL nos 3 projetos com baseURL configurável (`.env.development`, `.env.production`, `BuildConfig`).
- Criar funções utilitárias para queries, mutations e tratamento de erros (erros GraphQL vs erros de rede).
- Desabilitar a obrigatoriedade do Firebase Auth nos roteadores e interceptors de requisição.
- Validar builds de `frontend/client`, `frontend/admin` e `./gradlew check` (ou compilação de código) no Android.
- Validar a conectividade executando uma query real no backend.

**Non-Goals:**
- Não implementar autenticação completa de usuário com Firebase SDK.
- Não implementar componentes específicos de domínio ou telas de CRUD completas (escopo das etapas 3 e 4).

## Decisions

### 1. Cliente GraphQL Web: Utilitário Tipado Baseado em `fetch` / `graphql-request` / `@apollo/client`
- **Decisão**: Utilizar uma camada de serviço `src/services/graphql.ts` que encapsula o envio de payloads `{ query, variables }`, tratando headers, respostas `{ data, errors }` e tipagem TypeScript.
- **Alternativas consideradas**: Bibliotecas complexas com cache de normalização pesado; descartado pela simplicidade e agilidade na fase inicial de integração.

### 2. Bypass Controlado de Autenticação Firebase
- **Decisão**: Configurar `VITE_ENABLE_AUTH_GUARD=false` e criar um `authStore` que fornece um usuário de desenvolvimento padrão (mock local transparente para o contexto de navegação), mantendo a passagem de `Authorization: Bearer <token>` quando presente.
- **Alternativas consideradas**: Deletar o código de autenticação; descartado pois violaria a regra de não destruir a arquitetura de segurança futura.

### 3. Configuração de Rede no Android
- **Decisão**: Configurar OkHttp + Gson/Kotlinx.Serialization no `ApiClient.kt` do Android com suporte a URL dinâmica (`BASE_URL = "http://10.0.2.2:4000/graphql"`) e testes unitários de serialização de request GraphQL.

## Risks / Trade-offs

- [Risco: Problemas de CORS entre o servidor Express/Apollo GraphQL e os frontends Vite] ➔ Mitigação: O backend já está configurado com `cors({ origin: true })` no Express, garantindo aceitação de requisições de desenvolvimento.
- [Risco: Endereço do localhost no emulador Android difere de 127.0.0.1] ➔ Mitigação: Uso explícito de `10.0.2.2` no Android para emulador e host IP configurável para dispositivos reais.
