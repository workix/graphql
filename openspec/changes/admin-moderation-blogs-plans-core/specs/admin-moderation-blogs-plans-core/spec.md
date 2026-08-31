## Purpose

Especifica os requisitos e painéis de moderação administrativa para blogs corporativos, cursos LMS, planos de assinatura e mensagens de contato no ecossistema Workix.

## ADDED Requirements

### Requirement: Gestão de Posts de Blog no Admin
O sistema SHALL permitir que administradores listem, criem e excluam artigos do blog via queries `allBlogsPaginated` e mutations `createBlog`, `deleteBlog`.

#### Scenario: Visualização e cadastro de post no Admin
- **WHEN** o administrador acessa `/blogs` no painel administrativo
- **THEN** a tabela de posts é exibida com botões de ação e modal de criação.

### Requirement: Auditoria de Cursos LMS no Admin
O sistema SHALL permitir que administradores cadastrem e auditem cursos profissionais via query `course` e mutation `createCourse`.

#### Scenario: Cadastro de curso no Admin
- **WHEN** o administrador acessa `/courses` e submete novo curso
- **THEN** o curso é disponibilizado no catálogo de aprendizado.

### Requirement: Manutenção de Planos de Assinatura
O sistema SHALL permitir a criação e manutenção de planos premium via query `subscriptionPlans` e mutation `createSubscriptionPlan`.

#### Scenario: Criação de plano no Admin
- **WHEN** o administrador cadastra um novo plano em `/plans`
- **THEN** o plano com preço e créditos de InMail é listado para contratação.

### Requirement: Caixa de Entrada de Mensagens de Suporte
O sistema SHALL listar e permitir a exclusão de mensagens recebidas via query `allFormsPaginated` e mutation `deleteForm`.

#### Scenario: Leitura de mensagens de contato
- **WHEN** o administrador acessa `/forms`
- **THEN** a lista de mensagens de ouvidoria com assunto, autor e conteúdo é exibida.
