## Purpose

Define a suíte de testes integrados e ponta a ponta (E2E) com 100% de cobertura funcional dos módulos do backend GraphQL/REST, assegurando a confiabilidade e interoperabilidade de todos os serviços de autenticação, vagas, candidaturas, processos seletivos, kanban, mensageria, learning, mídia e governança.

## ADDED Requirements

### Requirement: Autenticação, JAAS e Ciclo de Sessão E2E no Backend
O sistema backend DEVE permitir autenticação completa de usuários (candidatos e administradores/empresas), emissão e validação de tokens JWT, controle de perfis/permissões JAAS e proteção de rotas GraphQL e REST com cobertura total.

#### Scenario: Login e Consulta com Token JWT Válido
- **WHEN** uma requisição de autenticação `login` GraphQL é executada com credenciais válidas
- **THEN** o sistema SHALL retornar um token JWT válido e autorizar consultas subsequentes autenticadas

#### Scenario: Bloqueio de Acesso com Token Inválido ou Ausente
- **WHEN** uma operação protegida por autenticação é invocada sem cabeçalho Authorization ou com token expirado
- **THEN** o sistema SHALL retornar erro de autenticação (HTTP 401 ou GraphQL UNAUTHENTICATED)

### Requirement: Fluxo Completo de Criação, Busca e Candidatura a Vagas E2E
O sistema backend DEVE suportar a criação de vagas por empresas, busca indexada/filtrada com categorias, localizações e faixas salariais, e submissão de candidaturas com persistência íntegra.

#### Scenario: Publicação de Vaga e Inscrição de Candidato
- **WHEN** uma empresa autenticada cria uma vaga via mutation GraphQL e um candidato autenticado submete uma candidatura para essa vaga
- **THEN** a candidatura SHALL ser persistida no banco de dados com status inicial e vinculada ao processo seletivo correspondente

#### Scenario: Busca Multifacetada de Vagas
- **WHEN** um candidato executa query de busca de vagas filtrando por categoria, modalidade e localidade
- **THEN** o backend SHALL retornar a lista precisa de vagas correspondentes com paginação determinística

### Requirement: Transição de Etapas no Kanban e Mensageria em Tempo Real
O sistema backend DEVE processar a mudança de estágio de candidatos em processos seletivos (Triagem -> Entrevista -> Proposta -> Contratado/Rejeitado) e disparar eventos de mensageria e notificações em tempo real.

#### Scenario: Movimentação de Candidato no Kanban e Notificação
- **WHEN** o recrutador move a candidatura de um estágio para outro no Kanban
- **THEN** o backend SHALL atualizar o status do candidato e emitir a notificação em tempo real via subscription/evento

### Requirement: Cobertura E2E de Mídia, Cursos, Feed Social e Governança
O sistema backend DEVE cobrir ponta a ponta as operações de upload/gestão de mídia, catálogo de cursos e aulas, publicações no feed social, conexões de networking, formulários e configurações de white-label/governança.

#### Scenario: Interação Social e Catálogo de Aprendizado E2E
- **WHEN** um usuário cria uma postagem no feed social ou se matricula em uma aula do catálogo de cursos
- **THEN** o backend SHALL persistir o registro no banco e retornar as entidades completas atualizadas
