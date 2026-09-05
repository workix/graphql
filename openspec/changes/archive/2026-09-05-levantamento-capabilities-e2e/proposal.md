## Why

Antes de escrever testes end-to-end (E2E) para os frontends admin, client, o app Android e o backend GraphQL, precisamos de um inventário confiável de todas as capabilities do sistema — o que existe de fato, não apenas o que os specs descrevem como planejado. Sem esse levantamento, o esforço de E2E corre o risco de testar apenas o "caminho feliz" documentado e ignorar lacunas reais entre spec e implementação (guards de autenticação desligados por padrão, telas Android sem navegação, mensageria "tempo real" sem subscription, etc).

## What Changes

- Criação do relatório [`CAPABILITIES.md`](../../../CAPABILITIES.md) na raiz do projeto, consolidando o levantamento de capabilities de: backend (GraphQL/REST), frontend admin, frontend client e app Android, cruzando os ~80 specs existentes em `openspec/specs/` com o código-fonte real de cada app.
- Registro explícito de que os backends legados citados no `CLAUDE.md` (`java-graphql`, `java-stack`, `workix-spring-boot`) não existem nesta máquina, e que o projeto `workix-frontend-vue` está mockado/estático e fora do escopo do plano de E2E principal.
- Documentação de gaps críticos encontrados (não corrigidos nesta mudança, apenas registrados para priorização futura):
  - Auth guard desligado por padrão em ambos os frontends web (`VITE_ENABLE_AUTH_GUARD`).
  - Gating de role inócuo no frontend admin.
  - Mensageria/notificações sem tempo real real (sem subscription/polling) apesar do spec prometer.
  - Metade das telas "novas" do Android (feed social, chat, grupos, eventos, cursos, premium, kanban, entrevistas) implementadas mas não navegáveis; Kanban e Entrevistas nem no `AndroidManifest.xml`.
  - Zero testes instrumentados (`androidTest/`) no projeto Android hoje.
- Nenhuma alteração de código de produção, regra de negócio ou schema de banco de dados é feita nesta mudança — é um levantamento/documentação que serve de base (boot) para a próxima etapa: desenho e implementação da suíte de testes E2E.

Este change **não altera comportamento do sistema** (é puramente documentação/levantamento), portanto não introduz nem modifica capabilities de produto — ver `skip_specs: true` em `.openspec.yaml`.

## Capabilities

### New Capabilities
_Nenhuma — este change não introduz comportamento novo no sistema, apenas documenta o existente._

### Modified Capabilities
_Nenhuma — nenhum requisito de comportamento é alterado._

## Impact

- **Arquivos afetados**: `CAPABILITIES.md` (novo, raiz do projeto), artefatos deste change em `openspec/changes/levantamento-capabilities-e2e/`.
- **Sistemas/áreas cobertas pelo levantamento** (sem alteração de código): `src/` (backend), `frontend/admin`, `frontend/client`, `android/app`.
- **Fora de escopo**: `workix-frontend-vue` (documentado como legado/mockado, não testado neste esforço).
- **Próximo passo** (fora deste change): usar o `CAPABILITIES.md` como insumo para um novo change de "desenho da suíte de testes E2E" por app.
