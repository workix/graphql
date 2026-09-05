## Purpose

Especifica a funcionalidade de consulta de processos seletivos ativos e concorrentes de candidatos na plataforma, disponibilizada com exclusividade para empresas assinantes do plano Premium, com respeito às políticas de privacidade e consentimento.

## ADDED Requirements

### Requirement: Consulta de Processos Seletivos Ativos de Candidatos por Empresas Premium
O sistema SHALL disponibilizar para empresas autenticadas com plano Premium a consulta de processos seletivos em andamento do candidato via query `candidateActiveProcesses(candidateId: ID!)` e campo `activeProcessesSummary` em `Candidate`, retornando:
1. Confirmação booleana se o candidato participa ativamente de outros processos seletivos na plataforma;
2. Contagem total de processos seletivos ativos em andamento;
3. Lista de processos seletivos ativos com cargo/vaga, data de inscrição e status atual do candidato (ex.: Em Análise, Triagem, Entrevista, Proposta);
4. Identificação da empresa ou indicação de "Empresa Confidencial" quando a vaga de origem for anônima/confidencial.

#### Scenario: Empresa Premium consulta processos ativos de um candidato
- **WHEN** uma empresa com plano Premium ativo acessa o perfil do candidato `/candidates/:id` ou visualiza o candidato no Kanban `/kanban/:jobId`
- **THEN** o sistema exibe o total de processos seletivos em andamento, a lista de vagas concorridas e o status atualizado do candidato em cada seleção.

#### Scenario: Visualização do resumo no perfil do candidato
- **WHEN** o recrutador Premium abre os detalhes do candidato
- **THEN** o sistema renderiza um badge informativo em destaque (ex.: "Participando de 3 processos ativos na plataforma") com modal/dropdown detalhado das etapas.

### Requirement: Gating de Entitlement e Restrição para Empresas Gratuitas
O sistema SHALL validar a permissão corporativa `can(organizationId, 'VIEW_CANDIDATE_ACTIVE_PROCESSES')` antes de retornar os dados de processos ativos de candidatos. Caso a empresa não possua plano Premium ativo ou o usuário seja anônimo/candidato, o sistema SHALL negar o acesso aos detalhes ou retornar resumo bloqueado com CTA de contratação de plano.

#### Scenario: Empresa do plano gratuito tenta visualizar processos ativos
- **WHEN** uma empresa sem assinatura Premium tenta consultar `candidateActiveProcesses` ou visualizar os processos concorrentes de um candidato
- **THEN** o sistema bloqueia a visualização detalhada e apresenta mensagem informando que o recurso é exclusivo para assinantes do plano Premium.

#### Scenario: Candidato visualiza seu próprio perfil
- **WHEN** o próprio candidato visualiza seus dados
- **THEN** ele pode visualizar suas candidaturas normalmente através de sua área exclusiva de candidaturas.

### Requirement: Mascaramento e Conformidade de Privacidade
O sistema SHALL aplicar regras de proteção a vagas confidenciais e conformidade com a LGPD: se um processo seletivo pertencer a uma vaga marcada como `isConfidential = true`, o nome e o logo da empresa contratante SHALL ser substituídos por "Empresa Confidencial", mantendo visível apenas o título da posição e o status no processo.

#### Scenario: Processo seletivo concorrente é de uma vaga confidencial
- **WHEN** a empresa Premium visualiza os processos ativos de um candidato e um dos processos é de vaga confidencial
- **THEN** os detalhes do processo exibem o cargo e a etapa, mas omitem a razão social e identificação da empresa concorrente.
