# Proposal: Consolidação da Paridade Total do Ecossistema (`final-ecosystem-full-parity-core`)

## Summary
Implementar os serviços de dados e integrações finais para o módulo de postagens de vagas avançadas (`job_postings`), depoimentos institucionais (`testimonials`), newsletter (`subscribers`) e métricas do sistema (`stats`) no Frontend Cliente e aplicativo Android.

## Motivation & Background
Para fechar 100% das capabilities do backend GraphQL nas plataformas de interface:
- O módulo `job_postings` (`jobPostings`, `jobApplications`, `matchScore`, `applyToJob`) oferece inteligência de aderência e match de candidatos.
- O aplicativo Android necessita de consumo direto dos endpoints de depoimentos (`allTestimonials`), inscrição na newsletter (`subscribeMail`) e contadores estatísticos da plataforma (`statisticsCount`).

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/jobPostings.service.ts`: Abstração de postagens de vagas com match score.
- **Android App (`android/`)**:
  - `src/main/java/br/com/codecode/workix/android/network/JobPostingsApiService.kt`: Módulo de vagas com match score.
  - `src/main/java/br/com/codecode/workix/android/network/TestimonialsApiService.kt`: Módulo de depoimentos.
  - `src/main/java/br/com/codecode/workix/android/network/SubscribersApiService.kt`: Módulo de newsletter.
  - `src/main/java/br/com/codecode/workix/android/network/StatsApiService.kt`: Módulo de estatísticas.
