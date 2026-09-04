# jobs-search-engine Specification

## Purpose
Provê um motor de busca de vagas com indexação e normalização, cálculo de relevância ponderada (título, tags/skills, descrição), decaimento temporal, filtros facetados dinâmicos, sugestões de preenchimento (autocomplete) e slots destacados para vagas patrocinadas.

## Requirements

### Requirement: Consulta Textual Ranqueada com Ponderação e Decaimento Temporal
O sistema SHALL disponibilizar a query `searchJobs` com suporte a busca textual livre calculando score de relevância com pesos diferenciados (Título com peso A [3x a 5x], Skills/Tags com peso B [2x] e Descrição com peso C [1x]) e aplicando bônus por decaimento temporal (*time decay*) para vagas mais recentes, ordenando os resultados orgânicos estritamente por relevância ou data conforme solicitado.

#### Scenario: Busca Textual com Ranking Ponderado
- **WHEN** um candidato pesquisa pelo termo "Java Spring"
- **THEN** o sistema retorna vagas em que o termo no título tem maior relevância que menções apenas no corpo da descrição, aplicando bônus temporal para vagas publicadas nos últimos 14 dias.

### Requirement: Filtros Facetados e Agregações Estatísticas
O sistema SHALL permitir que a busca de vagas receba filtros facetados estruturados (`workplace_type`, `job_type`, `seniority_level`, `state`, `city`, `skills`, faixa salarial `salary_min`/`salary_max`) e SHALL retornar contadores agregados de facetas na query `searchJobs` e na query dedicada `jobSearchFacets` para construção dinâmica de filtros na interface.

#### Scenario: Aplicação de Filtros Facetados e Retorno de Agregações
- **WHEN** o usuário aplica o filtro de modalidade "REMOTE" e senioridade "PLENO"
- **THEN** o sistema filtra a listagem retornando apenas vagas correspondentes e inclui contagens atualizadas de facetas disponíveis para os demais atributos.

### Requirement: Autocompletação e Sugestões de Busca (Typeahead)
O sistema SHALL disponibilizar a query `jobSearchSuggestions(prefix: String!)` retornando sugestões automáticas categorizadas de títulos de vagas, competências/skills e nomes de empresas a partir do prefixo digitado.

#### Scenario: Autocompletação em Tempo Real
- **WHEN** o usuário digita o prefixo "Rea" na barra de busca
- **THEN** o sistema retorna sugestões como "React", "React Native" e cargos associados com suas respectivas categorias.

### Requirement: Slots Demarcados de Vagas Patrocinadas no Resultado de Busca
O resultado da query `searchJobs` SHALL retornar uma lista separada de vagas patrocinadas ativas (`sponsoredJobs`), devidamente identificadas com `is_sponsored: true` e `sponsor_label`, sem alterar, distorcer ou rebaixar a ordenação e pontuação orgânica da lista principal (`jobs`).

#### Scenario: Exibição de Vagas Patrocinadas em Busca
- **WHEN** uma busca é realizada e existem vagas patrocinadas ativas compatíveis
- **THEN** o retorno contém o array `sponsoredJobs` isolado no payload e a lista `jobs` ordenada puramente por relevância orgânica.

### Requirement: Sincronização Assíncrona do Índice de Busca
O sistema SHALL disparar mensagens para a fila RabbitMQ `search-index-sync` sempre que uma vaga for criada, atualizada, expirada ou excluída, permitindo que o worker de busca atualize o índice de forma desacoplada e assíncrona.

#### Scenario: Publicação de Evento de Indexação
- **WHEN** uma vaga é salva ou tem seus dados alterados
- **THEN** um evento contendo os dados normalizados da vaga é publicado na fila para indexação automática.
