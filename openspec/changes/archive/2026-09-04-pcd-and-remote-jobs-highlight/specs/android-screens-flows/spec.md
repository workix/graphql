## MODIFIED Requirements

### Requirement: Detalhe e Candidatura em Vaga de Emprego
O sistema SHALL fornecer a `JobDetailActivity` para carregar as informações completas da vaga selecionada, exibindo badges de acessibilidade para pessoas com deficiência (`is_pcd: true`, `pcd_details`) e modalidade de trabalho remoto (`is_remote: true`, `workplace_type: REMOTE`), e permitir que o candidato autenticado envie sua candidatura via `JobsApiService.subscribeJob()`.

#### Scenario: Candidatura com Sucesso
- **WHEN** o candidato clica no botão "Candidatar-se" na `JobDetailActivity`
- **THEN** a requisição é enviada com o token JWT e uma mensagem de confirmação é exibida mantendo visíveis os badges de PCD e trabalho remoto.

### Requirement: Form de Publicação de Vaga por Empresa
O sistema SHALL disponibilizar a `PostJobActivity` permitindo que a empresa autenticada preencha os dados da oportunidade (título, descrição, localização, tipo de contrato, salário, opções explícitas para aceitar candidatos PCD `is_pcd`/`pcd_details` e modalidade remota `is_remote`/`workplace_type`) e envie para a API via `JobsApiService.createJob()`.

#### Scenario: Criação de Nova Vaga
- **WHEN** a empresa submete o formulário válido em `PostJobActivity` com indicação de vaga PCD e remota
- **THEN** a vaga é cadastrada no backend com os atributos `is_pcd` e `is_remote` e o aplicativo retorna à lista de vagas.
