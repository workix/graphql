# Specification: Frontend Admin Unit Tests

## Purpose

Estabelece a cobertura e integridade de testes unitários para a aplicação web administrativa (`frontend/admin`), cobrindo autenticação, estado global Pinia, serviços de comunicação de dados, moderação e chamadas GraphQL/REST de gestão.

## ADDED Requirements

### Requirement: Suíte de Testes Unitários de Stores e Serviços Administrativos
O frontend administrativo SHALL possuir testes unitários com Vitest cobrindo a store `auth.ts` e todos os serviços de API (`adminApi.ts`, `mediaAdmin.service.ts`, `jobs.service.ts`, `resumes.service.ts`, `companies.service.ts`, `users.service.ts`, `jaas.service.ts`, `plans.service.ts`, `selectiveProcesses.service.ts`, `stats.service.ts`, `forms.service.ts`, `courses.service.ts`, `events.service.ts`, `blogs.service.ts`).

#### Scenario: Teste de Operações de Moderação de Vagas e Usuários
- **WHEN** o serviço `jobsService.update` ou `usersService.delete` é chamado
- **THEN** a mutation GraphQL correspondente é disparada e o resultado é retornado.

#### Scenario: Teste de Consulta de Estatísticas e Papéis JAAS
- **WHEN** `statsService.getStatistics` ou `jaasService.getRoles` é executado
- **THEN** os dados do backend são processados e formatados corretamente para os painéis de visualização.
