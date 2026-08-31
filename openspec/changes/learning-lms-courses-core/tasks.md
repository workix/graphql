## 1. Serviços e Camada de Dados GraphQL

- [x] 1.1 Criar `frontend/client/src/services/learning.service.ts` para queries e mutations de cursos e lições
- [x] 1.2 Criar `frontend/client/src/stores/learning.ts` para gerenciamento de cursos, matrículas e certificados

## 2. Frontend Cliente: Componentes e Views

- [x] 2.1 Criar `frontend/client/src/views/CoursesCatalogView.vue` (`/learning`) com catálogo e busca de cursos
- [x] 2.2 Criar `frontend/client/src/views/CourseDetailView.vue` (`/learning/:id`) com ementa de aulas e matrícula
- [x] 2.3 Criar `frontend/client/src/views/LessonPlayerView.vue` (`/learning/:courseId/lesson/:lessonId`) com player e conclusão
- [x] 2.4 Registrar rotas de aprendizagem em `frontend/client/src/router/index.ts` e adicionar atalho em `TheHeader.vue`

## 3. Android: Camada Mobile

- [x] 3.1 Criar `LearningApiService.kt` no módulo de rede do Android
- [x] 3.2 Criar `CoursesFragment.kt` e `LessonPlayerActivity.kt` no pacote `ui/learning` do Android e registrar no `AndroidManifest.xml`

## 4. Validação e Testes

- [x] 4.1 Adicionar testes unitários para o módulo `learning`
- [x] 4.2 Validar conformidade da proposta via `openspec validate learning-lms-courses-core`
