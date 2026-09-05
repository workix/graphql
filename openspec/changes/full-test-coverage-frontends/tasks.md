## 1. Configuração de Vitest & Infraestrutura de Testes nos Frontends

- [ ] 1.1 Configurar dependências e `vitest.config.ts` no `frontend/client`
- [ ] 1.2 Configurar dependências e `vitest.config.ts` no `frontend/admin`

## 2. Testes Unitários do Frontend Web Cliente (`frontend/client`)

- [ ] 2.1 Criar testes unitários para a store de autenticação (`src/stores/__tests__/auth.spec.ts`)
- [ ] 2.2 Criar testes unitários para os serviços principais (`api.spec.ts`, `media.service.spec.ts`, `jobs.service.spec.ts`, `resumes.service.spec.ts`)
- [ ] 2.3 Criar testes unitários para os serviços sociais e premium (`posts.service.spec.ts`, `messaging.service.spec.ts`, `learning.service.spec.ts`, `analytics.service.spec.ts`, `events.service.spec.ts`, `groups.service.spec.ts`)
- [ ] 2.4 Criar testes unitários para componentes essenciais (`JobCard.spec.ts`, `PostCard.spec.ts`, `LoadingOverlay.spec.ts`, `Pagination.spec.ts`, `TheFooter.spec.ts`)
- [ ] 2.5 Validar a execução da suíte de testes do cliente (`npm test` em `frontend/client`)

## 3. Testes Unitários do Frontend Web Admin (`frontend/admin`)

- [ ] 3.1 Criar testes unitários para a store de autenticação admin (`src/stores/__tests__/auth.spec.ts`)
- [ ] 3.2 Criar testes unitários para os serviços de gestão e moderação (`adminApi.spec.ts`, `mediaAdmin.service.spec.ts`, `jobs.service.spec.ts`, `resumes.service.spec.ts`, `companies.service.spec.ts`, `users.service.spec.ts`)
- [ ] 3.3 Criar testes unitários para os serviços de governança, JAAS e planos (`jaas.service.spec.ts`, `plans.service.spec.ts`, `selectiveProcesses.service.spec.ts`, `stats.service.spec.ts`, `forms.service.spec.ts`)
- [ ] 3.4 Validar a execução da suíte de testes do admin (`npm test` em `frontend/admin`)

## 4. Integração Contínua (CI/CD) e Verificação Geral

- [ ] 4.1 Atualizar `.github/workflows/ci.yml` incluindo a execução de testes automatizados dos frontends
- [ ] 4.2 Executar testes de todo o ecossistema (Backend, Client, Admin e Android) e verificar commits incrementais
