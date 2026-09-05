## MODIFIED Requirements

### Requirement: Filtros Facetados e Agregações Estatísticas
O sistema SHALL permitir que a busca de vagas receba filtros facetados estruturados (`workplace_type`, `job_type`, `categories` [múltiplas categorias: `MEIO_PERIODO`, `PRIMEIRA_OPORTUNIDADE`, `ESTAGIO`, `NOTURNO`, `TEMPORARIO`, `FREELANCE`, `PERICULOSIDADE`], `employment_type` [`CLT`, `PJ`, `CONTRATO_TEMPORARIO`], `seniority_level`, `state`, `city`, `skills`, `is_pcd`, `is_remote`, faixa salarial `salary_min`/`salary_max`) e SHALL retornar contadores agregados de facetas na query `searchJobs` e na query dedicada `jobSearchFacets` (incluindo contagens por categorias, contagens por tipos de contratação, `pcdCount`, `remoteCount` e contagens por modalidade) para construção dinâmica de filtros na interface.

#### Scenario: Aplicação de Filtros Facetados e Retorno de Agregações
- **WHEN** o usuário aplica os filtros de categorias `["ESTAGIO", "MEIO_PERIODO"]` e tipo de contratação `CLT`
- **THEN** o sistema filtra a listagem retornando apenas vagas correspondentes a todos os critérios aplicados e inclui contagens atualizadas de facetas disponíveis para as demais categorias, tipos de contratação e modalidades.

## ADDED Requirements

### Requirement: Busca Combinada por Múltiplas Categorias e Características
O motor de busca SHALL suportar a filtragem combinada e simultânea de múltiplas categorias (ex: Estágio + Meio Período + Noturno, ou Freelance + Remoto) e tipos de contratação, mantendo os scores de relevância orgânica e compatibilidade total com os filtros existentes sem regressões.

#### Scenario: Busca com Combinação Multi-Categoria e Remoto
- **WHEN** um candidato pesquisa vagas combinando a categoria `FREELANCE` com o filtro de modalidade remota `isRemote: true`
- **THEN** o motor de busca retorna exclusivamente vagas ativas que satisfaçam ambos os critérios sem quebrar ordenação nem regras de decaimento temporal.
