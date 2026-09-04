## 1. Segurança de Uploads & Validação Binária

- [x] 1.1 Implementar `src/utils/file_security_validator.ts` com validação de Magic Bytes (PDF, PNG, JPEG, WEBP) e sanitização de nomes de arquivos
- [x] 1.2 Criar testes unitários para `FileSecurityValidator` em `tests/unit/file_security_validator.spec.ts`

## 2. Governança LGPD & Direito ao Esquecimento

- [x] 2.1 Implementar serviço `src/modules/governance/services/lgpd_governance.service.ts` com exportação e anonimização de dados
- [x] 2.2 Criar schema e resolvers GraphQL de Governança LGPD em `src/modules/governance/graphql/schema.gql` e `governance.resolvers.ts`

## 3. Feature Flags Dinâmicas por Tenant

- [x] 3.1 Implementar `src/utils/feature_flags.service.ts` com suporte a flags globais e por tenant
- [x] 3.2 Integrar Feature Flags no schema GraphQL e resolver `featureFlags`

## 4. Validação & Testes Automatizados

- [x] 4.1 Criar testes unitários e de integração para `lgpd_governance.service` e `feature_flags.service` em `tests/unit/lgpd_and_feature_flags.spec.ts`
- [x] 4.2 Executar suíte completa de testes (`npm test`) garantindo 100% de sucesso
