## MODIFIED Requirements

### Requirement: Listagem e Busca de Vagas no Frontend Cliente
O Frontend Cliente SHALL disponibilizar página pública de vagas consumindo a query `allJobsPaginated` (e `allJobsFeatured`), exibindo título, empresa, localização, salário, tipo de contrato, status de destaque identificado com `is_sponsored` e `sponsor_label` imutável, e paginação funcional, garantindo que vagas patrocinadas ocupem slots demarcados sem suprimir ou rebaixar vagas orgânicas.

#### Scenario: Visualização e Filtro de Vagas no Cliente com Slots de Destaque
- **WHEN** o usuário acessa a página de vagas (`/jobs`)
- **THEN** a lista exibe eventuais vagas patrocinadas claramente rotuladas no topo seguidas pela lista orgânica completa e permite navegar entre páginas e aplicar filtros por palavra-chave ou categoria.

### Requirement: Gerenciamento Administrativo de Vagas (CRUD) no Frontend Admin
O Frontend Admin SHALL disponibilizar um módulo administrativo completo para gestão de vagas, permitindo listar (`allJobsPaginated`), cadastrar (`createJob`), editar (`updateJob`) e remover (`deleteJob`) vagas com formulários validados contendo data de validade obrigatória (`expires_at`), registro de desfecho e confirmação de exclusão.

#### Scenario: Criação de Nova Vaga com Validade Obrigatória
- **WHEN** o administrador ou recrutador preenche o formulário de cadastro de vaga com prazo de expiração e clica em salvar
- **THEN** a mutation `createJob` é disparada validando o limite de vagas ativas do plano via `can()`, a vaga é criada no banco e a listagem administrativa é automaticamente atualizada.

#### Scenario: Exclusão de Vaga no Admin
- **WHEN** o administrador confirma a exclusão de uma vaga existente
- **THEN** a mutation `deleteJob` é executada e o item é removido imediatamente da tabela.
