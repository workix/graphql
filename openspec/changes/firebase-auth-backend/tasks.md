## 1. Repositório e Modelos de Autenticação

- [x] 1.1 Revisar e aprimorar `src/modules/auth/repository/auth.repo.ts` para consulta de usuário por `firebase_uuid` e `email`, integrando relacionamentos com `Company`, `Candidate` e `Resume`
- [x] 1.2 Auditar o modelo `src/models/user.ts` e repositório `src/modules/users/repository/users.repo.ts` para garantir integridade do campo `firebase_uuid` e ausência total de campos de senha

## 2. Resolvers e Middlewares GraphQL

- [x] 2.1 Implementar/ajustar a mutation `doLogin` e a query `aboutMe` em `src/modules/auth/graphql/auth.resolvers.ts` para validação por Firebase UID e geração do token de sessão
- [x] 2.2 Verificar o middleware `src/middleware/extract_jwt.ts` e os composable resolvers em `src/composable_resolvers/` para extração de token e injeção do usuário no contexto `ctx.user`

## 3. Testes Automatizados TDD e Validação

- [x] 3.1 Implementar e atualizar os casos de teste unitários no arquivo `tests/unit/modules/users_auth_jaas.spec.ts` cobrindo sucesso e falha no fluxo de login com Firebase UID
- [x] 3.2 Executar os testes automatizados com Jest para validação de regressão e conformidade dos requisitos
