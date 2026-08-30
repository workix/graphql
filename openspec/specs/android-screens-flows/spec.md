# android-screens-flows Specification

## Purpose
TBD - created by archiving change android-phase4-screens-flows. Update Purpose after archive.
## Requirements
### Requirement: Detalhe e Candidatura em Vaga de Emprego
O sistema SHALL fornecer a `JobDetailActivity` para carregar as informações completas da vaga selecionada e permitir que o candidato autenticado envie sua candidatura via `JobsApiService.subscribeJob()`.

#### Scenario: Candidatura com Sucesso
- **WHEN** o candidato clica no botão "Candidatar-se" na `JobDetailActivity`
- **THEN** a requisição é enviada com o token JWT e uma mensagem de confirmação é exibida.

### Requirement: Form de Publicação de Vaga por Empresa
O sistema SHALL disponibilizar a `PostJobActivity` permitindo que a empresa autenticada preencha os dados da oportunidade (título, descrição, localização, tipo de contrato, salário) e envie para a API REST via `JobsApiService.createJob()`.

#### Scenario: Criação de Nova Vaga
- **WHEN** a empresa submete o formulário válido em `PostJobActivity`
- **THEN** a vaga é cadastrada no backend e o aplicativo retorna à lista de vagas.

### Requirement: Form de Edição de Currículo do Candidato
O sistema SHALL disponibilizar a `PostResumeActivity` permitindo que o candidato autenticado edite seu currículo (título, resumo, habilidades, experiência, formação) e envie os dados via `ResumesApiService.saveResume()`.

#### Scenario: Atualização de Currículo
- **WHEN** o candidato salva seu currículo na `PostResumeActivity`
- **THEN** os dados são armazenados na API e os dados de perfil são atualizados.

### Requirement: Leitura de Post do Blog e Envio de Comentários
O sistema SHALL disponibilizar a `BlogPostActivity` para exibir a publicação do blog e permitir o envio de comentários pelo usuário via `BlogsApiService.createComment()`.

#### Scenario: Envio de Comentário no Blog
- **WHEN** o usuário digita e envia um comentário na `BlogPostActivity`
- **THEN** o comentário é enviado para o backend e a lista de comentários é recarregada.

