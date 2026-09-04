# governance-transparency-core Specification

## Purpose
Estabelece os pilares de transparência, governança open source e garantias públicas da Workix, definindo as regras inegociáveis dos 5 Pactos e a auditabilidade do ranqueamento orgânico.

## Requirements

### Requirement: Documentação Pública dos 5 Pactos da Workix
O sistema e o repositório aberto SHALL disponibilizar publicamente os 5 Pactos da Workix (participação gratuita, visibilidade paga identificada, preservação integral do resultado orgânico, liberação de contato sob consentimento e política sem vaga fantasma) em documentos de governança acessíveis.

#### Scenario: Consulta aos princípios no repositório aberto
- **WHEN** um desenvolvedor, usuário ou auditor acessa o `README.md`, `Workix.md` ou documentação do projeto
- **THEN** os 5 Pactos e a tabela de garantias do que nunca pode ser vendido são exibidos integralmente de forma clara e verificável.

### Requirement: Fórmula de Ranqueamento Orgânico Auditável
O sistema SHALL documentar no arquivo `RANKING.md` a fórmula de ordenação do resultado orgânico de vagas e perfis profissionais (baseada em correspondência de filtros, recência e taxa de resposta da empresa), garantindo que nenhum item gratuito seja rebaixado ou ocultado para favorecer itens pagos.

#### Scenario: Auditoria da ordenação de busca
- **WHEN** a busca de vagas ou candidatos é executada
- **THEN** o resultado orgânico é retornado estritamente de acordo com os pesos da fórmula aberta de relevância sem desvio por patrocínio comercial.

### Requirement: Fronteira Open Core e Governança de Licenciamento
O repositório principal SHALL manter o núcleo livre sob licença AGPLv3 (`LICENSE`), disponibilizar política de uso de marca (`TRADEMARK.md`), termo de contribuição com licença ampla (`CLA.md`) e guias claros de auto-hospedagem (`SELF-HOSTING.md`), demarcando que o motor de precificação e alocação de anúncios reside no módulo comercial fechado.

#### Scenario: Contribuição externa ao código aberto
- **WHEN** um contribuidor submete um Pull Request ao repositório público
- **THEN** o fluxo de validação exige concordância com o CLA garantindo a manutenção da governança open core e sustentabilidade do projeto.
