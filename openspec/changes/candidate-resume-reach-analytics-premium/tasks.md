## 1. Database, Models & Migrations

- [ ] 1.1 Criar migration Sequelize `20260905193000-create_tables_candidate_search_appearances.ts` para registro de impressões nos motores de busca
- [ ] 1.2 Implementar modelo Sequelize `CandidateSearchAppearance` e registrar associações com `Candidate`, `User` e `Company` em `src/models`
- [ ] 1.3 Atualizar modelo `ProfileView` e associações no ORM para suportar resolução de dados de recrutadores e empresas

## 2. Backend Services & Search Engine Tracking

- [ ] 2.1 Implementar `candidate_resume_reach_analytics.service.ts` com métodos de cálculo de métricas de alcance, séries temporais diárias e ranking de termos de busca
- [ ] 2.2 Integrar gravação em lote e assíncrona de aparições em busca no `candidate_search_engine.service.ts`
- [ ] 2.3 Implementar resolução detalhada de visualizadores com distinção entre recrutador e candidato e anonimização recíproca (`show_as_viewed`)
- [ ] 2.4 Atualizar rotina de purga periódica em `visibility.service.ts` para cobrir retenção de `candidate_search_appearances`

## 3. GraphQL Schema, Resolvers & Gating

- [ ] 3.1 Definir types, inputs e queries GraphQL (`candidateResumeReachAnalytics` e `candidateProfileViewersDetailed`) no schema
- [ ] 3.2 Implementar resolvers GraphQL com regras de gating por plano de assinatura (Free mascarado vs Premium completo)
- [ ] 3.3 Atualizar seeder de dados demonstrativos com histórico realista de visualizações e aparições em buscas

## 4. Frontend Client Analytics Dashboard

- [ ] 4.1 Atualizar store Pinia `useAnalyticsStore` com queries GraphQL e gerenciamento de estado de alcance do currículo
- [ ] 4.2 Enriquecer `ProfileAnalyticsView.vue` com cards de KPIs, gráficos interativos de evolução temporal, lista de empresas visitantes e ranking de palavras-chave
- [ ] 4.3 Implementar componentes visuais de gating e CTA de upgrade para usuários no plano Free

## 5. Automated Testing & Validation

- [ ] 5.1 Desenvolver testes automatizados no backend cobrindo registro de impressões, métricas analíticas e gating de segurança
- [ ] 5.2 Desenvolver testes de componentes no frontend com Vitest para `ProfileAnalyticsView.vue` e stores Pinia
- [ ] 5.3 Executar suíte completa de testes no backend e frontend para validar integridade de 100%
