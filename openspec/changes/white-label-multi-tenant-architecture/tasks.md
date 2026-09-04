## 1. Banco de Dados & Modelos White Label

- [ ] 1.1 Criar migração `src/migrations/20260904140000-create_table_white_label_configs.ts` com colunas de identificação, domínio, paleta de cores, logos e links institucionais
- [ ] 1.2 Criar seeder `src/seeders/20260904141000-seed_default_white_label_config.ts` com a configuração padrão da Workix
- [ ] 1.3 Criar modelo Sequelize `src/models/white_label_config.ts` e registrá-lo no índice `src/models/index.ts`

## 2. Serviço de Resolução de Tenant & Middleware

- [ ] 2.1 Implementar `src/modules/whitelabel/services/tenant_resolver.service.ts` com busca por Host/domínio, cabeçalhos (`x-tenant-slug`, `x-tenant-id`), cache e fallback
- [ ] 2.2 Implementar `src/middleware/tenant.middleware.ts` e injetar `tenant` e `whiteLabelConfig` no contexto Apollo Server em `src/index.ts`

## 3. Módulo GraphQL White Label

- [ ] 3.1 Criar schema SDL `src/modules/whitelabel/graphql/schema.gql` com tipos, inputs e operações de consulta/mutação
- [ ] 3.2 Implementar resolvers `src/modules/whitelabel/graphql/whitelabel.resolvers.ts` com `whiteLabelConfig`, `allWhiteLabelConfigs`, `upsertWhiteLabelConfig` e `deleteWhiteLabelConfig`
- [ ] 3.3 Integrar schema e resolvers de White Label no schema raiz do Apollo Server

## 4. Frontend Theme & Branding Dynamic Injection

- [ ] 4.1 Criar módulo auxiliar para frontend/clientes de injeção dinâmica de CSS variables (`:root { --brand-primary: ... }`), `<title>` e `<link rel="icon">`
- [ ] 4.2 Documentar matriz de integração e suporte no frontend Web e Mobile

## 5. Validação, Testes Automatizados & Retrocompatibilidade

- [ ] 5.1 Criar testes unitários para `TenantResolverService` cobrindo resolução por domínio, cabeçalho, fallback seguro e invalidação de cache
- [ ] 5.2 Criar testes de integração GraphQL para queries e mutations de White Label
- [ ] 5.3 Executar suíte completa de testes (`npm test`) garantindo aprovação total de 100% sem quebras
