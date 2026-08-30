## 1. Configuração do Cliente GraphQL nos Frontends Web

- [x] 1.1 Criar ou atualizar o serviço de cliente GraphQL em `frontend/client/src/services/graphql.ts` com tipagem de resposta, variáveis e tratamento de erros
- [x] 1.2 Criar ou atualizar o serviço de cliente GraphQL em `frontend/admin/src/services/graphql.ts`
- [x] 1.3 Configurar variáveis de ambiente `.env.development` com `VITE_GRAPHQL_URL=http://localhost:4000/graphql` nos projetos Web
- [x] 1.4 Configurar bypass de autenticação nos roteadores e stores para permitir navegação irrestrita mantendo o header de autorização desacoplado

## 2. Configuração de Rede GraphQL no Android

- [x] 2.1 Atualizar `android/app/src/main/java/.../network/ApiClient.kt` para suportar requisições GraphQL estruturadas com URL base configurável (`http://10.0.2.2:4000/graphql`)
- [x] 2.2 Desacoplar checagens bloqueantes de token Firebase no fluxo de inicialização do app Android
- [x] 2.3 Criar helper de requisição GraphQL genérica no Android

## 3. Validação de Build e Conectividade Real

- [x] 3.1 Executar build de teste em `frontend/client` e validar conexão executando query `statisticsCount` ou `allJobs`
- [x] 3.2 Executar build de teste em `frontend/admin` e validar conexão com GraphQL
- [x] 3.3 Validar compilação do módulo Android e testes de serialização de request GraphQL
