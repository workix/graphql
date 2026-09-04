## MODIFIED Requirements

### Requirement: Filtros Facetados e Agregações Estatísticas
O sistema SHALL permitir que a busca de vagas receba filtros facetados estruturados (`workplace_type`, `job_type`, `seniority_level`, `state`, `city`, `skills`, `is_pcd`, `is_remote`, faixa salarial `salary_min`/`salary_max`) e SHALL retornar contadores agregados de facetas na query `searchJobs` e na query dedicada `jobSearchFacets` (incluindo `pcdCount`, `remoteCount` e contagens por modalidade) para construção dinâmica de filtros na interface.

#### Scenario: Aplicação de Filtros Facetados e Retorno de Agregações
- **WHEN** o usuário aplica o filtro de modalidade "REMOTE", "isPcd: true" ou senioridade "PLENO"
- **THEN** o sistema filtra a listagem retornando apenas vagas correspondentes e inclui contagens atualizadas de facetas disponíveis para os demais atributos, incluindo contadores de vagas PCD e remotas.

## ADDED Requirements

### Requirement: Filtros Especiais de Inclusão e Modalidade (PCD e Remoto)
O motor de busca SHALL suportar filtros diretos combinados e atalhos rápidos para vagas destinadas a pessoas com deficiência (`isPcd`) e vagas de trabalho remoto (`isRemote` / `workplaceType: REMOTE`), permitindo consultas específicas como "Somente PCD", "Somente Remota" e "PCD e Remota simultaneamente".

#### Scenario: Busca Combinada de Vagas PCD e Remotas
- **WHEN** o usuário seleciona simultaneamente os critérios "Somente vagas PCD" e "Somente vagas remotas"
- **THEN** o sistema retorna exclusivamente vagas ativas que possuem `is_pcd: true` e `is_remote: true` (ou `workplace_type: REMOTE`), exibindo badges correspondentes e atualizando os contadores de facetas.
