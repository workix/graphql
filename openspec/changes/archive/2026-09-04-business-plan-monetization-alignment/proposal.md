## Why

O plano de negócio do Workix (versão 2.0, Setembro de 2026 - *Workix: Plano de Negócio, Monetização e Reposicionamento*) consolida a mudança estratégica do ecossistema: a Workix adota o modelo de monetização de acesso e visibilidade em ambos os lados do marketplace (inspirado no LinkedIn, com assinaturas de empresas, vagas patrocinadas, selo de verificação e Workix Premium para candidatos). No entanto, diferencia-se radicalmente dos concorrentes (LinkedIn, Catho, Indeed) ao instituir salvaguardas de transparência e integridade inegociáveis (*Os 5 Pactos da Workix*): gratuidade de participação, rotulagem obrigatória e imutável de itens patrocinados (`is_sponsored`), preservação estrita do ranking orgânico, liberação de dados somente sob consentimento explícito e combate rigoroso a vagas fantasmas com taxa de resposta pública.

Para viabilizar este modelo sem expor o projeto solo a riscos operacionais ou de conformidade (LGPD, ANPD, abusos de mercado), a aplicação precisa evoluir em *baby steps* arquiteturais e funcionais bem delimitados.

## What Changes

- **Pactos de Transparência e Governança Open Core**: Documentação pública e auditabilidade da fórmula de ranqueamento orgânico (`RANKING.md`), política de marcas (`TRADEMARK.md`), acordo de contribuição (`CLA.md`), política de privacidade (`PRIVACY.md`) e guia de auto-hospedagem (`SELF-HOSTING.md`).
- **Conformidade LGPD & Consentimento do Candidato**:
  - Remoção da obrigatoriedade do CPF no cadastro de candidatos (substituído por e-mail verificado como chave de unicidade).
  - Controle de visibilidade pelo candidato em 3 chaves (`visibility_settings`): aparecer na busca, visível como aberto a oportunidades (*open-to-work* sem expor ao empregador atual) e exibir status de perfil visualizado.
  - Função server-side `reveal()` para controle rigoroso de exposição de dados pessoais e descarte de dados/purga periódica de logs de visualização (`profile_views`).
- **Integridade de Vagas & Combate a Vagas Fantasmas**:
  - Validação de CNPJ e domínio de e-mail corporativo para empresas contratantes.
  - Validade e expiração automática de vagas com exigência de desfecho do processo seletivo.
  - Cálculo automatizado e exibição pública da taxa de resposta de 90 dias (`response_rate_90d`) e tempo mediano de resposta da empresa.
  - Critérios auditados de mérito para concessão do Selo de Empresa Verificada (sem venda direta de selo sem conformidade).
- **Motor de Entitlements & Catálogo de Planos**:
  - Modelagem dinâmica de planos (`plans`), limites/recursos (`plan_features`), assinaturas (`subscriptions`) e contadores de consumo com janela (`usage_counters`).
  - Função server-side `can(organization, feature_key, quantity)` para aplicação centralizada de permissões e paywall sem if/else espalhado no código.
  - Degradação suave no downgrade (arquivamento de excedentes sem destruição de dados).
- **Motor de Vagas em Destaque (Sponsored Jobs)**:
  - Criação de impulsionamento de vagas (`job_boosts`, `purchases`) com posições limitadas por categoria/região (`max_concurrent_slot`).
  - Injeção obrigatória e imutável de `is_sponsored = true` e `sponsor_label = 'Patrocinada'` nos resolvers e schemas de busca, mantendo intacto o ranking orgânico.
- **Desbloqueio de Contatos com Notificação**:
  - Registro de `contact_unlocks` com obrigatoriedade de notificação ao candidato titular (`notified_candidate_at`).
- **Billing & Faturamento Nacional**:
  - Suporte a gateway de pagamento brasileiro (Asaas/Iugu) com Pix, Cartão e Boleto, além de emissão automatizada de NFS-e.
  - Persistência e processamento idempotente de webhooks (`webhook_events`) e log imutável de auditoria (`billing_audit_log`).

## Capabilities

### New Capabilities
- `governance-transparency-core`: Princípios da Workix, governança open core (núcleo AGPLv3 vs motor comercial fechado), fórmula de ranking orgânico (`RANKING.md`), termos de marca e CLA.
- `candidate-privacy-visibility`: Adequação LGPD com remoção de CPF obrigatório no cadastro, tabela `visibility_settings`, função `reveal()` e retenção auditável de `profile_views`.
- `anti-ghost-jobs-integrity`: Validade obrigatória de vagas, desfecho de candidaturas, cálculo e publicação da taxa de resposta de 90 dias (`response_rate_90d`) e regras do Selo de Empresa Verificada.
- `entitlements-plans-engine`: Catálogo dinâmico de planos B2B (Free, Starter, Pro, Business), tabela de limites `plan_features`, rastreamento `usage_counters` e middleware/função `can()`.
- `sponsored-jobs-engine`: Alocação de vagas patrocinadas (`job_boosts`, `purchases`), limite de slots por região/categoria, enforcement inegociável de rotulagem `is_sponsored` e preservação do ranking orgânico.
- `contact-unlocks-inmail`: Desbloqueio auditado de contato de candidatos por recrutadores com notificação obrigatória ao titular (`contact_unlocks`).
- `billing-gateway-integration`: Conexão com gateway nacional (Asaas/Iugu), fluxo idempotente de webhook events, emissão de NFS-e, gestão de faturas e dunning.

### Modified Capabilities
- `graphql-jobs-feature`: Atualização dos contratos GraphQL e repositórios de vagas para suportar datas de validade, encerramento com desfecho e slots adicionais de destaque rotulado sem suprimir vagas orgânicas.
- `premium-subscriptions-core`: Reestruturação do módulo de assinaturas para compatibilidade com o novo modelo de faturamento orientado a planos versionados e entitlements dinâmicos.

## Impact

- **Banco de Dados (Sequelize / Migrations)**:
  - Novas tabelas: `plans`, `plan_features`, `subscriptions`, `subscription_overrides`, `usage_counters`, `purchases`, `job_boosts`, `profile_boosts`, `visibility_settings`, `profile_views`, `contact_unlocks`, `invoices`, `webhook_events`, `billing_audit_log`.
  - Alterações em `candidates`: remoção da restrição de obrigatoriedade de CPF no signup inicial.
  - Alterações em `companies` / `organizations`: inclusão de `cnpj`, `slug`, `verified_at`, `response_rate_90d`.
  - Alterações em `jobs`: inclusão de expiração obrigatória (`expires_at`), desfecho (`outcome_status`) e vínculos de destaque.
- **GraphQL API (Schemas & Resolvers)**:
  - Middlewares de autorização `can()` e `reveal()` integrados ao pipeline de execução.
  - Novos tipos e queries/mutations para planos, checkout de destaque, chaves de privacidade do candidato, e relatórios de taxa de resposta pública.
- **Frontend Web (Vue.js) & Mobile**:
  - Exibição visível de rótulos "Patrocinada" e "Perfil em destaque".
  - Telas de configuração de privacidade do candidato (3 chaves).
  - Exibição pública da taxa de resposta na página da empresa.
