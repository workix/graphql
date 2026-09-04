## 1. Segurança de Uploads & Validação Binária

- [ ] 1.1 Implementar `src/utils/file_security_validator.ts` com validação de Magic Bytes (PDF, PNG, JPEG, WEBP) e sanitização de nomes de arquivos
- [ ] 1.2 Criar testes unitários para `FileSecurityValidator` em `tests/unit/file_security_validator.spec.ts`

## 2. Governança LGPD & Direito ao Esquecimento

- [ ] 2.1 Implementar serviço `src/modules/governance/services/lgpd_governance.service.ts` com exportação e anonimização de dados
- [ ] 2.2 Criar schema e resolvers GraphQL de Governança LGPD em `src/modules/governance/graphql/schema.gql` e `governance.resolvers.ts`

## 3. Feature Flags Dinâmicas por Tenant

- [ ] 3.1 Implementar `src/utils/feature_flags.service.ts` com suporte a flags globais e por tenant
- [ ] 3.2 Integrar Feature Flags no schema GraphQL e resolver `featureFlags`

## 4. Validação & Testes Automatizados

- [ ] 4.1 Criar testes unitários e de integração para `lgpd_governance.service` e `feature_flags.service` em `tests/unit/lgpd_and_feature_flags.spec.ts`
- [ ] 4.2 Executar suíte completa de testes (`npm test`) garantindo 100% de sucesso
