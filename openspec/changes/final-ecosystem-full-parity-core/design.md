# Design Document: Paridade Total do Ecossistema (`final-ecosystem-full-parity-core`)

## Architectural Strategy

1. **Frontend Cliente (`frontend/client`)**:
   - `src/services/jobPostings.service.ts`: Abstração de `jobPostings`, `jobApplications`, `matchScore` e `applyToJob`.

2. **Android App (`android/`)**:
   - `src/main/java/br/com/codecode/workix/android/network/JobPostingsApiService.kt`: Match score e candidaturas.
   - `src/main/java/br/com/codecode/workix/android/network/TestimonialsApiService.kt`: Depoimentos da comunidade.
   - `src/main/java/br/com/codecode/workix/android/network/SubscribersApiService.kt`: Inscrição na newsletter.
   - `src/main/java/br/com/codecode/workix/android/network/StatsApiService.kt`: Contadores estatísticos da plataforma.
