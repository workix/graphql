## Why

Candidatos que buscam novas oportunidades profissionais necessitam de visibilidade e inteligência sobre o alcance e atratividade de seus perfis e currículos na plataforma Workix. Atualmente, os candidatos não dispõem de métricas consolidadas sobre quantas vezes apareceram em resultados de busca de recrutadores, quem visitou seu perfil (se recrutadores/empresas ou outros profissionais) e quais termos de pesquisa geraram maior atratividade.

A disponibilização do painel analítico de Visibilidade e Alcance do Currículo com gating de acesso Premium monetiza a base de candidatos, incentiva a assinatura de planos pagos e entrega alto valor percebido ao permitir que o candidato monitore sua exposição, identifique empresas interessadas e otimize seu perfil e palavras-chave para o mercado.

## What Changes

- **Registro e Rastreamento de Aparições em Buscas (Search Appearances / Impressions)**: Implementação do registro automático de impressões sempre que o candidato for listado como resultado no motor de busca (`searchCandidates`), contabilizando palavras-chave e contexto da busca.
- **Rastreabilidade e Identificação de Visualizadores de Perfil**:
  - Classificação do visualizador (`RECRUITER_COMPANY` vs `CANDIDATE_USER`).
  - Resolução dos dados institucionais da empresa/recrutador (nome da empresa, logotipo, cargo ou departamento) para candidatos Premium.
  - Anonimização controlada quando o visualizador tiver configurado `show_as_viewed = false` nas configurações de privacidade.
- **Métricas Temporais e Histórico de Alcance**:
  - Total de visualizações e aparições em buscas em períodos configuráveis (7 dias, 30 dias, 90 dias, 12 meses).
  - Série temporal diária/semanal comparativa entre aparições em buscas e visualizações de perfil (taxa de conversão de cliques).
  - Ranking das principais palavras-chave e filtros que geraram aparições nas buscas.
  - Distribuição percentual de visualizadores por tipo de organização e segmento.
- **Gating de Recursos Premium no Backend e GraphQL**:
  - Usuários no plano Premium recebem todos os dados analíticos desanonimizados, série histórica completa e lista detalhada de empresas e recrutadores.
  - Usuários no plano Free recebem métricas agregadas e uma visualização parcial/mascarada (com blurred placeholder) e CTA para upgrade para o plano Premium.
- **Painel Analítico no Frontend Client (`/analytics/views` / `/analytics/resume-reach`)**:
  - Interface rica com gráficos interativos de evolução temporal de alcance.
  - Cards de métricas-chave (Visualizações de Currículo, Aparições em Buscas, Taxa de Cliques, Empresas Interessadas).
  - Lista detalhada de visitantes com badge diferenciado para recrutadores e links diretos para empresas.
  - Sugestões inteligentes de palavras-chave para otimização de SEO do perfil.

## Capabilities

### New Capabilities
- `candidate-resume-reach-analytics-premium`: Define as regras de negócio, schema GraphQL, registro de impressões de busca, identificação de visualizadores, agregação de métricas temporais e experiência analítica premium de alcance do currículo para candidatos.

### Modified Capabilities
- `candidate-privacy-visibility`: Extensão dos requisitos de privacidade e retenção para cobrir o registro e mascaramento de visualizações e impressões em motores de busca conforme o consentimento (`show_as_viewed`) e plano de assinatura.

## Impact

- **Backend**:
  - Criação da tabela/modelo `candidate_search_impressions` ou `candidate_search_appearances` com migrations Sequelize.
  - Atualização do modelo `ProfileView` e associações com `User`, `Company` e `Candidate`.
  - Novos serviços: `candidate_resume_reach_analytics.service.ts` e atualização do `candidate_search_engine.service.ts` e `visibility.service.ts`.
  - Expansão do Schema GraphQL (`schema.gql` em `analytics` ou `candidates`) com queries `candidateResumeReachAnalytics`, `candidateProfileViewersDetailed` e mutations de tracking.
  - Testes unitários e de integração com Jest/Supertest e mocks de Sequelize.
- **Frontend Client**:
  - Atualização de `ProfileAnalyticsView.vue` e criação/refatoração de componentes visuais analíticos de alcance.
  - Atualização do store Pinia `useAnalyticsStore` e queries GraphQL.
  - Testes de componentes Vue com Vitest.
