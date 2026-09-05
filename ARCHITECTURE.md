# Workix - Arquitetura de Software Profissional

Este documento descreve a arquitetura geral da plataforma Workix, projetada seguindo rigorosos padrões de confiabilidade, segurança, escalabilidade, observabilidade e manutenibilidade.

---

## 1. Visão Geral da Arquitetura

A plataforma adota um modelo em camadas (*Layered Architecture*) com separação estrita de responsabilidades (*Separation of Concerns*):

```text
┌─────────────────────────────────────────────────────────────┐
│                       Clientes / Frontends                  │
│       (React Web Cliente, React Web Admin, Kotlin Android)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / GraphQL / WSS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 API Gateway / Express Pipeline              │
│  ├── CORS & Headers                                         │
│  ├── Trace Middleware (x-trace-id / Correlation ID)         │
│  ├── Idempotency Guard (Idempotency-Key)                    │
│  ├── Tenant Resolver Middleware (Multi-Tenant/White Label)  │
│  └── JWT Authentication Middleware                          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Camada GraphQL (Apollo Server)             │
│  ├── Schemas SDL modularizados (.gql)                       │
│  ├── Resolvers & Composable Middleware                      │
│  ├── DataLoaders (Batching & Caching - Zero N+1)            │
│  └── Subscriptions Server (WebSocket Heartbeat)             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Camada de Domínio / Serviços               │
│  ├── EntitlementsService (Controle can() e planos)          │
│  ├── VisibilityService (Privacidade de candidatos reveal()) │
│  ├── BillingGatewayService (Cobranças Pix e Webhooks)       │
│  ├── JobSearchEngine (Adaptive / Postgres FTS / Elastic)    │
│  └── TenantResolverService (Configurações White Label)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Camada de Persistência & Mensageria         │
│  ├── Repositórios & Modelos Sequelize (Postgres / SQLite)    │
│  ├── Pool de Conexões Otimizado                              │
│  ├── Filas RabbitMQ (Indexação assíncrona & Notificações)   │
│  └── Elasticsearch Cluster (Motor distribuído de busca)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Princípios Arquiteturais

1. **Separação de Responsabilidades (SRP)**:
   - Resolvers GraphQL atuam apenas como adaptadores de entrada/saída.
   - Regras de negócio residem exclusivamente nos Serviços de Domínio.
   - Acesso a dados é encapsulado em Repositórios e Modelos Sequelize.

2. **Zero N+1 Queries**:
   - Uso intensivo de `DataLoaderFactory` para batching e caching por requisição.

3. **Multi-Tenant & White Label Nativo**:
   - Identificação dinâmica de tenant por domínio (`Host`), cabeçalhos (`x-tenant-slug`, `x-tenant-id`) ou fallback seguro para o tenant padrão (`Workix Default`).
   - Injeção dinâmica de CSS variables no DOM do frontend sem necessidade de gerar novos builds estáticos por cliente.

4. **Observabilidade Contínua**:
   - Rastreamento fim a fim com `traceId` / `x-correlation-id`.
   - Logs estruturados em formato JSON com timestamp ISO, tenant, duração e status.
   - Sondas `/health/live` e `/health/ready` para orquestração em Kubernetes/Cloud.

5. **Proteção e Idempotência**:
   - Suporte ao cabeçalho `Idempotency-Key` em operações críticas.
   - Formatação segura de erros sem vazamento de stack traces ou detalhes técnicos de banco em produção.

6. **Categorias de Vagas & Filtros Multiplataforma**:
   - Categorização flexível (`categories`) e tipo de contratação (`employment_type`) integrados de ponta a ponta no Backend GraphQL, Frontend Web e Aplicativo Android.
   - Compatibilidade retroativa garantida para vagas legadas (defaults defensivos e sanitização em DTOs).
   - Suporte a filtros compostos no motor de busca e facetas em tempo real para navegação e descoberta de oportunidades.

7. **Capabilities de Candidatos e Recrutamento Avançado**:
   - **Currículo Normalizado em Markdown**: Armazenamento estruturado, sanitização anti-XSS e pontuação de completude automática (`NormalizedResume`).
   - **Status de Carreira e Visibilidade**: Gestão de `looking_for_job`, `in_career_transition`, `career_transition_target` e `accepts_entry_level` com respeito rigoroso às chaves de visibilidade em `VisibilityService`.
   - **Vagas Confidenciais (Premium)**: Mascaramento dinâmico e seguro no resolver GraphQL `Job.company` com autorização server-side `POST_CONFIDENTIAL_JOBS`.
   - **Agenda de Entrevistas (Premium)**: Gestão completa do ciclo de vida de entrevistas (Presencial, Remota, Híbrida) e respostas de candidatos com autorização `SCHEDULE_INTERVIEWS`.
   - **Quadro Kanban de Triagem (Premium)**: Pipeline visual de candidatos com ordenação customizável, transições auditáveis em `kanban_card_histories` e autorização `USE_RECRUITMENT_KANBAN`.
   - **Motor de Busca Avançada de Candidatos**: `CandidateSearchEngineService` com filtros combinados por status profissional, transição de carreira e termos de currículo Markdown.


