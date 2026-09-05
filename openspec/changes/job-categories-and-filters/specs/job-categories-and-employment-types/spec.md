## Purpose

Define a modelagem, persistência, regras de negócio e APIs GraphQL para categorias estruturadas de vagas (Meio Período, Primeira Oportunidade, Estágio, Noturno, Temporário, Freelance, Periculosidade) e tipos de contratação (CLT, PJ, Contrato Temporário).

## ADDED Requirements

### Requirement: Suporte a Novas Categorias de Vagas
O sistema SHALL suportar a classificação e combinação de múltiplas categorias de vagas através do enum `JobCategory` contendo os valores: `MEIO_PERIODO`, `PRIMEIRA_OPORTUNIDADE`, `ESTAGIO`, `NOTURNO`, `TEMPORARIO`, `FREELANCE` e `PERICULOSIDADE`. Cada vaga SHALL permitir uma ou mais categorias associadas sem perder compatibilidade com vagas legadas.

#### Scenario: Cadastro de Vaga com Múltiplas Categorias
- **WHEN** uma empresa ou administrador cria uma vaga informando as categorias `ESTAGIO`, `MEIO_PERIODO` e `NOTURNO`
- **THEN** o sistema persiste as categorias informadas e retorna a vaga com a lista de categorias correspondente.

#### Scenario: Compatibilidade com Vagas Existentes sem Categorias Novas
- **WHEN** uma vaga legada sem categorias cadastradas é consultada via API ou GraphQL
- **THEN** o sistema retorna a vaga normalmente com array vazio de categorias, sem disparar erros ou quebras de contrato.

### Requirement: Suporte a Tipos de Contratação (Employment Types)
O sistema SHALL suportar a especificação do tipo de contratação de cada vaga através do enum `JobEmploymentType` contendo os valores: `CLT`, `PJ` e `CONTRATO_TEMPORARIO`. O campo deve ser persistido e exposto nas queries e mutations de vagas.

#### Scenario: Associação de Tipo de Contratação na Vaga
- **WHEN** uma vaga é cadastrada ou atualizada com o tipo de contratação `CLT`
- **THEN** o sistema valida o valor informado, persiste na entidade e retorna `employmentType: "CLT"` nos detalhes da vaga.

### Requirement: Mutations e Queries de Vagas com Categorias e Tipo de Contratação
As mutations `createJob` e `updateJob` SHALL aceitar os campos `categories: [JobCategory!]` e `employmentType: JobEmploymentType`, e as queries `getJobById`, `allJobsPaginated`, `allJobsFeatured` e `myJobs` SHALL expor esses campos em seus respectivos retornos.

#### Scenario: Atualização de Vaga com Novas Características
- **WHEN** um usuário autorizado atualiza uma vaga adicionando a categoria `PERICULOSIDADE` e alterando o tipo de contratação para `PJ`
- **THEN** a mutation `updateJob` executa com sucesso e a query `getJobById` passa a refletir as novas características atualizadas.
