## 1. Grafo de Conexões e Seguir (`connections` & `follows`)

- [x] 1.1 Criar modelos Sequelize `ConnectionRequest`, `Connection`, `Follow` e suas migrations
- [x] 1.2 Criar repositório `src/modules/connections/repository/connections.repo.ts` com cálculo de grau de distância social (1º, 2º, 3º grau)
- [x] 1.3 Criar módulo GraphQL `src/modules/connections` com schema e resolvers para solicitações, aceite, rejeição e follow
- [x] 1.4 Criar suíte de testes unitários TDD em `tests/unit/modules/connections.spec.ts` com 100% de cobertura

## 2. Perfil Profissional Estendido (`user_profiles`)

- [x] 2.1 Criar modelo Sequelize `UserProfile` e migration para a tabela `user_profiles`
- [ ] 2.2 Criar módulo GraphQL `src/modules/profiles` com schema, DTO, repositório e resolvers para edição e consulta de perfil
- [ ] 2.3 Criar integração com worker RabbitMQ `search-index-sync` para atualização de perfis no Elasticsearch
- [ ] 2.4 Criar suíte de testes unitários TDD em `tests/unit/modules/profiles.spec.ts` com 100% de cobertura

## 3. Posts, Feed Social, Reações Tipadas e Comentários (`posts`)

- [ ] 3.1 Criar modelos Sequelize `Post`, `PostReaction`, `PostComment` e suas migrations
- [ ] 3.2 Criar módulo GraphQL `src/modules/posts` com DTOs, repositório e resolvers para criação de posts com mídias, feed e reações
- [ ] 3.3 Criar suíte de testes unitários TDD em `tests/unit/modules/posts.spec.ts` com 100% de cobertura

## 4. Mensageria Direta 1:1 (`direct_messages`)

- [ ] 4.1 Criar modelos Sequelize `Conversation`, `DirectMessage` e suas migrations
- [ ] 4.2 Criar módulo GraphQL `src/modules/messaging` com schema, DTOs, repositório, resolvers e subscription `directMessageAdded`
- [ ] 4.3 Criar suíte de testes unitários TDD em `tests/unit/modules/messaging.spec.ts` com 100% de cobertura e validação geral do Jest
