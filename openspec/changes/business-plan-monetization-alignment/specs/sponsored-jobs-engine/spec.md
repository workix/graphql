## Purpose

Especifica o motor de impulsionamento e vagas em destaque, garantindo a obrigatoriedade da rotulagem transparente, o teto de posições patrocinadas simultâneas e a não substituição do ranking orgânico.

## ADDED Requirements

### Requirement: Alocação e Compra de Destaque para Vagas
O sistema SHALL permitir a contratação de destaque para vagas (`job_boosts`, `purchases`) por período determinado (ex.: 7 ou 15 dias) via créditos do plano ou compra avulsa, respeitando o limite máximo de slots simultâneos por categoria e região (`max_concurrent_slot`).

#### Scenario: Compra de destaque avulso para vaga
- **WHEN** uma empresa com vaga ativa contrata um destaque de 7 dias via créditos ou Pix
- **THEN** o sistema ativa o registro em `job_boosts` e define o período de vigência do impulsionamento.

### Requirement: Rotulagem Obrigatória e Imutável de Vagas Patrocinadas
A API GraphQL e todas as interfaces de visualização SHALL retornar e renderizar obrigatoriamente a flag `is_sponsored = true` e o rótulo fixo `sponsor_label = 'Patrocinada'` para qualquer vaga que possua impulsionamento ativo, sem possibilidade de supressão por configuração comercial.

#### Scenario: Consulta de vagas em destaque na busca
- **WHEN** uma busca de vagas é realizada
- **THEN** as vagas patrocinadas aparecem identificadas explicitamente com o rótulo "Patrocinada" antes da lista de resultados.

### Requirement: Preservação Integral do Ranking Orgânico
O sistema SHALL retornar o resultado orgânico de vagas completo e inalterado abaixo dos slots demarcados de destaque, garantindo que vagas do plano gratuito nunca sejam removidas ou desclassificadas por motivo de patrocínio de terceiros.

#### Scenario: Exibição conjunta de vagas patrocinadas e orgânicas
- **WHEN** o candidato busca vagas em um nicho ou região
- **THEN** as vagas com destaque aparecem nos slots dedicados no topo e todas as vagas orgânicas correspondentes são listadas em seguida na ordem exata definida pela fórmula de relevância.
