# Relatório de Implementações Técnicas do Ecossistema Workix

**Data de Atualização**: 29/08/2026  
**Projeto Maestro**: `graphql` (`C:\Packsys\NetBeansProjects\graphql`)  
**Documento de Referência da Regra de Negócio**: [`SPECIFICATION.md`](file:///c:/Packsys/NetBeansProjects/graphql/SPECIFICATION.md)

---

## 1. Visão Geral da Arquitetura Multi-Projeto

O ecossistema **Workix** é uma plataforma de recrutamento, seleção e empregabilidade composta por 4 projetos interdependentes. O projeto **`graphql`** atua como o **Projeto Pai (Maestro)**, coordenando a transição da arquitetura legada para a nova arquitetura baseada em Node.js e GraphQL.

```
                         ┌─────────────────────────────────┐
                         │      workix-frontend-vue        │
                         │   (Vue 3 + Vuex + Vue Router)   │
                         └────────────────┬────────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
┌───────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────┐
│        graphql        │   │    workix-spring-boot    │   │      java-stack       │
│  (Node.js + GraphQL)  │   │  (Spring Boot 2 + REST)   │   │  (Java EE + WildFly)  │
│    [PROJETO MAESTRO]  │   │     [SEGUNDA VERSÃO]      │   │    [BACKEND LEGADO]   │
└───────────────────────┘   └───────────────────────────┘   └───────────────────────┘
```

---

## 2. Projeto `graphql` (Projeto PAI / Novo Backend)

**Caminho no Sistema**: `C:\Packsys\NetBeansProjects\graphql`  
**Tecnologia**: Node.js, Express, Apollo Server / Express GraphQL, Sequelize ORM, MySQL/PostgreSQL, Redis, Elasticsearch, DataLoader.

### 2.1. Estrutura Principal de Diretórios
- `src/index.js`: Ponto de entrada da aplicação (inicialização do Express e servidor GraphQL).
- `src/models/`: Definições dos modelos Sequelize e relacionamentos.
- `src/modules/`: Módulos de negócio contendo schemas GraphQL, resolvers e serviços.
- `src/dataloader.js`: Otimização de consultas N+1 com DataLoader.
- `src/composable_resolvers/`: Middleware de composição de resolvers (autenticação, permissões).
- `src/dtos/` & `src/factory/`: Transfere de dados e factories de objetos.

### 2.2. Entidades de Dados (Sequelize Models - 29 Entidades)
1. `Author` (`author.js`): Autores de posts de blog.
2. `AuthorMedias` (`author_medias.js`): Redes sociais de autores.
3. `Blog` (`blog.js`): Postagens do blog.
4. `BlogCategories` (`blog_categories.js`): Categorias de blogs.
5. `BlogComments` (`blog_comments.js`): Comentários em postagens.
6. `BlogPictures` (`blog_pictures.js`): Imagens vinculadas aos blogs.
7. `BlogTags` (`blog_tags.js`): Tags dos artigos do blog.
8. `Candidate` (`candidate.js`): Perfil de candidatos a vagas.
9. `Comment` (`comment.js`): Comentários gerais de avaliação/feedbacks.
10. `Company` (`company.js`): Empresas contratantes.
11. `CompanyMedias` (`company_medias.js`): Mídias e redes sociais de empresas.
12. `Form` (`form.js`): Formulários de contato/suporte.
13. `JAASRole` (`jaas_role.js`): Papéis/Funções do sistema de segurança (JAAS).
14. `JAASRoles` (`jaas_roles.js`): Associação de papéis.
15. `JAASUser` (`jaas_user.js`): Usuários de autenticação JAAS.
16. `Job` (`job.js`): Vagas de emprego anunciadas.
17. `JobsCandidates` (`jobs_candidates.js`): Candidaturas realizadas em vagas.
18. `Member` (`member.js`): Membros da equipe/time.
19. `MemberMedias` (`member_medias.js`): Mídias sociais dos membros do time.
20. `Resume` (`resume.js`): Currículos profissionais.
21. `ResumeEducations` (`resume_educations.js`): Histórico educacional no currículo.
22. `ResumeExperiences` (`resume_experiences.js`): Experiências profissionais.
23. `ResumeSkills` (`resume_skills.js`): Habilidades declaradas no currículo.
24. `SelectiveProcess` (`selective_process.js`): Processos seletivos estruturados.
25. `SelectiveProcessCandidates` (`selective_process_candidates.js`): Inscrições em processos seletivos.
26. `Subscriber` (`subscriber.js`): Assinantes da newsletter.
27. `Testimonial` (`testimonial.js`): Depoimentos de usuários/clientes.
28. `User` (`user.js`): Usuários base do sistema.

### 2.3. Capacidades GraphQL Implementadas

#### Queries GraphQL (`QUERIES.md`)
- **Author**: `allAuthors`, `getAuthorById`, `allAuthorsPaginated`
- **Blog**: `allBlogs`, `getBlogById`, `allBlogsPaginated`, `allComments`, `getCommentById`, `allCommentsPaginated`, `allBlogsCategories`, `allBlogsTimePeriods`, `allBlogsRecents`, `allCommentsRecents`
- **Candidate**: `allCandidates`, `getCandidateById`, `allCandidatesPaginated`
- **Company**: `allCompanies`, `getCompanyById`, `allCompaniesPaginated`, `listRandomLogos`
- **Form**: `allForms`, `getFormById`, `allFormsPaginated`
- **JAAS**: `allJAASUsers`, `getJAASUserById`, `allJAASUsersPaginated`, `allJAASRoles`, `getJAASRoleByName`, `allJAASRolesPaginated`
- **Job**: `allJobs`, `getJobById`, `allJobsPaginated`, `allJobsFeatured`, `listJobRandomFeatured`, `getJobByCompanyId`, `getJobByIdAndCompanyId`, `myJobs`
- **Member**: `allMembers`, `getMemberById`, `allMembersPaginated`
- **Resume**: `allResumes`, `getResumeById`, `allResumesPaginated`
- **Selective Process**: `allSelectiveProcesses`, `getSelectiveProcessById`, `allSelectiveProcessesPaginated`, `mySelectiveProcessesSubscribed`, `mySelectiveProcesses`
- **Subscriber**: `allSubscribers`, `getSubscriberById`, `allSubscribersPaginated`
- **Testimonial**: `allTestimonials`, `getTestimonialById`, `allTestimonialsPaginated`
- **User**: `allUsers`, `getUserById`, `allUsersPaginated`
- **Others / Stats**: `validateCPF`, `statisticsCount`

#### Mutations GraphQL (`MUTATIONS.md`)
- Operações de CRUD (`create`, `update`, `delete`) implementadas para: `Author`, `Blog`, `Candidate`, `Company`, `Form`, `JAASUser`, `JAASRole`, `Job`, `Member`, `Resume`, `SelectiveProcess`, `Subscriber`, `Testimonial`, `User`.
- Operações de Ação/Negócio: `notifyCandidate`, `subscribeInJob`, `subscribeInSelectiveProcess`, `subscribeMail`.

---

## 3. Projeto `java-stack` (Backend Legado EE)

**Caminho no Sistema**: `C:\Packsys\NetBeansProjects\java-stack`  
**Tecnologia**: Java 8, JEE 7, JPA 2.1 / Hibernate, EJB 3.2, JAX-RS, Server WildFly, Maven.

### 3.1. Visão de Recursos
- Arquitetura legada orientada a Servlets, EJBs e JAX-RS REST Endpoints.
- Serviu como base original para todas as regras de negócio consolidadas no `SPECIFICATION.md`.

### 3.2. Endpoints REST (`Endpoints.md`)
1. **Contexto Android**:
   - `/login/firebaselogin` (Autenticação via Firebase Auth)
   - `/ping/test` (Teste de conectividade)
   - `/save/user`, `/save/candidate`, `/save/resume` (Persistência via app móvel)
2. **Contexto Vue**:
   - `/vue/create_candidate`, `/vue/create_company`
   - `/vue/update_by_token`
   - `/vue/create_or_update_resume_by_token`
   - `/vue/create_or_update_job_by_token`
   - `/vue/create_or_update_selective_process`
3. **Contexto RESTful / Admin**:
   - Gestão completa de Blogs, Usuários, Vagas e Relatórios.

### 3.3. Testes e Population Suite
- Ampla suíte de testes de integração e povoamento de banco de dados (`PopulateAuthorTest`, `PopulateBlogTest`, `PopulateCandidateTest`, `PopulateCompanyTest`, `PopulateJobTest`, etc.).

---

## 4. Projeto `workix-spring-boot` (Segunda Versão Backend)

**Caminho no Sistema**: `C:\Packsys\NetBeansProjects\workix-spring-boot`  
**Tecnologia**: Java 11+, Spring Boot 2.x, Spring Data JPA, Spring Web REST, Hibernate, Maven.

### 4.1. Arquitetura e Estrutura
- Implementação intermediária visando modernizar o backend Java EE para Spring Boot antes do advento do projeto `graphql`.
- Estruturado rigorosamente em camadas: `rest.controllers`, `services`, `repositories`, `jpa.models`, `dto`.

### 4.2. Modelos e Entidades JPA (`jpa/models`)
- `Author`, `Blog`, `Candidate`, `CarrerLevel`, `Comment`, `Company`, `Contact`, `Education`, `Experience`, `Form`, `Job`, `Locale`, `Member`, `Person`, `Presence`, `Resume`, `SelectiveProcess`, `Skill`, `SocialMedia`, `Subscriber`, `Tag`, `Testimonial`, `User`.

### 4.3. Controllers e Repositórios
- `AuthorController` (`AuthorRepo`), `BlogController` (`BlogRepo`), `TestimonialController` (`TestimonialRepo`), `UserController` (`UserRepo`).
- Projeções JPA customizadas para relatórios de contagem: `BlogCountProjection`, `TestimonialCountProjection`.

---

## 5. Projeto `workix-frontend-vue` (Frontend Web)

**Caminho no Sistema**: `C:\Packsys\NetBeansProjects\workix-frontend-vue`  
**Tecnologia**: Vue 3 (Composition & Options API), Vue Router 4, Vuex 4, Axios, Firebase SDK, Vue Datepicker.

### 5.1. Estrutura de Visões e Páginas (`src/views`)
- `HomeView.vue`, `IndexView.vue`: Páginas iniciais e destaques.
- `JobsView.vue`, `Jobs2View.vue`, `JobDetailsView.vue`: Listagem, busca e detalhes de vagas.
- `CandidatesView.vue`, `Candidates2View.vue`: Banco de candidatos para empresas.
- `CompanyView.vue`: Perfil e diretório de empresas.
- `PostJobView.vue`: Formulário de publicação de vagas (com `JobDetailsForm.vue` e `CompanyDetailsForm.vue`).
- `PostResumeView.vue`, `ResumeView.vue`: Cadastro e visualização de currículos.
- `BlogView.vue`, `PostView.vue`: Seção de blog e artigos.
- `ProfileView.vue`: Gestão de perfil do usuário logado.
- `SearchView.vue`: Busca avançada com filtros.
- `TestimonialsView.vue`: Depoimentos.

### 5.2. Componentes de UI Principais (`src/components`)
- `HeaderBar.vue`, `NavBar.vue`, `FooterWrapper.vue`: Estrutura de cabeçalho e rodapé.
- `LoginPopup.vue`, `RegisterPopup.vue`: Modais de autenticação.
- `JobsWrapper.vue`, `FeaturedJob.vue`, `DefaultJob.vue`: Componentes de exibição de vagas.
- `BlogWrapper.vue`, `BlogPost.vue`, `BlogSideBar.vue`: Componentes de publicação e sidebar de notícias.
- `MessageModalMail.vue`, `MessageModalPush.vue`: Disparo de notificações e emails.

---

## 6. Matriz de Paridade Técnica por Módulo

| Módulo / Recurso | Backend Legado (`java-stack`) | Backend Spring Boot (`workix-spring-boot`) | Novo Backend Maestro (`graphql`) | Frontend Web (`workix-frontend-vue`) |
| :--- | :---: | :---: | :---: | :---: |
| **Autenticação & JAAS** | REST / Firebase (`/login`) | DTO / Spring Security | GraphQL JAAS Queries/Mutations + JWT | Firebase SDK + Form Modals |
| **Empresas (`Company`)** | Servlets / REST (`/vue/create_company`) | JPA Model + Repository | GraphQL Queries/Mutations + REST | `CompanyView.vue`, `CompaniesWrapper.vue` |
| **Candidatos (`Candidate`)** | Endpoints REST (`/save/candidate`) | JPA Model + DTO | GraphQL Queries/Mutations + REST | `CandidatesView.vue`, `Candidates2View.vue` |
| **Vagas (`Job`)** | Endpoints REST (`/vue/create_or_update_job`) | JPA Model + Repository | GraphQL Queries/Mutations + `subscribeInJob` | `JobsView.vue`, `JobDetailsView.vue`, `PostJobView.vue` |
| **Currículos (`Resume`)** | REST (`/save/resume`) | JPA Model (Education, Skill, Experience) | GraphQL Queries/Mutations + Sequelize | `ResumeView.vue`, `PostResumeView.vue` |
| **Processos Seletivos (`SelectiveProcess`)** | REST (`/vue/create_or_update_selective_process`) | JPA Model + Repository | GraphQL Queries/Mutations + `subscribeInSelectiveProcess` | Mapeado em componentes de UI |
| **Blog & Comentários (`Blog`)** | REST Endpoints completos | `BlogController` + `BlogService` | GraphQL Queries (`allBlogsRecents`, etc.) + Mutations | `BlogView.vue`, `PostView.vue`, `BlogPost.vue` |
| **Newsletter / Subscribers** | População & Endpoints | JPA Model `Subscriber` | GraphQL `subscribeMail` + Queries/Mutations | Componentes de inscrição na Footer |
| **Depoimentos (`Testimonial`)** | Endpoint de listagem | `TestimonialController` | GraphQL Queries/Mutations + `statisticsCount` | `TestimonialsView.vue`, `TestimonialMessage.vue` |
| **Validação de CPF** | `CPFValidator.java` | Utilitários | GraphQL Query `validateCPF` | Validação de formulários no front |

---

## 7. Diagnóstico de Lacunas Técnicas e Recomendações

### 7.1. Lacunas Identificadas
1. **Consumo de APIs no Frontend**: O `workix-frontend-vue` atualmente consome endpoints REST legado e rotas diretas. Deve ser gradualmente ajustado para consumir a API GraphQL unificada do projeto pai (`graphql`).
2. **Spring Boot vs GraphQL**: O projeto `workix-spring-boot` possui controllers parciais (`AuthorController`, `BlogController`, `TestimonialController`, `UserController`), enquanto o projeto `graphql` já possui 100% da cobertura de entidades e operações descritas no `SPECIFICATION.md`.
3. **Sincronização de Schemas**: Garantir que as alterações em `graphql` atualizem os arquivos `QUERIES.md`, `MUTATIONS.md`, `REST_ENDPOINTS.md` e `TABLES.md` no projeto pai.

### 7.2. Recomendações para Tomada de Decisão
- **Prioridade 1**: Centralizar todas as novas regras de negócio exclusivamente no backend `graphql` (Node.js).
- **Prioridade 2**: Migrar as chamadas do `workix-frontend-vue` para realizarem queries e mutations GraphQL diretamente no servidor `graphql`.
- **Prioridade 3**: Manter `java-stack` e `workix-spring-boot` apenas como referências históricas e de especificação, utilizando o `SPECIFICATION.md` como fonte única da verdade para validação funcional.
