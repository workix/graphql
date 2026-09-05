## Why

A plataforma Workix precisa de um ambiente completo e profissional de aprendizagem contínua (LMS) com estrutura inspirada na Udemy. Isso inclui cursos oficiais da plataforma e cursos corporativos concedidos por empresas parceiras/premium, com suporte abrangente a vídeos, materiais complementares (arquivos/PDFs/anexos), módulos/seções e acompanhamento detalhado de progresso por aula.

## What Changes

- **Estrutura de Curso Estilo Udemy**: Suporte a cursos divididos em seções/módulos e aulas (lições), com títulos, descrições, durações e ordenação.
- **Tipos de Conteúdo por Lição**: Suporte nativo a aulas em vídeo (embed/streaming URL), arquivos para download (PDFs, slides, códigos de apoio, apostilas) e conteúdo textual/markdown.
- **Multi-Provedores (Plataforma vs. Empresas Premium)**: Distinção clara entre cursos nativos da Workix e cursos concedidos/patrocinados por empresas parceiras com planos premium (`provider_type: PLATFORM | COMPANY`).
- **Gestão de Cursos por Empresas**: Painel/formulário para empresas premium criarem, editarem e publicarem seus cursos, módulos e materiais.
- **Player de Aprendizagem Interativo (LMS Player)**: Player moderno estilo Udemy com menu lateral colapsável de módulos/aulas, checkboxes de lição concluída, player de vídeo responsivo, aba de recursos/downloads e emissão de certificado.
- **Acompanhamento de Progresso e Matrícula**: Rastreamento de lições concluídas em tempo real (`LessonCompletion`), cálculo de porcentagem de progresso e emissão automática de certificado digital.

## Capabilities

### Modified Capabilities
- `learning-lms-courses-core`: Expansão dos requisitos do catálogo, player, permissões para empresas premium, suporte a arquivos/vídeos e estrutura multi-módulos estilo Udemy.

## Impact

- **Backend**:
  - Modelos Sequelize: `Course` (adicionar `company_id`, `provider_type`, `level`, `price`, `requirements`, `what_you_will_learn`), `CourseLesson` (adicionar `section_name`, `video_url`, `attachment_url`, `attachment_name`, `content_type`), e `LessonProgress` / `CourseEnrollment`.
  - Schema GraphQL (`src/modules/learning/graphql/schema.gql`): Queries e mutations para cursos, seções, lições com anexos/vídeos, progresso por aula e criação de cursos por empresas.
  - Resolvers e repositório de cursos (`learning.repo.ts`).
- **Frontend Client**:
  - `CoursesListView.vue` / `LearningView.vue`: Catálogo rico estilo Udemy com filtros por categoria, nível, provedor (Workix vs Empresa) e busca.
  - `CourseDetailView.vue`: Landing page do curso com ementa completa (seções e lições expansíveis), instrutor/empresa, requisitos e botão de matrícula.
  - `LessonPlayerView.vue`: Player estilo Udemy com barra lateral de navegação, visualizador de vídeo, área de downloads/anexos e marcação automática/manual de lição concluída.
  - `CompanyCourseEditorView.vue` (ou modal de gestão): Criação e gerenciamento de cursos por empresas premium.
- **Store & Services**: `learning.service.ts` e `learning.ts` (Pinia store).
