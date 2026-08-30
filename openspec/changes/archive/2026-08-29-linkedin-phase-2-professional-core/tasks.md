## 1. Páginas de Empresa (`company_pages`)

- [x] 1.1 Criar modelos Sequelize `CompanyPage`, `CompanyAdmin`, `CompanyFollower` e suas migrations
- [x] 1.2 Criar módulo GraphQL `src/modules/companies` com DTOs, repositório e resolvers para gestão e follow de páginas de empresa
- [x] 1.3 Criar suíte de testes unitários TDD em `tests/unit/modules/companies_pages.spec.ts` com 100% de cobertura

## 2. Vagas Estruturadas & Match de Candidatos (`job_postings`)

- [x] 2.1 Criar modelos Sequelize `JobPosting`, `JobApplication` e suas migrations
- [x] 2.2 Criar repositório `src/modules/job_postings/repository/job_postings.repo.ts` com algoritmo de cálculo de Match Score de competências
- [x] 2.3 Criar módulo GraphQL `src/modules/job_postings` com schema e resolvers para publicação e candidatura rápida
- [x] 2.4 Criar suíte de testes unitários TDD em `tests/unit/modules/job_postings.spec.ts` com 100% de cobertura

## 3. Endossos de Competências e Recomendações (`endorsements`)

- [x] 3.1 Criar modelos Sequelize `SkillEndorsement`, `Recommendation` e suas migrations
- [x] 3.2 Criar módulo GraphQL `src/modules/endorsements` com schema, DTOs, repositório e resolvers para endossos e recomendações
- [x] 3.3 Criar suíte de testes unitários TDD em `tests/unit/modules/endorsements.spec.ts` com 100% de cobertura

## 4. Destaques de Perfil & Feed Algorítmico (`featured_items`)

- [x] 4.1 Criar modelo Sequelize `FeaturedItem` e sua migration
- [x] 4.2 Criar módulo GraphQL `src/modules/featured` com schema, DTOs, repositório e resolvers para itens em destaque e feed ranqueado
- [x] 4.3 Criar suíte de testes unitários TDD em `tests/unit/modules/featured.spec.ts` com 100% de cobertura e validação geral do Jest
