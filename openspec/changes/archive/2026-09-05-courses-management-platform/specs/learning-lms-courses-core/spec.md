## MODIFIED Requirements

### Requirement: Catálogo e Detalhes de Cursos Profissionais
O sistema SHALL permitir que o usuário consulte cursos disponíveis via query `courses` e `course(id)`, exibindo título, descrição, instrutor, imagem de capa, nível (Iniciante/Intermediário/Avançado), provedor (`PLATFORM` ou `COMPANY`), empresa associada, requisitos prévios e objetivos de aprendizado ("O que você aprenderá").

#### Scenario: Visualização do catálogo de cursos
- **WHEN** o usuário acessa `/learning`
- **THEN** o sistema exibe os cursos disponíveis com busca e tags de tecnologia.

#### Scenario: Visualização do catálogo de cursos com filtros
- **WHEN** o usuário acessa `/learning` ou `/courses`
- **THEN** o sistema exibe os cursos disponíveis com busca, filtros por categoria, nível de dificuldade e origem (Cursos Oficiais Workix ou Cursos de Empresas Parceiras).

#### Scenario: Visualização da landing page do curso estilo Udemy
- **WHEN** o usuário abre a página detalhada do curso `/learning/:id`
- **THEN** a página exibe a ementa completa organizada por seções/módulos, total de aulas, duração estimada, materiais inclusos (vídeos, arquivos para download), empresa concedente e botão para iniciar/continuar o curso.

### Requirement: Grade Curricular de Aulas e Lições
O sistema SHALL estruturar a grade curricular em seções/módulos e lições ordenadas via query `courseLessons(courseId)` ou campo `sections` em `course`, suportando múltiplos tipos de conteúdo por lição (vídeo com URL de streaming/embed, arquivos para download como PDFs/slides/códigos de exemplo, e artigos em texto/markdown).

#### Scenario: Acesso à ementa do curso
- **WHEN** o usuário abre a página do curso `/learning/:id`
- **THEN** a lista ordenada de lições e tópicos é exibida com duração e links para o player.

#### Scenario: Acesso à ementa estruturada em seções
- **WHEN** o usuário visualiza o currículo do curso
- **THEN** o sistema exibe cada seção com seu título e a lista de lições numeradas com duração, tipo de mídia (vídeo/arquivo/artigo) e status de conclusão.

### Requirement: Player de Aulas e Emissão de Certificado
O sistema SHALL fornecer um player de aprendizagem interativo estilo Udemy (`LessonPlayerView.vue`), contendo área principal de reprodução (vídeo ou leitor de material), menu lateral expansível com todas as seções e lições, checkbox de lição concluída, aba de recursos e arquivos anexos para download, e emissão de certificado digital após 100% de conclusão.

#### Scenario: Conclusão do curso
- **WHEN** o aluno assiste todas as lições e clica em "Concluir Curso"
- **THEN** o sistema gera um `CourseCompletion` com URL de certificado digital validado.

#### Scenario: Reprodução de vídeo e download de arquivos da lição
- **WHEN** o aluno seleciona uma lição com vídeo e arquivos anexados no player
- **THEN** o vídeo é reproduzido na área central e a lista de arquivos complementares fica disponível para download imediato.

#### Scenario: Marcação de progresso e emissão de certificado
- **WHEN** o aluno assiste todas as lições e atinge 100% de progresso
- **THEN** o sistema atualiza o status para concluído e habilita a emissão e download do certificado digital com código de autenticidade.

## ADDED Requirements

### Requirement: Criação e Gestão de Cursos por Empresas Premium
O sistema SHALL permitir que empresas com plano ativo e privilégios premium criem, editem, organizem seções, anexem arquivos e publiquem seus próprios cursos corporativos através de mutations dedicadas (`createCourse`, `updateCourse`, `createCourseLesson`).

#### Scenario: Empresa premium cadastra um novo curso com módulos e arquivos
- **WHEN** um usuário com perfil de empresa premium acessa o painel de criação de cursos e envia os dados do curso com seções, links de vídeo e arquivos anexos
- **THEN** o curso é salvo com `provider_type = COMPANY` e fica disponível para os candidatos e colaboradores na plataforma.

#### Scenario: Empresa sem plano premium tenta criar curso
- **WHEN** uma empresa sem plano premium tenta cadastrar um curso
- **THEN** o sistema bloqueia a ação informando que a funcionalidade é exclusiva para empresas parceiras premium.
