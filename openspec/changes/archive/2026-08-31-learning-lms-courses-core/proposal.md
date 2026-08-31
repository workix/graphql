# Proposal: Implementação de Catálogo de Cursos, Videoaulas e Certificados LMS (`learning-lms-courses-core`)

## Summary
Implementar a plataforma educacional **Workix Learning / LMS** no **Frontend Cliente** e no **Android**, consumindo as queries e mutations do módulo GraphQL `learning` (`course`, `courseLessons`, `courseCompletion`, `createCourse`, `addCourseLesson`, `enrollInCourse`, `completeCourse`).

## Motivation & Background
Conforme estabelecido no [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md) e na especificação da rede social profissional [`SPECIFICATION_LINKEDIN.md`](file:///d:/Packsys/NetBeansProjects/graphql/SPECIFICATION_LINKEDIN.md), esta entrega conclui a **Fase 4 (Comunidades, Eventos & Educação - LMS)**:
- Os profissionais buscam aprimoramento contínuo em habilidades técnicas e de liderança através de trilhas de aprendizado (estilo LinkedIn Learning).
- O sistema deve disponibilizar um catálogo de cursos (`course`), grade curricular de aulas/vídeos (`courseLessons`), fluxo de matrícula (`enrollInCourse`), player de aula interativo (`LessonPlayerView.vue`) e emissão de certificado digital de conclusão (`completeCourse`, `courseCompletion`).

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/learning.service.ts`: Abstração de queries e mutations de cursos, aulas, matrículas e certificados.
  - `src/stores/learning.ts`: Store Pinia com catálogo de cursos, curso ativo, aulas e progresso de conclusão.
  - `src/views/CoursesCatalogView.vue` (`/learning`): Catálogo de cursos com busca por categoria e instrutor.
  - `src/views/CourseDetailView.vue` (`/learning/:id`): Visão detalhada do curso, ementa de aulas e botão de inscrição.
  - `src/views/LessonPlayerView.vue` (`/learning/:courseId/lesson/:lessonId`): Player de vídeo/aula com navegação entre lições e botão de conclusão do curso.
  - Rotas registradas no `router/index.ts` e atalho de Cursos no `TheHeader.vue`.
- **Android App (`android/`)**:
  - `LearningApiService.kt`: Camada de rede nativa em Kotlin para cursos e aulas.
  - `CoursesFragment.kt` / `LessonPlayerActivity.kt`: Interfaces nativas para navegação no catálogo de cursos e player de aulas.
