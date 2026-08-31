## Context

O backend GraphQL (`src/`) gerencia usuários através da entidade `User` (definida em `src/models/user.ts`), que já possui a coluna `firebase_uuid` mapeada, sem qualquer coluna de senha. Atualmente, o fluxo em `src/modules/auth/graphql/auth.resolvers.ts` recebe `firebaseUUID` e `email` através da mutation `doLogin`, gerando um JWT assinado com a chave local `JWT_SECRET`. O middleware `extractJWTMiddleware` valida esse token e localiza o usuário no banco pelo `firebase_uuid`, disponibilizando o usuário no contexto GraphQL (`ctx.user`).

Este design consolida e aprimora essa arquitetura para garantir que a verificação de identidade seja estritamente orientada ao Firebase, suportando tanto o fluxo de tokens JWT emitidos pelo backend com `firebase_uuid` quanto a validação direta de credenciais Firebase, garantindo cobertura total por testes TDD.

## Goals / Non-Goals

**Goals:**
- Manter e assegurar a regra de **zero persistência de senhas** no banco de dados.
- Estruturar a validação de identidade no backend associando o `firebase_uuid` e `email` à entidade `User`.
- Garantir que o middleware `extractJWTMiddleware` e composable resolvers (`authResolver`, `verifyTokenResolver`) protejam endpoints e montem o contexto GraphQL (`ctx.user`) com dados seguros e consolidados.
- Fornecer resolução completa na query `aboutMe` para carregar simultaneamente os dados de `User`, `Company`, `Candidate` e `Resume`.
- Manter e expandir a suíte de testes unitários TDD em `tests/unit/modules/users_auth_jaas.spec.ts`.

**Non-Goals:**
- Armazenar credenciais, senhas ou hashes de senha no banco local.
- Alterar as tabelas de banco de dados para incluir campos legados de credenciais.
- Implementar interface visual nesta etapa (o foco desta mudança é estritamente o backend GraphQL).

## Decisions

1. **Associação Unívoca pelo Firebase UID (`firebase_uuid`)**:
   - *Decisão*: O backend utiliza o `firebase_uuid` como identificador primário externo da conta do usuário. A busca por `User` no banco utiliza a combinação `firebase_uuid` e `email`.
   - *Alternativa considerada*: Utilizar apenas o e-mail como chave de busca. Rejeitada pois e-mails podem sofrer alterações no Firebase e o UID é imutável.

2. **Sessão JWT com Subject e Claims do Firebase**:
   - *Decisão*: Após validação das credenciais Firebase, o backend emite um token JWT estruturado contendo `{ id: user.firebase_uuid, sub: user.email }` com tempo de expiração (`expiresIn: 900` ou configurável).
   - *Alternativa considerada*: Realizar chamada remota à API do Firebase a cada requisição GraphQL individual. Rejeitada devido ao overhead de latência e consumo desnecessário de cotas de rede.

3. **Arquitetura em Camadas com Repository Pattern e Composable Resolvers**:
   - *Decisão*: Utilizar `authRepository` para encapsular a lógica de persistência e consulta a modelos (`User`, `Company`, `Candidate`, `Resume`), e `compose(...authGuard)` para proteger resolvers que exigem autenticação.

## Risks / Trade-offs

- **[Risco] Dessincronia de E-mail entre Firebase e Banco Local** → *Mitigação*: O backend deve validar e sincronizar o e-mail caso o `firebase_uuid` corresponda a um usuário ativo já registrado.
- **[Risco] Requisições com Tokens Expirados** → *Mitigação*: `verifyTokenResolver` captura o erro de expiração do JWT e retorna mensagem padrão de token expirado, instruindo os clientes a renovar a sessão.
