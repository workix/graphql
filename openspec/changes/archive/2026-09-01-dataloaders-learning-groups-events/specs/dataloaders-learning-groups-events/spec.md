## Purpose

Garante a resolução eficiente em lote com DataLoader nos módulos de aprendizagem (cursos e aulas), comunidades (grupos e membresias) e eventos (participantes e organizadores).

## ADDED Requirements

### Requirement: Resolução em Lote de Cursos, Aulas e Inscrições
O sistema SHALL resolver em lote os instrutores, aulas e cursos associados a matrículas utilizando DataLoaders request-scoped.

#### Scenario: Consulta de detalhes de curso e aulas
- **WHEN** uma query solicitar lista de cursos com seus respectivos instrutores e aulas
- **THEN** o sistema SHALL agrupar os IDs e executar consultas únicas em lote.

### Requirement: Resolução em Lote de Membros de Grupos e Comunidades
O sistema SHALL resolver donos, autores de posts e participantes de grupos via DataLoader.

#### Scenario: Listagem de posts de grupo com autores
- **WHEN** a consulta `groupPosts` solicitar o objeto `author`
- **THEN** o sistema SHALL resolver os autores de todos os posts com uma única busca delegada ao `usersLoader`.

### Requirement: Resolução em Lote de Organizadores e Participantes de Eventos
O sistema SHALL resolver os usuários relacionados a eventos e confirmações de presença via DataLoader.

#### Scenario: Listagem de participantes de evento
- **WHEN** a consulta `eventAttendees` solicitar os dados do usuário participante
- **THEN** o sistema SHALL agrupar os IDs de usuários e carregar os dados em lote.
