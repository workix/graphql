## 1. Serviços e Camada de Dados GraphQL

- [ ] 1.1 Criar `frontend/client/src/services/learning.service.ts` para queries e mutations de cursos e lições
- [ ] 1.2 Criar `frontend/client/src/stores/learning.ts` para gerenciamento de cursos, matrículas e certificados

## 2. Frontend Cliente: Componentes e Views

- [ ] 2.1 Criar `frontend/client/src/views/CoursesCatalogView.vue` (`/learning`) com catálogo e busca de cursos
- [ ] 2.2 Criar `frontend/client/src/views/CourseDetailView.vue` (`/learning/:id`) com ementa de aulas e matrícula
- [ ] 2.3 Criar `frontend/client/src/views/LessonPlayerView.vue` (`/learning/:courseId/lesson/:lessonId`) com player e conclusão
- [ ] 2.4 Registrar rotas de aprendizagem em `frontend/client/src/router/index.ts` e adicionar atalho em `TheHeader.vue`

## 3. Android: Camada Mobile

- [ ] 3.1 Criar `LearningApiService.kt` no módulo de rede do Android
- [ ] 3.2 Criar `CoursesFragment.kt` e `LessonPlayerActivity.kt` no pacote `ui/learning` do Android e registrar no `AndroidManifest.xml`

## 4. Validação e Testes

- [ ] 4.1 Adicionar testes unitários para o módulo `learning`
- [ ] 4.2 Validar conformidade da proposta via `openspec validate learning-lms-courses-core`
