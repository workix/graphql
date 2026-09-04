## Why

A plataforma Workix precisa atender múltiplos clientes corporativos e parceiros que demandam operar seus próprios portais de empregos e carreiras sob sua identidade visual exclusiva (*White Label*), com isolamento de configurações, suporte a domínios personalizados e temas dinâmicos em tempo real sem a necessidade de gerar builds separados de frontend ou duplicar código de backend.

## What Changes

- **Modelo de Dados White Label & Multi-Tenant**: Criação da tabela `white_label_configs` contendo identidade visual (`name`, `slug`, `custom_domain`, `logo_url`, `logo_dark_url`, `favicon_url`, `primary_color`, `secondary_color`, `accent_color`, `background_color`, `text_color`, `font_family`, `app_title`, `meta_description`, `institutional_links`, `custom_css`, `is_active`).
- **Resolução Dinâmica de Tenant & Domínios**: Middleware HTTP e serviço `TenantResolverService` para detectar o cliente ativo por domínio/subdomínio (`Host`), cabeçalhos (`x-tenant-id`, `x-tenant-slug`) ou query params, com fallback automático para o tenant padrão global (*Workix Default*).
- **Isolamento de Configurações**: Cada cliente gerencia exclusivamente seu conjunto de configurações visuais e institucionais sem interferência entre clientes.
- **Módulo GraphQL White Label**:
  - Query pública `whiteLabelConfig(slug: String, domain: String): WhiteLabelConfig!` com cache e fallback seguro.
  - Query administrativa `allWhiteLabelConfigs: [WhiteLabelConfig!]!`.
  - Mutation administrativa `upsertWhiteLabelConfig(input: UpsertWhiteLabelConfigInput!): WhiteLabelConfig!`.
  - Mutation administrativa `deleteWhiteLabelConfig(id: ID!): Boolean!`.
- **Injeção Dinâmica no Frontend e Temas CSS**: Geração de variáveis CSS (`--brand-primary`, `--brand-secondary`, etc.) e injeção em tempo de execução no elemento `:root`, `<title>`, `<link rel="icon">` e componentes visuais.
- **Seeder Oficial de Configuração Padrão**: Seeder com a configuração padrão da Workix para garantir que ambientes existentes continuem funcionando de forma transparente e idêntica.

## Capabilities

### New Capabilities
- `white-label-branding-core`: Gerenciamento centralizado de configurações White Label, resolução multi-tenant por domínio/headers, isolamento de dados e fallback seguro.

### Modified Capabilities
- `graphql-frontend-mapping`: Mapeamento e injeção dinâmica de temas e branding no frontend cliente e admin a partir da consulta `whiteLabelConfig`.

## Impact

- **Banco de Dados & Migrações**: Nova migração criando a tabela `white_label_configs` e seeder com o tenant padrão.
- **Backend & Middleware**: Injeção do contexto do tenant (`ctx.tenant`, `ctx.whiteLabelConfig`) nos resolvers GraphQL.
- **Frontend**: Aplicação de CSS Tokens dinâmicos no DOM sem necessidade de rebuild.
- **Compatibilidade**: Total transparência e fallback para a operação padrão existente.
