## Purpose

Especifica o fluxo de upload seguro de arquivos e anexos de mídia no cliente web e o acompanhamento de candidaturas e processos seletivos no aplicativo mobile Android e no painel admin.

## ADDED Requirements

### Requirement: Upload Seguro de Arquivos e Mídias
O sistema SHALL fornecer serviço de upload com obtenção prévia de URL assinada via mutation `requestUploadUrl(input: RequestUploadInput!)` e confirmação de upload via mutation `confirmUpload(id: ID!)`.

#### Scenario: Upload de imagem de perfil ou currículo
- **WHEN** o usuário seleciona um arquivo local no frontend cliente
- **THEN** uma URL temporária é requisitada, o arquivo é enviado e a mídia é confirmada no backend.

### Requirement: Acompanhamento de Processos Seletivos no Android
O sistema SHALL listar os processos seletivos e candidaturas ativas do usuário no app Android via query `mySelectiveProcessesSubscribed` através do `MyApplicationsFragment.kt`.

#### Scenario: Visualização de processos inscritos no Android
- **WHEN** o candidato acessa a aba "Minhas Candidaturas" no app Android
- **THEN** os processos seletivos com cargo, data de início, expiração e status são listados.

### Requirement: Moderação de Processos Seletivos no Admin
O sistema SHALL permitir que administradores visualizem e moderem processos seletivos via query `allSelectiveProcessesPaginated` e mutation `deleteSelectiveProcess`.

#### Scenario: Gestão de processos no Admin
- **WHEN** o administrador acessa `/selective-processes` no painel administrativo
- **THEN** a tabela de processos seletivos com vagas vinculadas é exibida.
