# Proposta: Etapa 4 — Expansão Completa de Todas as Telas e CRUDs nos 3 Frontends

## Why
Com a infraestrutura de transporte GraphQL configurada e o módulo de Vagas validado, é necessário expandir a cobertura para 100% das entidades e fluxos do backend GraphQL. O objetivo é transformar o Frontend Cliente, o Frontend Admin e o aplicativo Android em aplicações completas, funcionais e totalmente integradas a `http://localhost:4000/graphql`, eliminando quaisquer telas isoladas ou dados mockados.

## What Changes
- **Frontend Cliente (`frontend/client`)**:
  - Implementação das telas e fluxos de Empresas (`/companies`, `/companies/:id`), Currículos (`/resumes`, `/resume/add`, `/resume/edit`), Processos Seletivos (`/selective-processes`), Blog e Notícias (`/blog`, `/blog/:id`, comentários), Depoimentos (`/testimonials`), e Formulários/Contato (`/contact`).
- **Frontend Admin (`frontend/admin`)**:
  - Implementação de todos os CRUDs administrativos com Vuetify 3:
    - Dashboard de Estatísticas (`statisticsCount`).
    - Gestão de Empresas (`allCompaniesPaginated`, `createCompany`, `updateCompany`, `deleteCompany`).
    - Gestão de Candidatos e Currículos (`allCandidatesPaginated`, `allResumesPaginated`, `notifyCandidate`).
    - Gestão de Processos Seletivos (`allSelectiveProcessesPaginated`, `createSelectiveProcess`, etc.).
    - Gestão de Usuários e JAAS Roles/Permissions (`allUsersPaginated`, `allJAASUsersPaginated`, `allJAASRolesPaginated`, etc.).
    - Gestão de Blog, Categorias e Comentários (`allBlogsPaginated`, `allCommentsPaginated`, etc.).
    - Gestão de Depoimentos, Formulários e Inscritos na Newsletter.
- **Android (`android/`)**:
  - Implementação das telas de Perfil/Currículo do Candidato, Busca e Detalhes de Empresas, Processos Seletivos inscritos, e visualização de Artigos/Blog.
- Tratamento exaustivo de paginação, filtros, ordenação, estados de carregamento, estados vazios e mensagens de erro e sucesso em todas as interfaces.

## Capabilities

### New Capabilities
- `graphql-full-expansion`: Expansão exaustiva de todas as entidades de domínio nos três projetos frontends (Client, Admin, Android) cobrindo listagens, detalhes, CRUDs administrativos, formulários e subscrições conectadas diretamente ao backend GraphQL.

### Modified Capabilities
<!-- Nenhuma especificação existente teve seus requisitos alterados nesta etapa -->

## Impact
- **Frontend Cliente**: Cobertura total das rotas do template Jobseek consumindo dados vivos da API.
- **Frontend Admin**: Sistema administrativo integral para operação do produto com gestão de todas as tabelas.
- **Android**: Aplicativo móvel completo para candidatos e empresas.
- **Qualidade**: Eliminação de todo e qualquer dado fake/mock no ecossistema.
