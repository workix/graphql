# Design Document: Catálogo de Cursos, Videoaulas e Certificados LMS (`learning-lms-courses-core`)

## Architectural Strategy

A plataforma de educação Workix Learning capacita profissionais da comunidade:
1. **Backend GraphQL (`src/modules/learning`)**:
   - `course(id)`: Obtenção de dados do curso.
   - `courseLessons(courseId)`: Lista de lições ordenadas por `orderIndex`.
   - `enrollInCourse(courseId, userId)`: Matrícula do aluno.
   - `completeCourse(enrollmentId)`: Emissão do certificado digital.
   - `courseCompletion(enrollmentId)`: Consulta do certificado.

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/learning.service.ts`: Camada de comunicação GraphQL.
   - `src/stores/learning.ts`: Gerenciamento de cursos, curso ativo, lições, matrícula ativa e certificado.
   - `src/views/CoursesCatalogView.vue` (`/learning`): Catálogo com busca e badges de nível/categoria.
   - `src/views/CourseDetailView.vue` (`/learning/:id`): Ementa detalhada e botão de matrícula.
   - `src/views/LessonPlayerView.vue` (`/learning/:courseId/lesson/:lessonId`): Player de aula, checklist lateral de aulas e botão de conclusão com certificado.

3. **Android App (`android/`)**:
   - `LearningApiService.kt`: Camada de rede nativa em Kotlin com Coroutines.
   - `CoursesFragment.kt` e `LessonPlayerActivity.kt`: Interfaces nativas para navegação no catálogo e player de aulas.
