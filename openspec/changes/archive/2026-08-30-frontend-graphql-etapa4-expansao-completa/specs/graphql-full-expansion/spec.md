## Purpose

Define os requisitos e cenários de comportamento para a expansão integral de todos os módulos de domínio nos frontends Web (Cliente e Administrador) e Mobile (Android) a partir das queries e mutations reais do backend GraphQL.

## ADDED Requirements

### Requirement: Módulo de Empresas e Marcas Parceiras
Os três projetos frontends SHALL implementar a consulta e exibição de empresas e parceiros consumindo as queries `allCompanies`, `allCompaniesPaginated`, `getCompanyById` e `listRandomLogos`, além do CRUD de empresas no Frontend Admin (`createCompany`, `updateCompany`, `deleteCompany`).

#### Scenario: Visualização de Perfil de Empresa no Cliente
- **WHEN** o usuário acessa os detalhes de uma empresa (`/companies/:id`)
- **THEN** a tela exibe informações institucionais, logotipo, descrição e lista de vagas ativas da empresa obtidas do GraphQL.

#### Scenario: Gestão de Empresas no Painel Administrativo
- **WHEN** o administrador cria ou edita uma empresa no painel administrativo
- **THEN** a mutation correspondente (`createCompany` ou `updateCompany`) é executada e os dados refletem instantaneamente na listagem.

### Requirement: Módulo de Candidatos, Currículos e Processos Seletivos
Os frontends SHALL permitir aos usuários o gerenciamento de currículos (`createResume`, `updateResume`, `deleteResume`, `allResumesPaginated`) e inscrição em processos seletivos (`subscribeInSelectiveProcess`, `mySelectiveProcessesSubscribed`), além do acompanhamento administrativo de candidaturas (`notifyCandidate`).

#### Scenario: Submissão de Currículo pelo Candidato
- **WHEN** o candidato preenche seus dados profissionais e salva o currículo
- **THEN** o sistema executa a mutation `createResume` ou `updateResume`, confirmando o salvamento com sucesso.

### Requirement: Módulo de Conteúdo (Blog, Comentários, Depoimentos, Formulários)
Os frontends SHALL disponibilizar as páginas institucionais e de engajamento consumindo `allBlogsPaginated`, `getBlogById`, `createComment`, `allTestimonialsPaginated` e submissão de formulários (`createForm`, `subscribeMail`), com moderação e CRUD completo no Frontend Admin.

#### Scenario: Leitura e Comentário em Artigo do Blog
- **WHEN** o leitor visualiza um artigo do blog e submete um novo comentário
- **THEN** a mutation `createComment` é processada e o comentário passa a integrar a lista após confirmação.

### Requirement: Painel de Indicadores e Gestão de Acesso no Admin
O Frontend Admin SHALL apresentar um dashboard inicial com estatísticas consolidadas (`statisticsCount`) e telas de gerenciamento de usuários e controle de acesso JAAS (`allUsersPaginated`, `allJAASRolesPaginated`, `allJAASUsersPaginated`).

#### Scenario: Visualização de Métricas no Dashboard Admin
- **WHEN** o administrador acessa o dashboard inicial
- **THEN** os cards de estatísticas exibem as contagens reais retornadas pela query `statisticsCount`.
