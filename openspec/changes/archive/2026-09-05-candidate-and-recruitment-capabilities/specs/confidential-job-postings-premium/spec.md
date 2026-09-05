## Purpose

Permite que empresas assinantes do plano Premium publiquem vagas em modo confidencial, ocultando publicamente a razão social, logotipo e dados de contato para candidatos, sem comprometer a gestão interna, triagem e relatórios.

## ADDED Requirements

### Requirement: Controle Premium para Publicação de Vagas Confidenciais
O sistema SHALL validar no backend que somente empresas com plano Premium ativo (`can('POST_CONFIDENTIAL_JOBS')`) possam criar ou atualizar vagas com a flag `isConfidential: true`.

#### Scenario: Validação de Permissão para Vaga Confidencial
- **WHEN** uma empresa Premium cria uma vaga marcando `isConfidential: true`
- **THEN** o sistema aceita a configuração e publica a vaga em modo confidencial.

### Requirement: Mascaramento Público de Identidade sem Vazamento de Dados
Quando uma vaga tiver `isConfidential: true`, o sistema SHALL retornar "Empresa Confidencial" no nome da empresa, `null` no logotipo e ocultar e-mails, telefones ou metadados identificadores nas consultas públicas consumidas por candidatos no Web e Android.

#### Scenario: Visualização de Vaga Confidencial pelo Candidato
- **WHEN** um candidato acessa a listagem ou detalhes de uma vaga confidencial
- **THEN** o nome exibido é "Empresa Confidencial", o logo padrão é anônimo e nenhum dado de identificação corporativa é exposto nos payloads JSON ou metadados da página.

### Requirement: Preservação Interna de Vínculo Relacional e Governança
O sistema SHALL preservar internamente a associação íntegra entre a vaga confidencial e a empresa dona da publicação para fins de triagem de candidatos, painel Kanban, agendamento de entrevistas, auditoria e relatórios gerenciais da própria empresa.

#### Scenario: Visualização da Vaga Confidencial pelo Recrutador Dono da Vaga
- **WHEN** o recrutador da própria empresa que publicou a vaga acessa seu painel administrativo ou Kanban
- **THEN** o sistema exibe os dados corporativos reais e permite a gestão completa do processo seletivo.
