# Design Document: Suporte Institucional, Ouvidoria e Equipe (`support-forms-members-core`)

## Architectural Strategy

A comunicação institucional e apresentação da equipe do Workix:
1. **Backend GraphQL (`src/modules/forms` & `src/modules/members`)**:
   - `createForm(input: FormInput!)`: Registro de nova mensagem de contato (`name`, `email`, `subject`, `message`).
   - `allForms`: Consulta de formulários cadastrados.
   - `allMembers`: Consulta dos membros da equipe institucional (`name`, `occupation`, `picture`, `shortText`, `medias`).

2. **Frontend Cliente (`frontend/client`)**:
   - `src/services/forms.service.ts`: Abstração de chamadas GraphQL de formulários.
   - `src/services/members.service.ts`: Abstração de chamadas GraphQL de membros da equipe.
   - `src/views/ContactView.vue` (`/contact`): Formulário de contato, canais de ouvidoria, horários de atendimento e validação.
   - `src/views/TeamView.vue` (`/team`): Grid de cards da liderança e equipe técnica do Workix.

3. **Android App (`android/`)**:
   - `SupportApiService.kt`: Camada de rede nativa em Kotlin com Coroutines para envio de formulário e consulta de membros.
   - `ContactActivity.kt`: Formulário de contato nativo.
   - `TeamFragment.kt`: Fragment de apresentação da equipe.
