## Purpose

Especifica o comportamento, regras de exibição, player de aulas e fluxo de conclusão de cursos e certificados LMS no ecossistema Workix.

## ADDED Requirements

### Requirement: Catálogo e Detalhes de Cursos Profissionais
O sistema SHALL permitir que o usuário consulte cursos disponíveis via query `course(id)` exibindo título, descrição, instrutor e imagem de capa.

#### Scenario: Visualização do catálogo de cursos
- **WHEN** o usuário acessa `/learning`
- **THEN** o sistema exibe os cursos disponíveis com busca e tags de tecnologia.

### Requirement: Grade Curricular de Aulas e Lições
O sistema SHALL listar as lições ordenadas de um curso via query `courseLessons(courseId)`.

#### Scenario: Acesso à ementa do curso
- **WHEN** o usuário abre a página do curso `/learning/:id`
- **THEN** a lista ordenada de lições e tópicos é exibida com duração e links para o player.

### Requirement: Matrícula e Inscrição em Curso
O sistema SHALL permitir que usuários autenticados se matriculem em cursos via mutation `enrollInCourse(courseId, userId)`.

#### Scenario: Matrícula em curso
- **WHEN** o usuário clica em "Iniciar Curso / Matricular-se"
- **THEN** uma matrícula `CourseEnrollment` é criada e o usuário é redirecionado para a primeira aula.

### Requirement: Player de Aulas e Emissão de Certificado
O sistema SHALL permitir a navegação entre aulas em um player dedicado (`LessonPlayerView.vue`) e a emissão de certificado digital de conclusão via mutation `completeCourse(enrollmentId)`.

#### Scenario: Conclusão do curso
- **WHEN** o aluno assiste todas as lições e clica em "Concluir Curso"
- **THEN** o sistema gera um `CourseCompletion` com URL de certificado digital validado.

### Requirement: Interface Mobile de Cursos no Android
O sistema SHALL disponibilizar catálogo e player de cursos no app Android através do `CoursesFragment.kt` e `LessonPlayerActivity.kt`.

#### Scenario: Acesso aos cursos no Android
- **WHEN** o usuário navega na aba Cursos no app Android
- **THEN** ele pode navegar nas lições e acompanhar o progresso de aprendizado.
