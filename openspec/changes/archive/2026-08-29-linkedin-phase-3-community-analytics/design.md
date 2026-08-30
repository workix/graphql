# Design Técnico: Fase 3 — Engajamento e Comunidade (`linkedin-phase-3-community-analytics`)

## 1. Arquitetura de Dados (Modelos & Migrations)

### 1.1 Grupos Profissionais
- `Group`: `id`, `name`, `description`, `privacy` (PUBLIC, PRIVATE), `owner_id`, `created_at`, `updated_at`.
- `GroupMembership`: `id`, `group_id`, `user_id`, `role` (MEMBER, ADMIN), `status` (PENDING, APPROVED), `created_at`.
- `GroupPost`: `id`, `group_id`, `author_id`, `content`, `created_at`, `updated_at`.

### 1.2 Eventos
- `Event`: `id`, `title`, `description`, `event_type` (ONLINE, IN_PERSON), `start_time`, `end_time`, `location_or_url`, `organizer_id`, `created_at`.
- `EventAttendee`: `id`, `event_id`, `user_id`, `status` (ATTENDING, MAYBE), `created_at`.

### 1.3 Analytics & Métricas
- `ProfileView`: `id`, `viewed_id`, `viewer_id`, `viewed_at`.
- `PostAnalytics`: `id`, `post_id`, `views_count`, `shares_count`, `created_at`, `updated_at`.

## 2. Módulos GraphQL

- `src/modules/groups`: Schema, repo, resolvers e DTOs.
- `src/modules/events`: Schema, repo, resolvers e DTOs.
- `src/modules/analytics`: Schema, repo, resolvers e DTOs.

## 3. Estratégia de Testes TDD
- Criar suítes de testes unitários isoladas em `tests/unit/modules/`.
- Manter limiar global de 100% de cobertura no Jest.
