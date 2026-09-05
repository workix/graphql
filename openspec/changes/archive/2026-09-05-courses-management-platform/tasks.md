## 1. Banco de Dados e Modelagem

- [x] 1.1 Criar migration para adicionar campos de empresa, nível, requisitos, seções, URLs de vídeo e arquivos anexos em `courses` e `course_lessons`
- [x] 1.2 Atualizar modelos Sequelize `Course` e `CourseLesson` e associações com `Company` e `User`

## 2. Backend GraphQL e TDD

- [x] 2.1 Atualizar `src/modules/learning/graphql/schema.gql` com campos de seções, vídeos, anexos e mutações de gestão de cursos
- [x] 2.2 Implementar resolvers e repositório `learning.repo.ts` para agrupamento por seções, filtros de provedores e validação de empresas premium
- [x] 2.3 Atualizar DTOs `CourseDTO.ts` e `CourseLessonDTO.ts`
- [x] 2.4 Criar suíte completa de testes unitários TDD no backend em `tests/unit/modules/learning.spec.ts`

## 3. Frontend Services e Store

- [x] 3.1 Atualizar `learning.service.ts` com queries e mutations de cursos, seções, anexos e lições
- [x] 3.2 Atualizar store `stores/learning.ts` para gerenciar estado de reprodução, progresso por aula e catálogo
- [x] 3.3 Adicionar testes unitários para `learning.service.spec.ts` no frontend

## 4. Interfaces e Player LMS Estilo Udemy

- [x] 4.1 Implementar catálogo rico em `CoursesCatalogView.vue` com filtros por origem (Workix vs Empresas), nível e categoria
- [x] 4.2 Criar landing page detalhada do curso em `CourseDetailView.vue` com ementa completa expansível por seções e detalhes de materiais
- [x] 4.3 Desenvolver player imersivo em `LessonPlayerView.vue` com menu lateral colapsável, player de vídeo, aba de downloads de arquivos anexos e controle de progresso
- [x] 4.4 Criar componente de formulário/modal para empresas premium cadastrarem cursos e aulas com anexos

## 5. Verificação e Validação

- [x] 5.1 Executar `npm test` no backend garantindo 100% de integridade
- [x] 5.2 Executar `npm --prefix frontend/client test` no frontend
- [x] 5.3 Validar navegação, reprodução de vídeo, download de arquivos e fluxo de conclusão no navegador
