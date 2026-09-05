# graphql-jobs-feature Specification

## Purpose
Especifica o comportamento de usuário e requisitos funcionais para o módulo de Vagas (Jobs) no Frontend Cliente, Frontend Admin e Aplicativo Android a partir do consumo de APIs GraphQL reais.

## Requirements

### Requirement: Listagem e Busca de Vagas no Frontend Cliente
O Frontend Cliente SHALL disponibilizar página pública de vagas consumindo as queries `searchJobs` e `allJobsPaginated` (além de `allJobsFeatured`), exibindo título, empresa, localização, salário, tipo de contrato, tags/skills, facetas dinâmicas, status de destaque identificado com `is_sponsored` e `sponsor_label` imutável, badges visuais para PCD (`isPcd: true`), trabalho remoto (`isRemote: true`), badges para categorias da vaga (Meio Período, Primeira Oportunidade, Estágio, Noturno, Temporário, Freelance, Periculosidade) e tipo de contratação (CLT, PJ, Contrato Temporário), além de filtros dinâmicos com suporte a multi-seleção de categorias e tipos de contratação com visualização de filtros ativos e ação de limpar filtros.

#### Scenario: Visualização e Filtro de Vagas no Cliente
- **WHEN** o usuário acessa a página de vagas (`/jobs`) e seleciona as categorias "Estágio" e "Meio Período" junto ao tipo de contratação "CLT"
- **THEN** a lista exibe exclusivamente as vagas correspondentes com seus respectivos badges, e exibe os chips de filtros ativos permitindo removê-los individualmente ou limpá-los por completo.

### Requirement: Detalhes e Candidatura em Vaga no Frontend Cliente e Android
O Frontend Cliente e o aplicativo Android SHALL disponibilizar tela de detalhes da vaga via query `getJobById(id)` destacando as informações de acessibilidade e laudo (`pcdDetails`, recursos disponíveis), modalidade de trabalho (`isRemote`, `workplaceType`), lista de categorias da vaga e tipo de contratação (`employmentType`), permitindo que o usuário candidate-se através da mutation `subscribeInJob(input)`.

#### Scenario: Candidatura a Vaga com Sucesso
- **WHEN** o usuário clica no botão de candidatura na tela de detalhes da vaga
- **THEN** o sistema executa a mutation `subscribeInJob`, exibe mensagem de confirmação de sucesso e atualiza o estado visual da tela mantendo em destaque as categorias da vaga e tipo de contratação.

### Requirement: Gerenciamento Administrativo de Vagas (CRUD) no Frontend Admin
O Frontend Admin SHALL disponibilizar um módulo administrativo completo para gestão de vagas, permitindo listar (`allJobsPaginated`), cadastrar (`createJob`), editar (`updateJob`) e remover (`deleteJob`) vagas com formulários validados contendo campos explícitos para indicação de categorias (Meio Período, Primeira Oportunidade, Estágio, Noturno, Temporário, Freelance, Periculosidade), tipo de contratação (CLT, PJ, Contrato Temporário), PCD (`isPcd`, `pcdDetails`), modalidade remota (`isRemote`, `workplaceType`), data de validade obrigatória (`expires_at`), registro de desfecho e confirmação de exclusão.

#### Scenario: Criação de Nova Vaga pelo Administrador
- **WHEN** o administrador preenche o formulário de cadastro de vaga marcando as categorias "Estágio" e "Noturno" com tipo "CLT" e clica em salvar
- **THEN** a mutation `createJob` é disparada validando o limite de vagas do plano via `can()`, enviando as categorias e tipo de contratação, a vaga é criada com sucesso e a listagem administrativa é atualizada.

#### Scenario: Exclusão de Vaga no Admin
- **WHEN** o administrador confirma a exclusão de uma vaga existente
- **THEN** a mutation `deleteJob` é executada e o item é removido imediatamente da tabela.

### Requirement: Seção de Navegação por Categorias de Vagas no Frontend e Android
O Frontend Web e o aplicativo Android SHALL fornecer uma seção dedicada de navegação por categorias de vagas com atalhos diretos para cada uma das categorias: Meio Período, Primeira Oportunidade, Estágio, Noturno, Temporário, Freelance e Periculosidade.

#### Scenario: Acesso Direto a Categoria de Vagas
- **WHEN** um usuário clica no atalho de navegação "Primeira Oportunidade" na página inicial ou menu de navegação
- **THEN** o sistema direciona para a listagem de vagas pré-filtrada com a categoria `PRIMEIRA_OPORTUNIDADE` ativada.
