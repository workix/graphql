## Purpose

Especifica as telas e integrações complementares necessárias para que 100% dos 32 módulos do ecossistema Workix estejam implementados de forma autônoma e desacoplada em todas as plataformas.

## ADDED Requirements

### Requirement: Painel de Governança de Currículos no Admin
O sistema SHALL fornecer painel dedicado em `/resumes` para auditoria de currículos cadastrados via query `allResumes` e `deleteResume`.

#### Scenario: Visualização de currículos no Admin
- **WHEN** o administrador acessa `/resumes`
- **THEN** a lista de currículos com dados de formação, experiência e competências é exibida.

### Requirement: Painel de Auditoria de Perfis Profissionais no Admin
O sistema SHALL permitir que administradores inspecionem perfis profissionais em `/profiles` via query `allUsers` e visualização de headline e badges.

#### Scenario: Inspeção de perfis no Admin
- **WHEN** o administrador acessa `/profiles`
- **THEN** a lista de perfis com headline, openToWork e status é disponibilizada.

### Requirement: Serviços de Autores e Mídia no Cliente e Android
O sistema SHALL disponibilizar `authors.service.ts`, `AuthorsApiService.kt` e `MediaApiService.kt` para operações diretas e upload de mídia.

#### Scenario: Consulta de autores no Cliente e Mobile
- **WHEN** o aplicativo ou cliente consulta autores via `allAuthors`
- **THEN** os dados de perfil e biografia dos articulistas são carregados diretamente.
