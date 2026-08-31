# Proposal: Implementação de Suporte Institucional, Ouvidoria e Equipe (`support-forms-members-core`)

## Summary
Implementar as páginas institucionais e canais de suporte no **Frontend Cliente** e no **Android**, consumindo as queries e mutations dos módulos GraphQL `forms` (`createForm`, `allForms`, `getFormById`) e `members` (`allMembers`, `getMemberById`).

## Motivation & Background
Conforme estabelecido no [`TODO.md`](file:///d:/Packsys/NetBeansProjects/graphql/TODO.md) e na especificação do ecossistema Workix:
- Os usuários, empresas e visitantes precisam de um canal institucional direto de ouvidoria, atendimento, esclarecimento de dúvidas e parcerias através de formulários estruturados (`forms`).
- A plataforma deve exibir a página institucional da equipe e fundadores do Workix (`members`), demonstrando credibilidade, governança e liderança técnica.

## Impacted Areas
- **Frontend Cliente (`frontend/client`)**:
  - `src/services/forms.service.ts`: Abstração de queries e mutations de formulários de contato e mensagens.
  - `src/services/members.service.ts`: Abstração de queries de membros da equipe institucional.
  - `src/views/ContactView.vue` (`/contact`): Formulário de contato com validação e feedback visual de envio.
  - `src/views/TeamView.vue` (`/team`): Apresentação dos membros do time institucional com cargos, foto, bio e redes sociais.
  - Rotas registradas no `router/index.ts` e atalhos no `TheFooter.vue`.
- **Android App (`android/`)**:
  - `SupportApiService.kt`: Camada de rede nativa em Kotlin para envio de formulário e consulta da equipe.
  - `ContactActivity.kt`: Formulário de contato nativo no Android.
  - `TeamFragment.kt`: Fragment nativo com lista de membros da equipe.
