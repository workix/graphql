## Purpose

Fornece a estrutura central de White Label e Multi-Tenant da plataforma Workix, permitindo resolução dinâmica de clientes por domínio/cabeçalhos, isolamento de configurações visuais e institucionais, e fallback transparente para a identidade padrão.

## ADDED Requirements

### Requirement: Resolução Dinâmica de Tenant por Domínio e Cabeçalhos
O backend SHALL identificar o tenant solicitante a partir do cabeçalho `Host` (custom domain ou subdomínio), cabeçalhos HTTP específicos (`x-tenant-id`, `x-tenant-slug`) ou query params, injetando as configurações ativas no contexto da requisição GraphQL.

#### Scenario: Resolução de Tenant por Domínio Personalizado
- **WHEN** uma requisição HTTP chega com o cabeçalho `Host: vagas.empresa-acme.com` cadastrado no sistema
- **THEN** o sistema resolve o tenant correspondente e disponibiliza as configurações White Label da Acme no contexto GraphQL

#### Scenario: Fallback Automático para Configuração Padrão
- **WHEN** uma requisição chega sem identificador de tenant ou com domínio não reconhecido
- **THEN** o sistema aplica automaticamente a configuração White Label padrão da plataforma Workix

### Requirement: Gerenciamento e Armazenamento de Configurações White Label
O sistema SHALL armazenar e gerenciar configurações completas de White Label por tenant, incluindo identificação (`slug`, `name`, `custom_domain`), branding (`logo_url`, `logo_dark_url`, `favicon_url`), paleta de cores (`primary_color`, `secondary_color`, `accent_color`, `background_color`, `text_color`, `font_family`), textos e metadados institucionais (`app_title`, `meta_description`, `institutional_links`, `custom_css`) e status de ativação (`is_active`).

#### Scenario: Cadastro e Atualização de Configurações de Cliente
- **WHEN** um administrador executa a mutation `upsertWhiteLabelConfig` com os parâmetros visuais e domínio do cliente
- **THEN** o sistema valida e persiste as configurações no banco de dados com chave única de slug e domínio

#### Scenario: Consulta Pública de Configuração de Branding
- **WHEN** uma aplicação cliente consulta a query `whiteLabelConfig` informando slug ou domínio
- **THEN** o sistema retorna as configurações ativas de branding e identidade visual do tenant solicitado

### Requirement: Isolamento de Dados e Configurações entre Clientes
O sistema SHALL garantir o isolamento estrito das configurações White Label de cada cliente, impedindo que alterações em um tenant afetem os dados ou a identidade visual de outros clientes.

#### Scenario: Isolamento em Múltiplos Tenants
- **WHEN** configurações de identidade visual do tenant A são atualizadas
- **THEN** as configurações e o tema visual do tenant B permanecem inalterados e isolados
