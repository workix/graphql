## Context

Ver [proposal.md](proposal.md) para a motivação. O levantamento em si já foi produzido (5 sub-pesquisas paralelas: backend, admin, client, Android, workix-frontend-vue) e consolidado em [CAPABILITIES.md](../../../CAPABILITIES.md). Este documento registra como o levantamento foi conduzido e como ele deve ser usado dali para frente, já que não há "implementação" de código nesta mudança.

Constraints observadas durante o levantamento:
- Os specs em `openspec/specs/` descrevem o comportamento *pretendido*; o código nem sempre corresponde (guards de auth desligados por padrão, telas Android órfãs, mensageria sem tempo real real). O CAPABILITIES.md documenta explicitamente onde spec e código divergem, em vez de assumir que o spec é a realidade.
- Os projetos-irmãos citados no `CLAUDE.md` (`java-graphql`, `java-stack`, `workix-spring-boot`) não existem nesta máquina — o levantamento se restringiu ao que é fisicamente verificável em `D:\Packsys\NetBeansProjects`.

## Goals / Non-Goals

**Goals:**
- Produzir um inventário único e verificável (`CAPABILITIES.md`) que sirva de fonte de verdade operacional para o desenho da suíte de testes E2E.
- Sinalizar claramente, por app, quais fluxos são "Tier A" (alcançáveis/testáveis hoje) e quais são "Tier B" (código existe, mas sem navegação/integração — não testáveis via E2E convencional sem trabalho adicional).
- Registrar gaps de comportamento (auth guard, tempo real, paridade Android) sem corrigi-los — correção é fora de escopo deste change.

**Non-Goals:**
- Não é objetivo desta mudança escrever os testes E2E em si (isso é um change futuro, consumindo este relatório como insumo).
- Não é objetivo corrigir os gaps encontrados (guards desligados, telas Android órfãs, `onNewToken` stub, etc.) — cada um deve virar um item em `KNOW_ISSUES.md` ou um change próprio, com aprovação explícita antes de qualquer alteração de comportamento.
- Não cobre `workix-frontend-vue` em profundidade além de justificar sua exclusão do escopo principal.

## Decisions

1. **Specs existentes como fonte primária, código como verificação** — em vez de reconstruir o inventário do zero via leitura de código, usamos os ~80 `spec.md` já existentes (que já documentam regras de negócio) e delegamos a cada agente de pesquisa a tarefa de cruzá-los com o código real. Alternativa considerada: ignorar os specs e mapear só pelo código — rejeitada por ser redundante com trabalho já feito e mais lenta, sem ganho de precisão (specs recentes já refletem decisões arquiteturais documentadas em `SPECIFICATION.md`).
2. **Pesquisa paralela por área (5 agentes), síntese manual única** — backend, admin, client, Android e workix-vue foram investigados em paralelo por não terem dependência entre si, reduzindo o tempo total de levantamento. A síntese final (CAPABILITIES.md) foi feita centralizadamente para garantir consistência de terminologia e detectar sobreposições (ex.: o mesmo gap de "auth guard desligado" apareceu independentemente em admin e client).
3. **`workix-frontend-vue` excluído do escopo de E2E** — decisão baseada em evidência concreta (chamadas HTTP substituídas por mocks, backend de origem inexistente na máquina) e não em suposição. Registrado no CAPABILITIES.md com justificativa, não apenas omitido.
4. **`skip_specs: true` neste change** — este change é puramente documentação/levantamento; não altera nenhum requisito de comportamento do sistema, logo não gera specs delta.

## Risks / Trade-offs

- [Risco] O código pode ter mudado entre o momento da pesquisa e o momento em que a suíte de E2E for de fato escrita → Mitigação: tratar o CAPABILITIES.md como um snapshot datado (2026-09-05); antes de implementar cada suíte, revalidar rapidamente as rotas/telas citadas.
- [Risco] Os agentes de pesquisa podem ter perdido telas/endpoints não descobertos por grep/leitura de specs → Mitigação: o documento já sinaliza explicitamente os pontos de menor confiança (ex.: "confirmar entry point" em vários itens do Android); a equipe de QA deve validar esses pontos manualmente antes de escrever o teste correspondente.
- [Trade-off] Optou-se por não corrigir nenhum gap encontrado nesta mudança, mesmo os triviais (ex.: variável de ambiente do auth guard) — isso mantém o escopo do change limpo (documentação apenas), mas adia a correção. Mitigação: cada gap crítico deve ser registrado em `KNOW_ISSUES.md` como próximo passo imediato após este change.

## Migration Plan

Não aplicável — não há mudança de código, schema de banco ou infraestrutura nesta entrega. O "deploy" é a existência do arquivo `CAPABILITIES.md` no repositório.

## Open Questions

- Qual app deve ganhar a primeira suíte de E2E (prioridade de negócio)? Não decidido aqui — depende da estratégia de QA, que é uma decisão do usuário para o próximo change.
- Os gaps críticos (auth guard, mensageria sem tempo real, telas Android órfãs) devem ser corrigidos antes ou depois de escrever os testes E2E correspondentes? Recomenda-se discutir por gap, não decidir genericamente aqui.
