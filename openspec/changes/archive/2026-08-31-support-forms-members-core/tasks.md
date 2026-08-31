## 1. Serviços e Camada de Dados GraphQL

- [x] 1.1 Criar `frontend/client/src/services/forms.service.ts` para mutation `createForm` e queries de formulários
- [x] 1.2 Criar `frontend/client/src/services/members.service.ts` para queries de membros da equipe

## 2. Frontend Cliente: Componentes e Views

- [x] 2.1 Criar `frontend/client/src/views/ContactView.vue` (`/contact`) com formulário de suporte e ouvidoria
- [x] 2.2 Criar `frontend/client/src/views/TeamView.vue` (`/team`) com apresentação dos membros e fundadores
- [x] 2.3 Registrar rotas `/contact` e `/team` em `frontend/client/src/router/index.ts` e adicionar atalhos em `TheFooter.vue`

## 3. Android: Camada Mobile

- [x] 3.1 Criar `SupportApiService.kt` no módulo de rede do Android
- [x] 3.2 Criar `ContactActivity.kt` e `TeamFragment.kt` no pacote `ui/support` do Android e registrar no `AndroidManifest.xml`

## 4. Validação e Testes

- [x] 4.1 Adicionar/executar testes unitários para os módulos `forms` e `members`
- [x] 4.2 Validar conformidade da proposta via `openspec validate support-forms-members-core`
