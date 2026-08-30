## Context

A Fase 4 completa a migração visual e funcional do Frontend Cliente para Kotlin nativo no Android, construindo todas as Activities de detalhe e formulários de cadastro de negócio.

## Goals / Non-Goals

**Goals:**
- Implementar `JobDetailActivity.kt` e `PostJobActivity.kt`.
- Implementar `CandidateDetailActivity.kt` e `PostResumeActivity.kt`.
- Implementar `CompanyDetailActivity.kt` e `BlogPostActivity.kt`.
- Conectar todas as telas com os serviços Retrofit (`JobsApiService`, `ResumesApiService`, `BlogsApiService`).

**Non-Goals:**
- Testes automatizados pesados e geração de APKs de release assinados (serão tratados na Fase 5).

## Decisions

- **Decisão 1: Passagem de Parâmetros via Intent Extras**:
  Identificadores de recursos (`JOB_ID`, `RESUME_ID`, `BLOG_ID`, `COMPANY_ID`) serão passados como extras do Intent para inicialização nativa das Activities de detalhamento.

- **Decisão 2: Uso do `SessionManager` para Controle de Acesso nos Formulários**:
  Activities restritas (como `PostJobActivity` para empresas e `PostResumeActivity` para candidatos) validarão as permissões do usuário em tempo de execução via `SessionManager`.

## Risks / Trade-offs

- [Falha de rede ou timeout ao enviar formulários grandes] → Exibir indicador de progresso (ProgressBar) e possibilitar tentar novamente em caso de erro no `NetworkResult`.
