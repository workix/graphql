## Purpose

Garante a integridade das vagas anunciadas no ecossistema Workix, eliminando vagas fantasmas por meio de validade compulsória, exigência de desfecho e publicação transparente da taxa de resposta das empresas contratantes.

## ADDED Requirements

### Requirement: Validade Obrigatória e Expiração Automática de Vagas
O sistema SHALL exigir uma data limite de vigência/validade para toda vaga cadastrada e executar job periódico de expiração que encerra e arquiva automaticamente as vagas vencidas, notificando a empresa para registro de desfecho.

#### Scenario: Expiração automática de vaga vencida
- **WHEN** a data atual ultrapassa a data de validade da vaga (`expires_at`)
- **THEN** o sistema altera o status da vaga para expirada/arquivada, remove a vaga das buscas ativas e solicita que a empresa forneça o desfecho das candidaturas.

### Requirement: Registro Obrigatório de Desfecho de Candidatura
O sistema SHALL disponibilizar fluxo para encerramento de processos seletivos com registro explícito do status de conclusão para cada candidato participante (contratado, não selecionado ou cancelado), impedindo processos indefinidamente abertos.

#### Scenario: Encerramento de processo seletivo com desfecho
- **WHEN** a empresa finaliza um processo seletivo
- **THEN** todos os candidatos recebem notificação com o status final de sua participação e a vaga é marcada como concluída com desfecho registrado.

### Requirement: Cálculo e Exibição Pública da Taxa de Resposta da Empresa
O sistema SHALL executar rotina diária de cálculo da taxa de resposta dos últimos 90 dias (`response_rate_90d`) e do tempo mediano de resposta de cada empresa, exibindo essas métricas publicamente na página de perfil da empresa.

#### Scenario: Exibição da taxa de resposta na página da empresa
- **WHEN** um candidato visita o perfil público de uma empresa contratante
- **THEN** a página exibe de forma destacada a porcentagem de candidatos respondidos nos últimos 90 dias e o tempo médio de resposta.

### Requirement: Critérios Auditados para Concessão do Selo de Empresa Verificada
O sistema SHALL conceder o Selo de Empresa Verificada exclusivamente para organizações que comprovem CNPJ ativo na Receita Federal, domínio corporativo válido, taxa de resposta igual ou superior a 80% nos últimos 90 dias e tempo mediano de resposta de até 14 dias, suspendendo o selo automaticamente caso o desempenho caia abaixo do limite.

#### Scenario: Suspensão automática do selo por queda na taxa de resposta
- **WHEN** a taxa de resposta de 90 dias de uma empresa verificada cai abaixo de 80%
- **THEN** o selo de verificação é suspenso imediatamente, a cobrança do selo é pausada e a empresa é notificada para regularização.
