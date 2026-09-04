## Context

A plataforma Workix opera sobre uma arquitetura de Monólito Modular em Node.js com TypeScript, Express, GraphQL (Apollo Server), Sequelize ORM, Redis e RabbitMQ. O plano de negócio (Versão 2.0, Setembro de 2026) estabelece um reposicionamento com monetização de visibilidade e acesso, sustentado por salvaguardas técnicas auditáveis (os 5 Pactos).

Este design técnico formaliza a arquitetura dos subsistemas necessários para suportar o plano em etapas incrementais (*baby steps*): governança open core, privacidade LGPD, integridade de vagas, motor de entitlements orientados a dados, impulsionamento rotulado de vagas e faturamento nacional idempotente.

## Goals / Non-Goals

**Goals:**
- Implementar controle centralizado server-side de capacidade e visibilidade via funções `can()` e `reveal()`.
- Adequar o cadastro e visibilidade às exigências da LGPD, removendo a obrigatoriedade de CPF no cadastro de candidatos e fornecendo as 3 chaves de controle em `visibility_settings`.
- Prover rotinas de combate a vagas fantasmas com validade obrigatória, desfecho de candidaturas e cálculo da taxa de resposta de 90 dias (`response_rate_90d`) exibida publicamente.
- Implementar motor de catálogo de planos versionados em banco de dados (`plans`, `plan_features`) e contadores de consumo com janela (`usage_counters`).
- Implementar suporte a vagas patrocinadas (`job_boosts`) com posições delimitadas por categoria/região e rotulagem imutável (`is_sponsored = true`, `sponsor_label = 'Patrocinada'`) sem degradar a busca orgânica.
- Estruturar o recebimento idempotente de webhooks (`webhook_events`) e trilha de auditoria (`billing_audit_log`).
- Publicar documentos de governança open core (`RANKING.md`, `TRADEMARK.md`, `CLA.md`, `PRIVACY.md`, `SELF-HOSTING.md`).

**Non-Goals:**
- Implementar algoritmos complexos de leilão de CPC no núcleo aberto (a precificação nesta fase é fixa por período, e o motor de leilão avançado pertence ao repositório comercial fechado `workix-enterprise`).
- Desenvolver módulos de analytics avançados de concorrência ou inteligência preditiva nesta fase inicial.
- Executar automação de emissão fiscal ou cobrança real sem a obtenção prévia de liquidez mínima (Fase 1 do GTM).

## Decisions

### Decisão 1: Limites Orientados a Dados (`plan_features`) vs Constantes no Código
- **Escolha**: Definir os limites de vagas ativas, usuários, créditos de contato e destaques na tabela `plan_features`, vinculada a planos versionados (`plans`).
- **Racional**: Permite que ofertas, descontos de fundador e ajustes comerciais ocorram sem necessidade de novo deploy de código, além de viabilizar auditoria histórica de condições contratadas.
- **Alternativas consideradas**: Constantes hardcoded ou enums no TypeScript (rejeitadas por exigirem deploy a cada alteração de preço ou limite).

### Decisão 2: Funções de Decisão Centralizadas Server-Side (`can()` e `reveal()`)
- **Escolha**: Todas as verificações de permissão e capacidade chamam `can(organization, feature_key, quantity)` e todas as consultas de dados pessoais chamam `reveal(candidate, viewer_organization, data_scope)` no backend.
- **Racional**: Garante que o cliente nunca decida permissão (essencial em código aberto) e impede bypass acidental de regras de privacidade e consentimento da LGPD. `reveal()` nunca utiliza cache para garantir aplicação imediata de revogação de consentimento pelo usuário.
- **Alternativas consideradas**: Validações distribuídas em cada resolver individual (rejeitadas pelo alto risco de inconsistência e vazamento de dados).

### Decisão 3: Separação Estrita entre Selo de Empresa Verificada e Vaga em Destaque
- **Escolha**: O Selo Verificado é concedido exclusivamente por critérios auditados de mérito comportamental (CNPJ ativo, taxa de resposta >= 80%, tempo de resposta <= 14 dias), enquanto o Destaque de Vaga é uma compra de alcance de mídia rotulado.
- **Racional**: Preserva a credibilidade da plataforma, evitando que o selo se torne uma forma disfarçada de compra de visibilidade.

### Decisão 4: Persistência Prévia e Idempotência de Webhooks (`webhook_events`)
- **Escolha**: Todo evento recebido do gateway de pagamento é gravado com chave única `gateway_event_id` antes de qualquer execução de mudança de estado em `subscriptions` ou `purchases`.
- **Racional**: Elimina falhas por retransmissão de eventos e inconsistências de rede comuns em gateways de pagamento.

### Decisão 5: Identificação de Candidato por E-mail Verificado (Sem CPF no Cadastro)
- **Escolha**: Chave de unicidade de pessoa física baseada em e-mail verificado (via Firebase Auth / JWT), postergando a coleta de CPF estritamente para o momento da formalização de contratação pela empresa.
- **Racional**: Conformidade direta com o princípio da necessidade da LGPD (Art. 6º, III), minimizando o risco de vazamento de dados sensíveis.

## Risks / Trade-offs

- **[Vazamento acidental de dados pessoais]** → Toda resolução de dados de candidato passa obrigatoriamente pela função `reveal()`, impedindo retorno de e-mail/telefone/CV completo caso `searchable_by_recruiters = false` ou ausente de `contact_unlocks`.
- **[Duplicação de eventos de pagamento e créditos]** → Índice único em `gateway_event_id` na tabela `webhook_events` com transações ACID no banco de dados.
- **[Sobrecarga ou canibalização da busca orgânica por vagas pagas]** → Limite rígido de slots patrocinados simultâneos por categoria/região (`max_concurrent_slot`, máximo 3 posições) e renderização das vagas orgânicas completas logo abaixo.
- **[Risco de alteração estrutural no banco em produção]** → Criação de migrações reversíveis com campos anuláveis ou defaults seguros, sem operações destrutivas.

## Migration Plan

1. **Migrações de Banco de Dados**:
   - Criação das tabelas de governança e faturamento (`plans`, `plan_features`, `subscriptions`, `subscription_overrides`, `usage_counters`, `purchases`, `job_boosts`, `profile_boosts`, `visibility_settings`, `profile_views`, `contact_unlocks`, `invoices`, `webhook_events`, `billing_audit_log`).
   - Adição de colunas nas tabelas existentes (`jobs.expires_at`, `jobs.outcome_status`, `companies.response_rate_90d`, `companies.verified_at`).
2. **Carga Inicial (Seeds)**:
   - Inserção dos planos versionados: `free_v1`, `starter_v1`, `pro_v1`, `business_v1` e configuração inicial de `plan_features`.
3. **Deploy de Serviços & Middlewares**:
   - Ativação dos middlewares `can()` e `reveal()`.
   - Disponibilização dos novos endpoints e resolvers GraphQL.
4. **Publicação de Governança Open Core**:
   - Inclusão dos arquivos `RANKING.md`, `TRADEMARK.md`, `CLA.md`, `PRIVACY.md` e atualização do `README.md`.
