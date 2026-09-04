## Context

A plataforma Workix opera com backend Node.js/TypeScript (Express + Apollo Server + Sequelize + SQLite/Postgres) e aplicações frontend (React Web Cliente, React Web Admin e Kotlin Android). Veja `proposal.md` para motivação.

Para suportar múltiplos clientes corporativos sem duplicar infraestrutura ou gerar builds separados para cada tenant, o design estabelece um mecanismo de resolução dinâmica de tenant e injeção de tokens visuais em tempo de execução.

## Goals / Non-Goals

**Goals:**
- Criar a tabela `white_label_configs` com suporte a identificação, domínios personalizados, paleta de cores hexadecimais, logos (light e dark), favicons, tipografia e metadados institucionais.
- Desenvolver o serviço `TenantResolverService` com suporte a cache em memória e resolução por `Host` (custom domain/subdomínio), cabeçalho `x-tenant-slug`, cabeçalho `x-tenant-id` e fallback automático para o tenant padrão (`slug: "default"`).
- Integrar `TenantMiddleware` no pipeline Express e no contexto do Apollo Server (`context.tenant`, `context.whiteLabelConfig`).
- Implementar módulo GraphQL dedicado com Schema SDL e Resolvers (`whiteLabelConfig`, `allWhiteLabelConfigs`, `upsertWhiteLabelConfig`, `deleteWhiteLabelConfig`).
- Prover seeder de configuração padrão (*Workix Default*) com cores, logos e títulos institucionais garantindo retrocompatibilidade 100% transparente.
- Especificar e padronizar o consumo no frontend com injeção de CSS Custom Properties (`:root { --brand-primary: ... }`), `<title>` dinâmico e `<link rel="icon">`.
- Cobertura completa de testes unitários e de integração para validação de cenários de tenant resolution, cache, queries e mutations.

**Non-Goals:**
- Separação em bancos de dados físicos distintos por cliente (arquitetura multi-tenant lógica com isolamento de metadados e configuração).
- Geração de builds estáticos de frontend separados por cliente.
- Suporte a templates HTML arbitrários não sanitizados no frontend.

## Decisions

1. **Modelo de Dados Unificado com Sequelize**:
   - *Decisão*: Criar o modelo `WhiteLabelConfig` com campos indexados (`slug`, `custom_domain`) para buscas ultra-rápidas.
   - *Alternativas consideradas*: Armazenar configurações em arquivos JSON estáticos (rejeitado por não permitir CRUD dinâmico via Admin) ou banco NoSQL separado (rejeitado para manter integridade relacional).

2. **Resolução de Tenant em Camada Dupla (Middleware + Cache Service)**:
   - *Decisão*: `TenantResolverService` com cache em memória (TTL configurável) e busca ordenada: 1) `x-tenant-slug` / `x-tenant-id`, 2) `Host` (domínio/subdomínio), 3) Fallback para `default`.
   - *Alternativas consideradas*: Consultar o banco em cada resolver GraphQL (rejeitado por overhead de I/O em requisições de alto tráfego).

3. **Injeção Dinâmica de CSS Variables no Frontend**:
   - *Decisão*: O frontend consome a query `whiteLabelConfig` na inicialização e injeta `--brand-primary`, `--brand-secondary`, `--brand-accent`, `--brand-background`, `--brand-text` e `--brand-font` no elemento `:root` do DOM, além de atualizar `<title>` e `<link rel="icon">`.
   - *Alternativas consideradas*: Tailwind CSS compilation em tempo de execução (rejeitado por complexidade e peso no bundle).

4. **Tratamento de Fallback Robusto**:
   - *Decisão*: Se o cliente não possuir determinada cor ou logotipo definido, o resolver/frontend preenche automaticamente com o valor correspondente da identidade padrão Workix.

## Risks / Trade-offs

- **[Risco: Domínio não cadastrado ou requisição inválida]** → *Mitigação*: Fallback automático e transparente para a configuração padrão `default`, sem quebrar a renderização do frontend nem emitir erros 500 no backend.
- **[Risco: Injeção de CSS malicioso em custom_css]** → *Mitigação*: Sanitização e validação de strings CSS antes da persistência e renderização.
- **[Risco: Invalidação de Cache de Tenant]** → *Mitigação*: Invalidação automática das chaves de cache em memória no `TenantResolverService` quando ocorrerem mutations de `upsert` ou `delete`.

## Migration Plan

1. Executar migração `20260904140000-create_table_white_label_configs.ts`.
2. Executar seeder `20260904141000-seed_default_white_label_config.ts` criando o tenant padrão `default` (*Workix*).
3. Registrar o novo schema e resolvers no bootstrap do servidor GraphQL.
4. Manter compatibilidade com qualquer cliente legado que não envie cabeçalhos de tenant.
