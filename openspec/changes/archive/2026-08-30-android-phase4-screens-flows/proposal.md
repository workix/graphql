## Why

Com as Fases 1, 2 e 3 concluídas (Mapeamento, Build/Arquitetura de Rede e Autenticação/Navegação Base), a Fase 4 implementa os fluxos de tela nativos completos para os 6 módulos de negócio restantes da aplicação cliente Android em **Kotlin**:
- Detalhes de Vaga (`JobDetailActivity`)
- Publicação de Nova Vaga (`PostJobActivity`)
- Detalhes do Currículo/Candidato (`CandidateDetailActivity`)
- Criação/Edição de Currículo (`PostResumeActivity`)
- Perfil Institucional da Empresa (`CompanyDetailActivity`)
- Leitura e Comentários no Blog (`BlogPostActivity`)

## What Changes

- **Módulo de Vagas**:
  - `JobDetailActivity.kt`: Exibição detalhada dos dados da vaga e ação de candidatura (`JobsApiService.subscribeJob`).
  - `PostJobActivity.kt`: Formulário nativo para empresas cadastrarem novas oportunidades (`JobsApiService.createJob`).
- **Módulo de Candidatos e Currículos**:
  - `CandidateDetailActivity.kt`: Exibição detalhada do perfil e experiências do candidato (`ResumesApiService.getResumeById`).
  - `PostResumeActivity.kt`: Formulário nativo para candidatos salvarem/atualizarem seu currículo (`ResumesApiService.saveResume`).
- **Módulo Institucional e Blog**:
  - `CompanyDetailActivity.kt`: Exibição do perfil da empresa contratante.
  - `BlogPostActivity.kt`: Leitura completa de artigos do blog e envio de comentários (`BlogsApiService.createComment`).

## Capabilities

### New Capabilities
- `android-screens-flows`: Implementação nativa em Kotlin de todas as telas de detalhamento e formulários de cadastro de vagas, currículos, empresas e interação no blog.

### Modified Capabilities

Nenhuma capacidade existente possui alteração de requisitos.

## Impact

- **Código Android**: Criação dos componentes de UI sob `android/app/src/main/java/br/com/codecode/workix/android/ui/`.
- **Funcionalidades**: Cobertura nativa de 100% (12/12) das telas do frontend cliente web no app Android.
