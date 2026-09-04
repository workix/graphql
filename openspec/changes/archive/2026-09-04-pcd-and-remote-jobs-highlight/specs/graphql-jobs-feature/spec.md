## MODIFIED Requirements

### Requirement: Listagem e Busca de Vagas no Frontend Cliente
O Frontend Cliente SHALL disponibilizar página pública de vagas consumindo as queries `searchJobs` e `allJobsPaginated` (além de `allJobsFeatured`), exibindo título, empresa, localização, salário, tipo de contrato, tags/skills, facetas dinâmicas, status de destaque identificado com `is_sponsored` e `sponsor_label` imutável, badges e indicadores visuais destacados para vagas PCD (`isPcd: true`, ícone de acessibilidade) e vagas remotas (`isRemote: true` / `workplaceType: REMOTE`, ícone de trabalho remoto), e filtros rápidos por "Somente PCD", "Somente Remoto" e "PCD e Remoto".

#### Scenario: Visualização e Filtro de Vagas no Cliente
- **WHEN** o usuário acessa a página de vagas (`/jobs`)
- **THEN** a lista exibe eventuais vagas patrocinadas claramente rotuladas no topo seguidas pela lista orgânica completa com badges de PCD e Remoto em destaque, permitindo navegar entre páginas, digitar termos com ranking de relevância e aplicar filtros rápidos por PCD e trabalho remoto.

### Requirement: Detalhes e Candidatura em Vaga no Frontend Cliente e Android
O Frontend Cliente e o aplicativo Android SHALL disponibilizar tela de detalhes da vaga via query `getJobById(id)` destacando as informações de acessibilidade e laudo (`pcdDetails`, recursos disponíveis) e modalidade de trabalho (`isRemote`, `workplaceType`), permitindo que o usuário candidate-se através da mutation `subscribeInJob(input)`.

#### Scenario: Candidatura a Vaga com Sucesso
- **WHEN** o usuário clica no botão de candidatura na tela de detalhes da vaga
- **THEN** o sistema executa a mutation `subscribeInJob`, exibe mensagem de confirmação de sucesso e atualiza o estado visual da tela mantendo em destaque as informações de PCD e trabalho remoto.

### Requirement: Gerenciamento Administrativo de Vagas (CRUD) no Frontend Admin
O Frontend Admin SHALL disponibilizar um módulo administrativo completo para gestão de vagas, permitindo listar (`allJobsPaginated`), cadastrar (`createJob`), editar (`updateJob`) e remover (`deleteJob`) vagas com formulários validados contendo campos explícitos para indicação de vaga para PCD (`isPcd`, `pcdDetails`), modalidade remota (`isRemote`, `workplaceType`), data de validade obrigatória (`expires_at`), registro de desfecho e confirmação de exclusão.

#### Scenario: Criação de Nova Vaga pelo Administrador
- **WHEN** o administrador preenche o formulário de cadastro de vaga marcando as opções de PCD e trabalho remoto e clica em salvar
- **THEN** a mutation `createJob` é disparada validando o limite de vagas ativas do plano via `can()`, a vaga é criada com os indicadores de PCD e trabalho remoto gravados no banco e a listagem administrativa é atualizada.

#### Scenario: Exclusão de Vaga no Admin
- **WHEN** o administrador confirma a exclusão de uma vaga existente
- **THEN** a mutation `deleteJob` é executada e o item é removido imediatamente da tabela.
