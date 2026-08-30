# Design Técnico: Fase 2 — Diferenciação Profissional (`linkedin-phase-2-professional-core`)

## 1. Arquitetura de Dados (Modelos & Migrations)

### 1.1 Páginas de Empresa
- `CompanyPage`: `id`, `name`, `industry`, `size`, `logo_url`, `banner_url`, `description`, `created_at`, `updated_at`.
- `CompanyAdmin`: `id`, `company_id`, `user_id`, `role`, `created_at`.
- `CompanyFollower`: `id`, `company_id`, `user_id`, `created_at`.

### 1.2 Vagas Estruturadas & Candidaturas
- `JobPosting`: `id`, `company_id`, `title`, `description`, `location`, `work_type`, `required_skills` (JSON), `created_at`, `updated_at`.
- `JobApplication`: `id`, `job_id`, `candidate_id`, `resume_id`, `status`, `match_score`, `created_at`, `updated_at`.

### 1.3 Validação Social (Endossos e Recomendações)
- `SkillEndorsement`: `id`, `skill_id`, `endorser_id`, `created_at`.
- `Recommendation`: `id`, `recommender_id`, `recipient_id`, `content`, `status`, `created_at`, `updated_at`.

### 1.4 Destaques do Perfil
- `FeaturedItem`: `id`, `user_id`, `type`, `title`, `url`, `media_id`, `created_at`.

## 2. Módulos GraphQL

- `src/modules/companies`: Schema, repo, resolvers e DTOs.
- `src/modules/job_postings`: Schema, repo, resolvers e DTOs com calculador de Match.
- `src/modules/endorsements`: Schema, repo, resolvers e DTOs para endossos e recomendações.
- `src/modules/featured`: Schema, repo, resolvers e DTOs para conteúdos em destaque.

## 3. Estratégia de Testes TDD
- Criar suítes de testes unitários isoladas em `tests/unit/modules/` para cada módulo.
- Garantir a manutenção dos limiares globais de 100% de cobertura no Jest.
